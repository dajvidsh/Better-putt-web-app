import { useEffect, useState } from 'react';

export function useGamePersistence<T>(gameKey: string, initialValue: T) {
    const [gameState, setGameState] = useState<T>(() => {
        const saved = localStorage.getItem(`active_game_${gameKey}`);
        return saved ? JSON.parse(saved) : initialValue;
    });

    useEffect(() => {
        if (gameState) {
            localStorage.setItem(`active_game_${gameKey}`, JSON.stringify(gameState));
        }
    }, [gameState, gameKey]);

    const clearGame = () => {
        localStorage.removeItem(`active_game_${gameKey}`);
        setGameState(initialValue);
    };

    return [gameState, setGameState, clearGame] as const;
}