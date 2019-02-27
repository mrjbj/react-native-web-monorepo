// CurrentWorkout.tsx - React function object
// 0. Sample exercise set created by <WorkoutHistory.onPress() /> prior to invocation.
// 1. Iterate through each exercise as setup in exercises[] beforehand and create a separate <WorkoutCard /> for each.
// 2. Implement "onSetPress()" as buttbnClick logic to be passed into each <WorkoutCard /> via "props"
// 3. Save button saves the currentExercise set to WorkoutHistory (a workout set keyed by date).
//
// Implementation Notes
// 1. Global RootStoreContext is imported via react.useContext (provides access to mobx state data)
// 2. main function is decorated with observer() to register listener for any @observable() changes in state
// 3. Since using mobx for state management, can just mutate directly as in "e.sets[setIndex] = newValue"
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { RouteComponentProps } from "react-router";
import { RootStoreContext } from "../stores/RootStore";
import { WorkoutCard } from "../ui/WorkoutCard";
import { WorkoutTimer } from "../ui/WorkoutTimer";

interface Props extends RouteComponentProps {} // adds in "history" property
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa"
    },
    scrollContainer: {
        padding: 10,
        marginBottom: 50,
    }
});

export const CurrentWorkout: React.FC<Props> = observer(({ history }) => {
    const rootStore = React.useContext(RootStoreContext);
    // useEffect runs "cleanup function" whenever component is mounted.
    // it runs after render but before the next render.
    // in this case, we want to stop the timer should <CurrentWorkout /> go out of
    // scope before the "x" was clicked to stop timer otherwise.
    // [] as second parameter means the timer effect does not depend on any values
    // in the component.  therefore no need to run it after each update.  Only run it
    // upon mount. if no second parameter supplied, it would run on every update.
    React.useEffect(() => {
        console.log("useEffect triggered");
        return () => {
            rootStore.workoutTimerStore.stopTimer();
        };
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {rootStore.workoutStore.currentExercises.map(e => {
                    return (
                        // CONFIRM: setIndex is passed in by React as int offest automatically?
                        <WorkoutCard
                            exercise={e.exercise}
                            key={e.exercise}
                            repsAndWeight={`${e.numSets}x${e.reps} ${e.weight}`}
                            sets={e.sets}
                            onSetPress={setIndex => {
                                let newValue: string;
                                const v = e.sets[setIndex]; // string value like "5"
                                // start timer when user clicks button;
                                rootStore.workoutTimerStore.startTimer();

                                if (v === "") {
                                    newValue = `${e.reps}`;
                                } else if (v === "0") {
                                    newValue = "";
                                    rootStore.workoutTimerStore.stopTimer();
                                } else {
                                    newValue = `${parseInt(v) - 1}`;
                                }
                                e.sets[setIndex] = newValue;
                            }}
                        />
                    );
                })}
                <Button
                    title="SAVE"
                    onPress={() => {
                        // save current exercises to workout history using date as index key (& then clear)
                        rootStore.workoutStore.history[
                            dayjs(
                                new Date(+new Date() - Math.floor(Math.random() * 10000000000))
                            ).format("YYYY-MM-DD")
                        ] = rootStore.workoutStore.currentExercises;
                        rootStore.workoutStore.currentExercises = [];
                        history.push("/");
                    }}
                />
            </ScrollView>
            {// only show workout timer when isRunning
            // need the lambda syntax around stopTimer call because function was
            // invoked from within context of onXPress, which changed the execution
            // environment such that "this" points to onXpress rather than
            // WorkoutTimerStore.
            // of the mobx observeable?
            rootStore.workoutTimerStore.isRunning ? (
                <WorkoutTimer
                    percent={rootStore.workoutTimerStore.percent}
                    currentTime={rootStore.workoutTimerStore.display}
                    onXPress={rootStore.workoutTimerStore.stopTimer}
                />
            ) : null}
        </View>
    );
});
