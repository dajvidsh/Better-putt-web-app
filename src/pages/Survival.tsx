import {useNavigate} from 'react-router';
import {AlertTriangle, Check, RotateCcw, Zap} from 'lucide-react';
import {useState} from 'react';

export default function Survival() {
    const navigate = useNavigate();
    const [lives, setLives] = useState(1);
    const [beenHere, setBeenHere] = useState(false);
    const [phase, setPhase] = useState(false);
    const [sumOfPutts, setSumOfPutts] = useState(0);
    const [distance, setDistance] = useState(3);
    const [round, setRound] = useState(1);

    const [history, setHistory] = useState<{
        lives: number,
        distance: number,
        beenHere: boolean,
        sumOfPutts: number,
        makes: number
    }[]>([]);

    function handleSuccess(amountOfPutts: number) {
        const updatedHistory = [...history, {lives, distance, beenHere, sumOfPutts, makes: amountOfPutts}];
        setHistory(updatedHistory);

        const newSum = sumOfPutts + amountOfPutts;
        setSumOfPutts(newSum);

        let newLives = lives;
        let newDistance = distance;
        let newBeenHere = beenHere;
        let isGameOver = false;

        if (amountOfPutts === 0) {
            isGameOver = true;
        } else if (amountOfPutts === 1) {
            newLives -= 1;
            newBeenHere = true;
            if (newLives === 0) isGameOver = true;

        } else if (amountOfPutts === 3) {
            if (!beenHere) newLives += 1;
            newDistance += 1;
            newBeenHere = false;
        } else {
            newBeenHere = true;
        }

        setLives(newLives);
        setDistance(newDistance);
        setBeenHere(newBeenHere);
        setRound(prev => prev + 1);

        if (isGameOver) {
            handleFinish(updatedHistory, distance, newSum);
        }
    }

    const handleBack = () => {
        if (history.length === 0) return;
        const previousState = history[history.length - 1];

        setLives(previousState.lives);
        setDistance(previousState.distance);
        setRound(prev => prev - 1);
        setBeenHere(previousState.beenHere);
        setSumOfPutts(previousState.sumOfPutts);

        setHistory(prev => prev.slice(0, -1));
    };

    const handleFinish = (finalHistory: typeof history, finalDistance: number, finalSum: number) => {
        setPhase(true);
        saveGameToDb(finalHistory, finalDistance, finalSum);
    };

    const handleReset = () => {
        setLives(1);
        setDistance(3);
        setRound(1);
        setHistory([]);
        setSumOfPutts(0)
    };

    const saveGameToDb = async (finalHistory: typeof history, finalDistance: number, finalSum: number) => {
        const totalAttempts = finalHistory.length * 3;

        const trainingData = {
            game_mode_id: "survival",
            total_score: finalDistance, // Skóre v Survivalu = nejvyšší dosažená vzdálenost
            total_makes: finalSum,
            total_attempts: totalAttempts,
            rounds: finalHistory.map((h, index) => ({
                round_number: index + 1,
                distance: h.distance,
                attempts: 3,
                makes: h.makes,
                score_earned: h.makes
            }))
        };

        try {
            // const response = await fetch("http://localhost:8000/api/trainings/save", {
            const response = await fetch("https://better-putt-web-app-server.onrender.com/api/trainings/save", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(trainingData)
            });

            if (response.ok) {
                console.log("Paráda! Survival uložen.");
            } else {
                console.error("Chyba při ukládání.");
            }
        } catch (error) {
            console.error("Nelze se spojit se serverem:", error);
        }
    };

    const gameName = 'Survival';

    return (
        <div className="size-full bg-white overflow-auto flex flex-col pt-10 pb-20">

            {!phase && (

                <div className="flex-1 flex flex-col px-6">
                    {/* Game Info */}
                    <div className="text-center py-4">
                        <h2 className="text-xl font-light mb-2">{gameName}</h2>
                        <p className="text-gray-500">Kolo {round}</p>
                    </div>

                    {/* Vzdalenost */}
                    <div className="flex-1 flex flex-col items-center justify-center py-0 pb-10">
                        <div className="flex gap-4 w-full mb-8">
                            <div
                                className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
                                <div className="flex items-baseline justify-center mb-1">
                                    <span className="text-5xl font-light text-black">{distance}</span>
                                    <span className="text-xl font-light text-gray-400 ml-1">m</span>
                                </div>
                                <p className="text-xs text-gray-400">Vzdálenost</p>
                            </div>

                            {/* Skóre */}
                            <div
                                className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
                                <p className="text-5xl font-light mb-1">{lives}</p>
                                <p className="text-xs text-gray-400">
                                    {lives === 1 ? "Život" : lives <= 4 ? "Životy" : "Životů"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="pb-8 space-y-3">
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleSuccess(0)}
                                    className="text-2xl py-5 border text-red-500 border-red-500 bg-red-50/30 active:bg-red-50"
                                >
                                    0
                                </button>
                                <button
                                    onClick={() => handleSuccess(1)}
                                    className="flex items-center justify-center text-2xl py-5 border text-orange-400 border-orange-500 bg-orange-50/30 active:bg-orange-50"
                                >
                                    {lives === 1 && round !== 1 ?
                                        <AlertTriangle className="size-8" strokeWidth={1.5}/> : "1"}
                                </button>
                                <button
                                    onClick={() => handleSuccess(2)}
                                    className="text-2xl py-5 border text-gray-400 border-gray-500 bg-gray-50/30 active:bg-gray-50"
                                >
                                    2
                                </button>
                                <button
                                    onClick={() => handleSuccess(3)}
                                    className="flex items-center justify-center text-2xl py-5 border text-lime-500 border-lime-500 bg-lime-50/30 active:bg-lime-50"
                                >
                                    {!beenHere && round !== 1 ? <Zap className="size-8" strokeWidth={1.5}/> : "3"}
                                </button>
                            </div>

                            <button
                                onClick={handleBack}
                                disabled={history.length === 0}
                                className={`w-full py-4 border border-gray-400 flex items-center justify-center gap-2 transition-colors ${
                                    history.length === 0
                                        ? 'opacity-40 cursor-not-allowed bg-gray-50'
                                        : 'active:bg-gray-50'
                                }`}
                            >
                                Zpět
                            </button>

                            <button
                                onClick={handleReset}
                                className="w-full py-4 text-gray-500 flex items-center justify-center gap-2 active:opacity-50 transition-opacity"
                            >
                                <RotateCcw className="size-4"/>
                                Reset
                            </button>
                        </>
                    </div>
                </div>
            )}
            {/* --- HOTOVO --- */}
            {phase && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-10">
                    <div
                        className="size-15 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <Check className="size-10"/>
                    </div>
                    <h2 className="text-3xl font-light mb-2">Survival Dokončen</h2>
                    <p className="text-gray-500 mb-1">Odházeno {history.length * 3} puttů.</p>
                    <p className="text-gray-500 mb-12">Úspěšnost {Math.round((sumOfPutts / (history.length * 3)) * 100)}%.</p>

                    <div
                        className="border border-gray-200 bg-gray-50 rounded-lg py-8 px-12 text-center w-full max-w-sm mb-12">
                        <p className="text-5xl font-light mb-2">{distance}<span
                            className="text-3xl text-gray-400">m</span></p>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">Konečná vzdálenost</p>
                    </div>

                    <button
                        onClick={() => navigate('/training')}
                        className="flex justify-center gap-2 mt-8 w-full bg-black text-white py-4 active:opacity-70 transition-opacity"
                    >
                        Zpět na tréninky
                    </button>
                </div>
            )}
        </div>
    );
}
