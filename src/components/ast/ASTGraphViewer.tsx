import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';
import { GitFork } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import { convertToD3Tree } from '../../utils/astUtils';
import { AstNodeCard } from './ASTNodeCard';

export const AstGraphViewer: React.FC = () => {
    const astTree = useAppSelector(
        (state) => state.compiler.response?.astTree
    );

    const treeData = useMemo(() => {
        if (!astTree) return null;
        return convertToD3Tree(astTree);
    }, [astTree]);

    if (!treeData) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-codex-comment p-6 text-center">
                <GitFork className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-xs font-mono">
                    No AST available for the current compilation.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#11111b] rounded-xl overflow-hidden relative [&_path]:!stroke-[#6c7086] [&_path]:!stroke-[1.5px]">
            <Tree
                data={treeData}
                orientation="vertical"
                pathFunc="step"
                translate={{ x: 300, y: 60 }}
                nodeSize={{ x: 220, y: 110 }}
                renderCustomNodeElement={(rd3tProps) => (
                    <AstNodeCard {...rd3tProps} />
                )}
                separation={{ siblings: 1.2, nonSiblings: 1.5 }}
            />
        </div>
    );
};