import type { ParserStackEvent } from "../types/compiler.types";

export const computeStackAtStep = (
    events: ParserStackEvent[],
    targetStep: number
): string[] => {
    const stack: string[] = ["$"];
    if (events.length === 0) return stack;

    const limit = Math.min(targetStep, events.length - 1);

    for (let i = 0; i <= limit; i++) {
        const event = events[i];
        if (!event) continue;

        if (event.eventType === "SHIFT") {
            stack.push(event.symbol);
        } else if (event.eventType === "REDUCE") {
            const count = event.poppedCount ?? 0;
            for (let p = 0; p < count; p++) {
                if (stack.length > 1) {
                    stack.pop();
                }
            }
            stack.push(event.symbol);
        }
    }

    return stack;
};
