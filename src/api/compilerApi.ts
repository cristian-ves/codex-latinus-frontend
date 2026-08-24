import type { CompileRequest, CompileResponse } from "../types/compiler.types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const compileCode = async (
    request: CompileRequest
): Promise<CompileResponse> => {
    const response = await fetch(`${API_BASE_URL}/compile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(
            `Server error: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};
