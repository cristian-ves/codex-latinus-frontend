import React, { useMemo, useRef, useEffect } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';
import { computeStackAtStep } from '../../utils/stackUtils';
import { StackControls } from './StackControls';

export const StackVisualizer: React.FC = () => {
    const { events, currentStep } = useAppSelector(
        (state) => state.stackSimulator
    );

    const activeStepRef = useRef<HTMLDivElement | null>(null);

    const currentStack = useMemo(
        () => computeStackAtStep(events, currentStep),
        [events, currentStep]
    );

    const activeEvent = events[currentStep];

    useEffect(() => {
        if (activeStepRef.current) {
            activeStepRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [currentStep]);

    if (events.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-codex-comment p-6 text-center">
                <Layers className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-xs font-mono">
                    No parser events recorded for the current compilation.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col gap-3">
            <StackControls />

            <div className="flex-1 border border-codex-surface rounded-xl bg-[#11111b] p-4 flex flex-col min-h-0 overflow-hidden gap-4">
                {/* Active Operation Header */}
                <div className="flex items-center justify-between pb-3 border-b border-codex-surface/60 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-codex-comment tracking-wider">
                            Active Operation
                        </span>
                        {activeEvent && (
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${activeEvent.eventType === 'SHIFT'
                                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    }`}
                            >
                                {activeEvent.eventType}
                            </span>
                        )}
                    </div>
                    {activeEvent && (
                        <div className="text-xs font-mono text-codex-text flex items-center gap-2">
                            <span>Symbol: <strong className="text-codex-keyword">{activeEvent.symbol}</strong></span>
                            {activeEvent.poppedCount !== null && (
                                <span className="text-codex-comment">• Pop: {activeEvent.poppedCount}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                    {/* Left: Vertical Stack Structure (LIFO) */}
                    <div className="w-1/2 flex flex-col h-full border border-codex-surface bg-[#181825] rounded-lg p-3 min-h-0">
                        <div className="flex items-center justify-between text-xs text-codex-comment font-mono mb-2 shrink-0">
                            <span>Stack Contents</span>
                            <span className="text-[10px] text-codex-keyword font-bold">Top ↑</span>
                        </div>
                        <div className="flex-1 flex flex-col-reverse gap-1.5 overflow-y-auto pr-1">
                            {currentStack.map((item, index) => {
                                const isTop = index === currentStack.length - 1;
                                return (
                                    <div
                                        key={index}
                                        className={`px-3 py-2 rounded font-mono text-xs font-bold border flex items-center justify-between transition-all shrink-0 ${isTop
                                                ? 'bg-codex-keyword/20 text-codex-keyword border-codex-keyword/60 shadow-sm'
                                                : 'bg-codex-surface/60 text-codex-text border-codex-surface'
                                            }`}
                                    >
                                        <span className="truncate">{item}</span>
                                        <span className="text-[10px] font-normal text-codex-comment">
                                            [{index}]
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Step Context Info */}
                    <div className="w-1/2 flex flex-col gap-3 min-h-0">
                        <div className="flex-1 border border-codex-surface bg-[#181825] rounded-lg p-3 flex flex-col">
                            <span className="text-[11px] font-semibold uppercase text-codex-comment tracking-wider mb-3 block">
                                Step Context
                            </span>
                            {activeEvent ? (
                                <div className="space-y-2 text-xs font-mono">
                                    <div className="p-2.5 bg-[#11111b] rounded border border-codex-surface">
                                        <span className="text-codex-comment block text-[10px] mb-0.5">EVENT</span>
                                        <span className={activeEvent.eventType === 'SHIFT' ? 'text-sky-400 font-bold' : 'text-purple-400 font-bold'}>
                                            {activeEvent.eventType}
                                        </span>
                                    </div>
                                    <div className="p-2.5 bg-[#11111b] rounded border border-codex-surface">
                                        <span className="text-codex-comment block text-[10px] mb-0.5">SYMBOL</span>
                                        <span className="text-codex-text font-bold">{activeEvent.symbol}</span>
                                    </div>
                                    {activeEvent.poppedCount !== null && (
                                        <div className="p-2.5 bg-[#11111b] rounded border border-codex-surface">
                                            <span className="text-codex-comment block text-[10px] mb-0.5">POPPED COUNT</span>
                                            <span className="text-amber-400 font-bold">{activeEvent.poppedCount} items</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-codex-comment italic">No step selected.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Execution Timeline */}
                <div className="pt-3 border-t border-codex-surface/60 shrink-0 overflow-x-auto">
                    <span className="text-[11px] font-semibold uppercase text-codex-comment tracking-wider block mb-2">
                        Execution Sequence
                    </span>
                    <div className="flex items-center gap-2 pb-1">
                        {events.map((evt, idx) => (
                            <div
                                key={evt.id}
                                ref={idx === currentStep ? activeStepRef : null}
                                className={`px-2 py-1 rounded text-[10px] font-mono shrink-0 flex items-center gap-1 transition-all ${idx === currentStep
                                        ? 'bg-codex-keyword text-[#11111b] font-bold scale-105'
                                        : idx < currentStep
                                            ? 'bg-codex-surface/60 text-codex-text'
                                            : 'bg-codex-surface/20 text-codex-comment'
                                    }`}
                            >
                                <span>{evt.eventType[0]}:{evt.symbol}</span>
                                {idx < events.length - 1 && <ArrowRight className="w-2.5 h-2.5 opacity-50" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};