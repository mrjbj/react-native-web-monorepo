// Router Component - used to switch screen pages
//
// <Router /> contains <Workout /> and <CurrentWorkout /> components (pages)
// <Router /> also holds reference to RouterStoreContext.screen property.
// RouterStoreContext is injected into <Router /> via the useContext hook
// and is used to control the page that is returned by <Router's /> render logic.
import React from "react";
import { CurrentWorkout } from "./modules/CurrentWorkout";
import { WorkoutHistory } from "./modules/WorkoutHistory";
import { Route, Router, Switch } from "./Router/index"; // react (native or web) will select appropriate file

// router observes the current screen page observable as defined in WorkoutStoreContext
export const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={WorkoutHistory} />
                <Route exact path="/current-workout" component={CurrentWorkout} />
            </Switch>
        </Router>
    );
};
