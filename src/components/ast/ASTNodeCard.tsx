import type { CustomNodeElementProps } from 'react-d3-tree';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const AstNodeCard: React.FC<CustomNodeElementProps> = ({
    nodeDatum,
    toggleNode,
}) => {
    const hasChildren = Boolean(
        nodeDatum.children && nodeDatum.children.length > 0
    );

    const isCollapsed = Boolean(
        (nodeDatum as { __rd3t?: { collapsed?: boolean } }).__rd3t?.collapsed
    );

    const nodeType = String(nodeDatum.attributes?.type ?? '');
    const details = String(nodeDatum.attributes?.details ?? '');

    return (
        <g>
            <foreignObject
                width={200}
                height={68}
                x={-100}
                y={-34}
                className="overflow-visible"
            >
                <div
                    onClick={toggleNode}
                    className={`w-full h-full bg-[#181825] border rounded-lg px-2 py-1.5 flex flex-col items-center justify-center cursor-pointer shadow-md transition-all select-none relative ${isCollapsed
                        ? 'border-amber-400/80 bg-[#232334]'
                        : 'border-[#45475a] hover:border-codex-keyword'
                        }`}
                >
                    <span className="text-xs font-mono font-semibold text-codex-text truncate w-full text-center">
                        {nodeDatum.name}
                    </span>
                    <span className="text-[10px] text-codex-type truncate w-full text-center">
                        {nodeType} {details ? `• ${details}` : ''}
                    </span>

                    {hasChildren && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-codex-comment bg-codex-surface/60 px-1.5 py-0.5 rounded-full">
                            {isCollapsed ? (
                                <>
                                    <ChevronRight className="w-3 h-3 text-amber-400" />
                                    <span className="text-amber-400 font-bold">
                                        Collapsed
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3 h-3 text-codex-keyword" />
                                    <span>Expanded</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </foreignObject>
        </g>
    );
};