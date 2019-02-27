import * as React from "react";
import { Text } from "react-native";
import { CurrentExercise } from "../stores/WorkoutStore";
import { Card } from "./Card";

interface Props {
    header: string;
    currentExercises: CurrentExercise[];
}

const exerciseShortName = {
    Squat: "SQ",
    Deadlift: "DL",
    "Bench Press": "BP",
    "Overhead Press": "OHP",
    "Barbell Row": "ROW"
};

export const HistoryCard: React.FC<Props> = ({ header, currentExercises }) => {
    return (
        <Card>
            <Text>{header}</Text>
            {currentExercises.map((ex, idx) => {
                return (
                    <Text key={ex.exercise + idx}>
                        {`${exerciseShortName[ex.exercise as keyof typeof exerciseShortName]} ${
                            ex.numSets
                        }x${ex.reps} ${ex.weight}`}
                    </Text>
                );
            })}
        </Card>
    );
};
