import React, { useEffect } from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    RotateCcw,
    Gauge,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
    stepForward,
    stepBackward,
    togglePlay,
    resetSimulator,
    setSpeed,
} from '../../store/slices/stackSimulatorSlice';

export const StackControls: React.FC = () => {
    const dispatch = useAppDispatch();
    const { events, currentStep, isPlaying, playbackSpeed } = useAppSelector(
        (state) => state.stackSimulator
    );

    const isAtStart = currentStep === 0;
    const isAtEnd = events.length === 0 || currentStep === events.length - 1;

    useEffect(() => {
        if (!isPlaying || isAtEnd) return;

        const interval = setInterval(() => {
            dispatch(stepForward());
        }, playbackSpeed);

        return () => clearInterval(interval);
    }, [isPlaying, isAtEnd, playbackSpeed, dispatch]);

    if (events.length === 0) return null;

    return (
        <div className="flex items-center justify-between p-3 bg-[#181825] border border-codex-surface rounded-xl select-none">
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => dispatch(resetSimulator())}
                    disabled={isAtStart}
                    className="p-1.5 rounded-lg text-codex-comment hover:text-codex-text hover:bg-codex-surface/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Reset simulation"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>

                <button
                    onClick={() => dispatch(stepBackward())}
                    disabled={isAtStart}
                    className="p-1.5 rounded-lg text-codex-comment hover:text-codex-text hover:bg-codex-surface/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Step backward"
                >
                    <SkipBack className="w-4 h-4" />
                </button>

                <button
                    onClick={() => dispatch(togglePlay())}
                    disabled={isAtEnd}
                    className="p-2 rounded-lg bg-codex-keyword text-[#11111b] hover:opacity-90 disabled:opacity-30 transition-all font-bold cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                    ) : (
                        <Play className="w-4 h-4 fill-current" />
                    )}
                </button>

                <button
                    onClick={() => dispatch(stepForward())}
                    disabled={isAtEnd}
                    className="p-1.5 rounded-lg text-codex-comment hover:text-codex-text hover:bg-codex-surface/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Step forward"
                >
                    <SkipForward className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-codex-comment">
                    Step <span className="text-codex-text font-bold">{currentStep + 1}</span> / {events.length}
                </div>

                <div className="flex items-center gap-1 bg-codex-surface/40 px-2 py-1 rounded-lg border border-codex-surface">
                    <Gauge className="w-3.5 h-3.5 text-codex-comment" />
                    <select
                        value={playbackSpeed}
                        onChange={(e) => dispatch(setSpeed(Number(e.target.value)))}
                        className="bg-transparent text-xs font-mono text-codex-text focus:outline-none cursor-pointer"
                    >
                        <option value={1000} className="bg-[#181825]">1.0s</option>
                        <option value={500} className="bg-[#181825]">0.5s</option>
                        <option value={250} className="bg-[#181825]">0.25s</option>
                    </select>
                </div>
            </div>
        </div>
    );
};