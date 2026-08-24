import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const ErrorConsole: React.FC = () => {
    const errors = useAppSelector((state) => state.compiler.response?.errors);

    return (
        <div className="h-full flex flex-col bg-codex-bg font-mono text-xs select-none">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#181825] border-b border-codex-surface text-codex-comment font-sans text-xs">
                <span className="font-semibold text-codex-text uppercase tracking-wider text-[11px]">
                    Problems
                </span>
                <span className="text-[11px] text-codex-comment font-mono">
                    {errors?.length ?? 0} errors
                </span>
            </div>

            <div className="flex-1 overflow-auto">
                {!errors || errors.length === 0 ? (
                    <div className="p-3 text-codex-comment text-xs font-mono">
                        No errors found.
                    </div>
                ) : (
                    <div className="divide-y divide-codex-surface/30">
                        {errors.map((error, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-codex-surface/40 transition-colors cursor-pointer"
                            >
                                {error.type === 'SYNTAX' ? (
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                )}
                                <span className="text-codex-comment shrink-0 font-mono">
                                    [{error.line}:{error.column}]
                                </span>
                                <span className="text-codex-text truncate font-sans">
                                    {error.message}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};