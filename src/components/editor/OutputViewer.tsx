import React from 'react';
import Editor from '@monaco-editor/react';
import { useAppSelector } from '../../hooks/useRedux';

export const OutputViewer: React.FC = () => {
    const response = useAppSelector((state) => state.compiler.response);
    const translatedCode = response?.translatedCode || '// No translated code available yet.';

    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700 text-slate-300 text-sm font-medium">
                <span>Salida Traducida: output.pig</span>
            </div>
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    defaultLanguage="text"
                    theme="vs-dark"
                    value={translatedCode}
                    options={{
                        readOnly: true,
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
};