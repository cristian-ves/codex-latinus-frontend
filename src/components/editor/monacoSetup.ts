import { type Monaco } from "@monaco-editor/react";

export const setupMonacoCodex = (monaco: Monaco) => {
    monaco.languages.register({ id: "codex" });

    monaco.languages.setMonarchTokensProvider("codex", {
        keywords: [
            "esto",
            "series",
            "finis",
            "FINIS",
            "si",
            "aliter",
            "dum",
            "facere",
            "per",
            "perge",
            "interrumpe",
            "actio",
            "ratio",
            "reddere",
            "structura",
            "verum",
            "falsus",
        ],
        typeKeywords: ["textum", "decimalis", "numerus", "littera", "bool"],
        operators: [
            "<<",
            ">>",
            "++",
            "--",
            "+",
            "-",
            "*",
            "/",
            "%",
            "=",
            "==",
            "!=",
            ">",
            "<",
            ">=",
            "<=",
            "&&",
            "||",
            "non",
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes:
            /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        tokenizer: {
            root: [
                [/[A-Z]+>|VARIABILES\[/, "custom-section"],
                [
                    /[a-zA-Z_]\w*/,
                    {
                        cases: {
                            "@keywords": "keyword",
                            "@typeKeywords": "type",
                            "@default": "identifier",
                        },
                    },
                ],
                { include: "@whitespace" },
                [/[{}()\[\]]/, "@brackets"],
                [
                    /@symbols/,
                    {
                        cases: {
                            "@operators": "operator",
                            "@default": "",
                        },
                    },
                ],
                [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
                [/\d+/, "number"],
                [/"([^"\\]|\\.)*$/, "string.invalid"],
                [
                    /"/,
                    {
                        token: "string.quote",
                        bracket: "@open",
                        next: "@string",
                    },
                ],
                [/'[^\\']'/, "string"],
                [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
                [/'/, "string.invalid"],
            ],
            whitespace: [
                [/[ \t\r\n]+/, "white"],
                [/\/\/.*/, "comment"],
                [/##/, "comment", "@comment"],
            ],
            comment: [
                [/[^#]+/, "comment"],
                [/##/, "comment", "@pop"],
                [/#/, "comment"],
            ],
            string: [
                [/[^\\"]+/, "string"],
                [/@escapes/, "string.escape"],
                [/\\./, "string.escape.invalid"],
                [
                    /"/,
                    { token: "string.quote", bracket: "@close", next: "@pop" },
                ],
            ],
        },
    });

    monaco.editor.defineTheme("codex-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
            {
                token: "custom-section",
                foreground: "F38BA8",
                fontStyle: "bold",
            },
            { token: "keyword", foreground: "CBA6F7", fontStyle: "bold" },
            { token: "type", foreground: "89B4FA", fontStyle: "italic" },
            { token: "string", foreground: "A6E3A1" },
            { token: "number", foreground: "FAB387" },
            { token: "number.float", foreground: "FAB387" },
            { token: "operator", foreground: "94E2D5" },
            { token: "comment", foreground: "6C7086", fontStyle: "italic" },
            { token: "identifier", foreground: "CDD6F4" },
        ],
        colors: {
            "editor.background": "#1E1E2E",
            "editor.foreground": "#CDD6F4",
            "editorLineNumber.foreground": "#6C7086",
            "editor.lineHighlightBackground": "#28283E",
            "editor.selectionBackground": "#45475A",
        },
    });
};
