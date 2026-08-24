import React from 'react';
import { Play, Loader2, FolderOpen, Download } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { runCompilation } from '../../store/slices/compilerSlice';
import { useFileHandler } from '../../hooks/luseFileHandler';

export const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sourceCode, isCompiling } = useAppSelector((state) => state.compiler);
    const {
        fileInputRef,
        handleOpenFile,
        handleFileChange,
        downloadSourceCode,
        downloadTranslatedCode,
        canDownloadOutput,
    } = useFileHandler();

    return (
        <header className="h-12 bg-codex-bg border border-codex-surface rounded-xl flex items-center justify-between px-4 shrink-0">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".lat"
                className="hidden"
            />

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-bold text-base text-codex-text">
                    <span className="text-codex-keyword">Codex</span> Latinus IDE
                </div>

                <div className="h-4 w-px bg-codex-surface" />

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleOpenFile}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-codex-comment hover:text-codex-text hover:bg-codex-surface/50 transition-colors cursor-pointer"
                        title="Open .lat file"
                    >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open</span>
                    </button>

                    <button
                        onClick={downloadSourceCode}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-codex-comment hover:text-codex-text hover:bg-codex-surface/50 transition-colors cursor-pointer"
                        title="Save .lat file"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save .lat</span>
                    </button>

                    {canDownloadOutput && (
                        <button
                            onClick={downloadTranslatedCode}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-codex-string/80 hover:text-codex-string hover:bg-codex-surface/50 transition-colors cursor-pointer"
                            title="Export .pig file"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export .pig</span>
                        </button>
                    )}
                </div>
            </div>

            <button
                onClick={() => dispatch(runCompilation(sourceCode))}
                disabled={isCompiling}
                className="flex items-center gap-2 bg-codex-keyword text-[#11111b] px-4 py-1.5 rounded-lg font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
            >
                {isCompiling ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                )}
                {isCompiling ? 'Compiling...' : 'Run Code'}
            </button>
        </header>
    );
};