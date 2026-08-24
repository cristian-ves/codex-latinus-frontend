import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { type CompileResponse } from "../../types/compiler.types";
import { compileCode as compileCodeApi } from "../../api/compilerApi";
import { setEvents } from "./stackSimulatorSlice";

interface CompilerState {
    sourceCode: string;
    isCompiling: boolean;
    response: CompileResponse | null;
    activeTab: "ast" | "symbols" | "stack" | "output";
    errorMessage: string | null;
}

const DEFAULT_LAT_CODE = `VARIABILES>
    esto contador : numerus 0;

MAIOR>
    dum (contador < 5) {
        contador = contador + 1;
    } finis;
FINIS;
`;

const initialState: CompilerState = {
    sourceCode: DEFAULT_LAT_CODE,
    isCompiling: false,
    response: null,
    activeTab: "ast",
    errorMessage: null,
};

export const runCompilation = createAsyncThunk(
    "compiler/runCompilation",
    async (code: string, { dispatch, rejectWithValue }) => {
        try {
            const data = await compileCodeApi({ code });
            dispatch(setEvents(data.parserStack ?? []));
            return data;
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue(err.message);
            }
            return rejectWithValue(
                "An unknown error occurred during compilation."
            );
        }
    }
);

export const compilerSlice = createSlice({
    name: "compiler",
    initialState,
    reducers: {
        setSourceCode: (state, action: PayloadAction<string>) => {
            state.sourceCode = action.payload;
        },
        setActiveTab: (
            state,
            action: PayloadAction<"ast" | "symbols" | "stack" | "output">
        ) => {
            state.activeTab = action.payload;
        },
        clearCompilerState: (state) => {
            state.response = null;
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(runCompilation.pending, (state) => {
                state.isCompiling = true;
                state.errorMessage = null;
            })
            .addCase(runCompilation.fulfilled, (state, action) => {
                state.isCompiling = false;
                state.response = action.payload;
            })
            .addCase(runCompilation.rejected, (state, action) => {
                state.isCompiling = false;
                state.errorMessage = action.payload as string;
            });
    },
});

export const { setSourceCode, setActiveTab, clearCompilerState } =
    compilerSlice.actions;
export default compilerSlice.reducer;
