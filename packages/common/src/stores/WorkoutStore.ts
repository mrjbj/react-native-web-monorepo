///----------------
// WorkoutStore.ts
// holds mobx context for workout history page
// Contains:
//   - set => array of strings, showing number of reps performed in that set.
//   - Exercise => exercise props (e.g. name, weight) + array of sets for each set performed.
//   - WorkoutHistory => array of exercies performed on a given day.
//---------------
import { observable } from "mobx";
import { persist } from "mobx-persist";
import { RootStore } from "./RootStore";

type WorkoutDay = "a" | "b";

// see example A below, for sample object layout.
export interface CurrentExercise {
    weight: number;
    reps: number;
    numSets: number;
    exercise: string;
    sets: string[];
}
// "2019-02-26": CurrentExercise[]
interface WorkoutHistory {
    [key: string]: CurrentExercise[];
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
    @persist lastWorkoutType: WorkoutDay;
    @persist("list") @observable currentExercises: CurrentExercise[] = [];
    @persist("object") history: WorkoutHistory = {};
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
