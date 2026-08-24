import React from 'react';
import { Navbar } from './Navbar';
import { CodeEditor } from '../editor/CodeEditor';
import { ErrorConsole } from '../errors/ErrorConsole';
import { SymbolTableView } from '../symbols/SymbolTableView';
import { StackVisualizer } from '../stack/StackVisualizer';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setActiveTab } from '../../store/slices/compilerSlice';
import { Play, AlertCircle } from 'lucide-react';
import { AstGraphViewer } from '../ast/ASTGraphViewer';

export const MainLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { activeTab, errorMessage, response, isCompiling } = useAppSelector(
        (state) => state.compiler
    );

    return (
        <div className="flex flex-col h-screen w-screen bg-[#11111b] text-codex-text font-sans overflow-hidden p-2 gap-2">
            <Navbar />

            <main className="flex-1 flex flex-row gap-2 overflow-hidden min-h-0">
                <div className="w-1/2 h-full flex flex-col gap-2 min-h-0">
                    <div className="flex-1 min-h-0 border border-codex-surface rounded-xl overflow-hidden bg-codex-bg">
                        <CodeEditor />
                    </div>
                    <div className="h-44 shrink-0 border border-codex-surface rounded-xl overflow-hidden bg-codex-bg">
                        <ErrorConsole />
                    </div>
                </div>

                <div className="w-1/2 h-full flex flex-col border border-codex-surface rounded-xl bg-codex-bg overflow-hidden min-h-0">
                    <div className="flex border-b border-codex-surface bg-[#181825] shrink-0">
                        {(['ast', 'symbols', 'stack', 'output'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => dispatch(setActiveTab(tab))}
                                className={`px-5 py-2.5 text-xs font-semibold tracking-wider transition-colors uppercase cursor-pointer ${activeTab === tab
                                    ? 'border-b-2 border-codex-keyword text-codex-keyword bg-codex-surface/40'
                                    : 'text-codex-comment hover:text-codex-text hover:bg-codex-surface/20'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto p-4 relative min-h-0">
                        {errorMessage && (
                            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold mb-1">API Error</h3>
                                    <p className="text-sm">{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        {!response && !errorMessage && !isCompiling && (
                            <div className="h-full flex items-center justify-center text-codex-comment flex-col gap-3">
                                <Play className="w-10 h-10 opacity-20" />
                                <p className="text-sm">Click "Run Code" to compile your program.</p>
                            </div>
                        )}

                        {response && (
                            <div className="h-full">
                                {activeTab === 'ast' && <AstGraphViewer />}
                                {activeTab === 'symbols' && <SymbolTableView />}
                                {activeTab === 'stack' && <StackVisualizer />}
                                {activeTab === 'output' && (
                                    <div className="h-full bg-[#11111b] border border-codex-surface rounded-xl p-4 font-mono text-xs overflow-auto">
                                        <span className="text-codex-comment block mb-2">// Generated Code (.pig)</span>
                                        <pre className="text-codex-string whitespace-pre-wrap">
                                            {response.translatedCode || '// No code generated.'}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};