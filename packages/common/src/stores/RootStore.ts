// "root" store - the master store that provides wrapper around more specialized
// stores (like "router" or "workout" stores) that can be accessed from anywhere
//
//
import { create } from "mobx-persist";
import { createContext } from "react";
import { AsyncStorage } from "react-native";
import { WorkoutStore } from "./WorkoutStore";
import { WorkoutTimerStore } from "./WorkoutTimerStore";

const hydrate = create({
    storage: AsyncStorage, // react native works both app and web
    jsonify: true
});

// 1. Create RootStoreContext, the primary store container for child mobx stores.
//    This way, only need one "react context" to access all of the child
//    "mobx" stores from anywhere.
// 2. Instantiate child mobx stores for "routing" and "workout"
// 3. Inject this "root store" into each "moxx child store" by passing it's "this" reference
//    into the constructor, thus allowing the child to point back to root.
// 4. Inject "root store" into the ui via useContext in the component, thus allowing access
//    to the mobx managed variables from anywhere on the ui
// 5. exports or returns a new singleton react context containing one "root store"
export class RootStore {
    workoutStore = new WorkoutStore(this);
    workoutTimerStore = new WorkoutTimerStore(); // don't need pointer back to root
    constructor() {
        // pass in storagekey, plus mobx store
        hydrate("workoutTimer", this.workoutTimerStore).then(() => {
            if (this.workoutTimerStore.isRunning) {
                this.workoutTimerStore.measure(); // kick-off timer upon hydrate
            }
        });
        hydrate("workout", this.workoutStore);
    }
}

export const RootStoreContext = createContext(new RootStore());
