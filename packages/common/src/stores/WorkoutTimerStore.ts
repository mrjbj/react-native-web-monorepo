import dayjs from "dayjs";
import { action, computed, observable } from "mobx";
import {persist} from "mobx-persist";

// save the start time, then compute the elapsed time as diff from now() versus then.
// isRunning tells us if timer is running or not.
// @action methods to start and end the timer affect isRunning.
//         (action methods are a way of tagging methods authorized to change
//          observable attributes in mobx)
// method "measure" computes new elapsed seconds at setInterval
export class WorkoutTimerStore {
    @persist("object") @observable startTime = dayjs();
    @persist @observable isRunning = false;
    @persist @observable seconds = 0;

    @action measure = () => {
        // terminating condition for recursion.  if !isRunning, then exit
        if (!this.isRunning) return;
        // changing stateful variable will trigger a react render event
        this.seconds = dayjs().diff(this.startTime, "second");
        // wait 5 seconds, call again recursively every 1000 milliseconds (1 second)
        setTimeout(() => this.measure(), 1000);
    };

    // stops the recursive, continual calling of measure
    @action stopTimer = () => {
        this.isRunning = false;
        this.seconds = 0;
    };

    @action startTimer = () => {
        this.isRunning = true;
        this.startTime = dayjs();
        this.measure();
    };

    // using "get" to turn this function into a property. Any reference to property
    // will execute the function and return its value, rather than returning the code
    // itself. This means we can pass the property as "rootStore.display" rather
    // than "rootStore.display()")
    @computed get display() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60; // to remove fractional milliseconds
        return `${padZero(minutes)}:${padZero(seconds)}`;
    }
    @computed get percent() {
        const timePeriod = 180;
        return `${Math.min(100, (this.seconds / timePeriod) * 100)}%`;
    }
}

// utility function to pad time with leading zero
const padZero = (n: number) => {
    if (n >= 10) {
        return n;
    }
    return `0${n}`;
};
