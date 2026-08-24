import React from 'react';
import { Layers, Box } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const SymbolTableView: React.FC = () => {
    const symbolTable = useAppSelector(
        (state) => state.compiler.response?.symbolTable
    );

    if (!symbolTable || symbolTable.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-codex-comment p-6 text-center">
                <Layers className="w-10 h-10 opacity-30 mb-2" />
                <p>No symbol table available for the current compilation.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-auto space-y-4 pr-1">
            {symbolTable.map((scope) => (
                <div
                    key={scope.id}
                    className="bg-[#181825] border border-codex-surface rounded-lg overflow-hidden"
                >
                    <div className="px-4 py-2.5 bg-[#11111b] border-b border-codex-surface flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-codex-keyword" />
                            <span className="font-semibold text-sm text-codex-text">
                                Scope #{scope.id}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] rounded font-bold bg-codex-keyword/10 text-codex-keyword border border-codex-keyword/20 uppercase">
                                {scope.scopeType}
                            </span>
                        </div>
                        {scope.parentId !== null && (
                            <span className="text-xs text-codex-comment font-mono">
                                Parent: #{scope.parentId}
                            </span>
                        )}
                    </div>

                    <div className="p-4 overflow-x-auto">
                        {scope.symbols.length === 0 ? (
                            <p className="text-xs text-codex-comment italic">
                                No symbols defined in this scope.
                            </p>
                        ) : (
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-codex-surface text-codex-comment uppercase tracking-wider">
                                        <th className="pb-2 font-medium">Identifier</th>
                                        <th className="pb-2 font-medium">Type</th>
                                        <th className="pb-2 font-medium">Category</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-codex-surface/30 font-mono">
                                    {scope.symbols.map((sym, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-codex-surface/20 transition-colors"
                                        >
                                            <td className="py-2.5 pr-4 text-codex-text font-semibold">
                                                {sym.name}
                                            </td>
                                            <td className="py-2.5 pr-4 text-sky-400">
                                                {sym.type}
                                            </td>
                                            <td className="py-2.5 text-amber-300">
                                                {sym.category}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};