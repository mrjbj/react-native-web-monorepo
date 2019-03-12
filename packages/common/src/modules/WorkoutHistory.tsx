// WorkoutHistory.tsx - React function object
// 0. Sample exercise set created from <WorkoutHistory />.onPress()  before calling.
// 1. Iterate through each exercise in exercises[] and create a <WorkoutCard /> for each.
// 2. Specify the onSetPress(setIndex) logic to be called by <WorkoutCard /> should
//    it's circle widget ever be clicked
//
// Implementation Notes
// 1. Global RootStoreContext is imported via react.useContext (provides access to mobx state data)
// 2. main function is decorated with observer() to register listener for any @observable() changes in state
// 3. Since using mobx for state management, can just mutate directly as in "e.sets[setIndex] = newValue"
// WorkoutHistory page
// observes RouterStore.screen via RouterStoreContext
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { RouteComponentProps } from "react-router";
import { RootStoreContext } from "../stores/RootStore";
import { CurrentExercise } from "../stores/WorkoutStore";
import { HistoryCard } from "../ui/HistoryCard";

interface Props extends RouteComponentProps {}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row"
    },
    cardContainer: {
        flex: 1,
        padding: 10
    }
});

// load up sample exercises when user clicks "Create Workout"
export const WorkoutHistory: React.FC<Props> = observer(({ history }) => {
    const rootStore = React.useContext(RootStoreContext);

    const rows: Array<
        Array<{
            date: string;
            exercises: CurrentExercise[];
        }>
    > = [];

    Object.entries(rootStore.workoutStore.history).forEach(([date, exercises], idx) => {
        // Obj.entries turns obj into array.
        // array is keyed array of Current exercise
        // so as we iterate across each one, we have a key [date],
        // plus the value tied to that date (which is an array of current exercise)
        // destructuring the array via [] syntax in the map parameters gives us
        // date and v.
        // const hc = (
        //     <View key={dt} style={styles.cardContainer}>
        //         <HistoryCard header={dt} currentExercises={v} />
        //     </View>
        // );
        // // even entries go on column 0
        if (idx % 3 === 0) {
            rows.push([{ date, exercises }]);
        } else {
            // odd entries go in column 1
            rows[rows.length - 1].push({ date, exercises });
        }
    });
    console.log("JSX Rows = ", rows);
    return (
        <View>
            <Text>Workout History Page</Text>
            <Button
                title="Create Workout"
                onPress={() => {
                    // push set of sample exercises onto currentExercise[]
                    rootStore.workoutStore.currentExercises.push(
                        {
                            exercise: "Squat",
                            numSets: 5,
                            reps: 5,
                            sets: ["", "", "", "", ""],
                            weight: 260
                        },
                        {
                            exercise: "Bench Press",
                            numSets: 5,
                            reps: 5,
                            sets: ["5", "5", "5", "5", "5"],
                            weight: 200
                        },
                        {
                            exercise: "Deadlift",
                            numSets: 1,
                            reps: 5,
                            sets: ["", "x", "x", "x", "x"],
                            weight: 360
                        }
                    );
                    // change pages by pushing
                    history.push("/current-workout");
                }}
            />
            <FlatList
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        {item.map(({ date, exercises }) => (
                            <View key={date} style={styles.cardContainer}>
                                <HistoryCard header={date} currentExercises={exercises} />
                            </View>
                        ))}
                        {item.length < 3 ? <View style={styles.cardContainer} /> : null}
                        {item.length < 2 ? <View style={styles.cardContainer} /> : null}
                    </View>
                )}
                data={rows}
                keyExtractor={item => item.reduce((pv, cv) => pv + " " + cv.date, "")}
            />
        </View>
    );
});
