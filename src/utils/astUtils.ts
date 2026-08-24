import type { RawNodeDatum } from "react-d3-tree";
import type { AstNode } from "../types/compiler.types";

export const convertToD3Tree = (node: AstNode): RawNodeDatum => {
    return {
        name: node.label,
        attributes: {
            type: node.type,
            details: node.details,
            id: String(node.id),
        },
        children: node.children ? node.children.map(convertToD3Tree) : [],
    };
};
