import { configureStore } from "@reduxjs/toolkit";
import compilerReducer from "./slices/compilerSlice";
import stackSimulatorReducer from "./slices/stackSimulatorSlice";

export const store = configureStore({
    reducer: {
        compiler: compilerReducer,
        stackSimulator: stackSimulatorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
