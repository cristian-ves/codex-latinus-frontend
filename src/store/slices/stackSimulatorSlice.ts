import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ParserStackEvent } from "../../types/compiler.types";

interface StackSimulatorState {
    events: ParserStackEvent[];
    currentStep: number;
    isPlaying: boolean;
    playbackSpeed: number; // in milliseconds
}

const initialState: StackSimulatorState = {
    events: [],
    currentStep: 0,
    isPlaying: false,
    playbackSpeed: 500,
};

export const stackSimulatorSlice = createSlice({
    name: "stackSimulator",
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<ParserStackEvent[]>) => {
            state.events = action.payload;
            state.currentStep = 0;
            state.isPlaying = false;
        },
        stepForward: (state) => {
            if (state.currentStep < state.events.length - 1) {
                state.currentStep += 1;
            } else {
                state.isPlaying = false;
            }
        },
        stepBackward: (state) => {
            if (state.currentStep > 0) {
                state.currentStep -= 1;
            }
        },
        goToStep: (state, action: PayloadAction<number>) => {
            if (action.payload >= 0 && action.payload < state.events.length) {
                state.currentStep = action.payload;
            }
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
        setSpeed: (state, action: PayloadAction<number>) => {
            state.playbackSpeed = action.payload;
        },
        resetSimulator: (state) => {
            state.currentStep = 0;
            state.isPlaying = false;
        },
    },
});

export const {
    setEvents,
    stepForward,
    stepBackward,
    goToStep,
    togglePlay,
    setSpeed,
    resetSimulator,
} = stackSimulatorSlice.actions;

export default stackSimulatorSlice.reducer;
