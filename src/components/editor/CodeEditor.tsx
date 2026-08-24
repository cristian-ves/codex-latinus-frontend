import React, { useRef, useEffect } from 'react';
import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setSourceCode } from '../../store/slices/compilerSlice';
import { setupMonacoCodex } from './monacoSetup';

type StandaloneCodeEditor = Parameters<OnMount>[0];

export const CodeEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const sourceCode = useAppSelector((state) => state.compiler.sourceCode);
    const errors = useAppSelector((state) => state.compiler.response?.errors);

    const editorRef = useRef<StandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            dispatch(setSourceCode(value));
        }
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                const currentErrors = errors ?? [];
                const markers = currentErrors.map((err) => ({
                    severity: monacoRef.current!.MarkerSeverity.Error,
                    message: `[${err.type}] ${err.message}`,
                    startLineNumber: err.line,
                    startColumn: err.column,
                    endLineNumber: err.line,
                    endColumn: err.column + 3,
                }));

                monacoRef.current.editor.setModelMarkers(model, 'compiler', markers);
            }
        }
    }, [errors]);

    return (
        <div className="h-full w-full flex flex-col border-r border-codex-surface bg-codex-bg min-h-0">
            <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-codex-surface text-codex-text text-sm font-medium shrink-0">
                <span>main.lat</span>
            </div>
            <div className="flex-1 min-h-0 w-full relative">
                <Editor
                    height="100%"
                    width="100%"
                    defaultLanguage="codex"
                    theme="codex-dark"
                    value={sourceCode}
                    onChange={handleEditorChange}
                    beforeMount={setupMonacoCodex}
                    onMount={handleEditorDidMount}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        formatOnPaste: true,
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    }}
                />
            </div>
        </div>
    );
};