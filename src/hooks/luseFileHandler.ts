import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { setSourceCode } from "../store/slices/compilerSlice";
import { readTextFile, downloadTextFile } from "../utils/fileUtils";

export const useFileHandler = () => {
    const dispatch = useAppDispatch();
    const sourceCode = useAppSelector((state) => state.compiler.sourceCode);
    const translatedCode = useAppSelector(
        (state) => state.compiler.response?.translatedCode
    );
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleOpenFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const content = await readTextFile(file);
            dispatch(setSourceCode(content));
        } catch (error) {
            console.error("Failed to read source file:", error);
        } finally {
            if (event.target) {
                event.target.value = "";
            }
        }
    };

    const downloadSourceCode = () => {
        downloadTextFile(sourceCode, "main.lat");
    };

    const downloadTranslatedCode = () => {
        if (translatedCode) {
            downloadTextFile(translatedCode, "output.pig");
        }
    };

    return {
        fileInputRef,
        handleOpenFile,
        handleFileChange,
        downloadSourceCode,
        downloadTranslatedCode,
        canDownloadOutput: Boolean(translatedCode),
    };
};
