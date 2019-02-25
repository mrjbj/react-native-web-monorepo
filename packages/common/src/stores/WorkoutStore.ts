///----------------
// WorkoutStore.ts
// holds mobx context for workout history page
// mobx state embedded in react context object created in RootStore.ts
// Notes:
//    - @observable property members include:
//      - currentSquat
//      - currentBenchPress
//      - currentOverheadPress
//      - currentDeadlift
//      - currentBarbellRow
//      - lastWorkoutType
//      - workoutHistory
//---------------
import { observable } from "mobx";
import { persist } from "mobx-persist";
import { RootStore } from "./RootStore";

type WorkoutDay = "a" | "b";

// see example A below, for sample object layout.
interface WorkoutHistory {
    [key: string]: Array<{
        exercist: string;
        value: number;
    }>;
}
interface CurrentExercise {
    weight: number;
    reps: number;
    numSets: number;
    exercise: string;
    sets: string[];
}
// setup pointer back to rootContext via mobx store reference injected into construtor
export class WorkoutStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
    @persist @observable currentSquat: number;
    @persist @observable currentBenchPress: number;
    @persist @observable currentOverheadPress: number;
    @persist @observable currentDeadlift: number;
    @persist @observable currentBarbellRow: number;
    @persist("list") @observable currentExercises: CurrentExercise[] = [];
    @persist lastWorkoutType: WorkoutDay;
    @persist("list") history: WorkoutHistory;
}

// Example A
/*
    {
        "2019-02-18" : [
            {exercise: "Squat", value: 50},
            {exercise: "benchpress", value: 50},
            {exercise: "deadlift", value: 50},
        ]
    }
*/
