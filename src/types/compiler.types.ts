export interface AstNode {
    id: number;
    label: string;
    type: string;
    details: string;
    children: AstNode[];
}

export interface SymbolInfo {
    name: string;
    type: string;
    category: string;
}

export interface ScopeInfo {
    id: number;
    parentId: number | null;
    scopeType: "GLOBAL" | "FUNCTION" | "LOOP";
    symbols: SymbolInfo[];
}

export interface ParserStackEvent {
    id: number;
    eventType: "SHIFT" | "REDUCE";
    symbol: string;
    poppedCount: number | null;
}

export interface CompilerError {
    type: "SYNTAX" | "SEMANTIC";
    message: string;
    line: number;
    column: number;
}

export interface CompileResponse {
    success: boolean;
    translatedCode: string | null;
    errors: CompilerError[];
    astTree: AstNode | null;
    symbolTable: ScopeInfo[] | null;
    parserStack: ParserStackEvent[] | null;
}

export interface CompileRequest {
    code: string;
}
