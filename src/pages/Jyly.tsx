import { useNavigate } from 'react-router';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function Jyly() {
  const navigate = useNavigate();
  // const [isRunning, setIsRunning] = useState(false);
  // const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  // const amountOfPutts = useState(0);
  const [distance, setDistance] = useState(10);
  const [round, setRound] = useState(1);
  const maxRounds = 20;
  const [history, setHistory] = useState<{score: number, distance: number}[]>([]);

  // useEffect(() => {
  //   let interval: number | undefined;
  //   if (isRunning) {
  //     interval = window.setInterval(() => {
  //       setTime((prevTime) => prevTime + 1);
  //     }, 1000);
  //   }
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [isRunning]);

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  // };

  function handleSuccess(amountOfPutts: number){

      setHistory(prev => [...prev, { score, distance }]);

    setScore(score + distance*amountOfPutts);
    setDistance(5+amountOfPutts)
    if (round < maxRounds) {
      setRound(round + 1);
    } else {
      handleFinish();
    }
  }

  const handleBack = () => {
    if(history.length === 0) return;

    const previousState = history[history.length-1];

    setScore(previousState.score);
    setDistance(previousState.distance);
    setRound(prev => prev-1)

    setHistory(prev => prev.slice(0, -1));
  };

  const handleFinish = () => {
    // setIsRunning(false);
    // Navigate to results or back
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  const handleReset = () => {
    // setIsRunning(false);
    // setTime(0);
    setScore(0);
    setDistance(10);
    setRound(1);
    setHistory([]);
  };

  const gameName = 'JYLY';

  return (
    <div className="size-full bg-white overflow-auto flex flex-col pb-20">
      {/* Header */}
      {/*<div className="bg-white border-b border-gray-100">*/}
      {/*  <div className="flex items-center gap-4 px-6 py-4">*/}
      {/*    <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-50 transition-opacity">*/}
      {/*      <ArrowLeft className="size-5" />*/}
      {/*    </button>*/}
      {/*    <h1 className="text-sm font-normal tracking-wide">TRÉNINK</h1>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="flex-1 flex flex-col px-6">
        {/* Game Info */}
        <div className="text-center py-4">
          <h2 className="text-xl font-light mb-2">{gameName}</h2>
          <p className="text-gray-500">Kolo {round} z {maxRounds}</p>
        </div>

        {/* Vzdalenost */}
        <div className="flex-1 flex flex-col items-center justify-center py-0 pb-10">
          <div className="flex gap-4 w-full mb-8">
            <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center mb-1">
                <span className="text-5xl font-light text-black">{distance}</span>
                <span className="text-xl font-light text-gray-400 ml-1">m</span>
              </div>
              <p className="text-xs text-gray-400">Vzdálenost</p>
            </div>

          {/* Skóre */}
          <div className="flex-1 border border-gray-200 bg-gray-50 rounded-lg py-6 text-center flex flex-col items-center justify-center">
              <p className="text-5xl font-light mb-1">{score}</p>
              <p className="text-xs text-gray-400">Skóre</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${(round / maxRounds) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="pb-8 space-y-3">
          {round <= maxRounds ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSuccess(0)}
                  className="text-2xl py-5 border text-red-500 border-red-100 bg-red-50/30 active:bg-red-50"
                >
                  0
                </button>
                <button
                  onClick={() => handleSuccess(1)}
                  className="text-2xl py-5 border text-orange-400 border-orange-100 bg-orange-50/30 active:bg-orange-50"
                >
                  1
                </button>
                  <button
                  onClick={() => handleSuccess(2)}
                  className="text-2xl py-5 border text-orange-400 border-orange-100 bg-orange-50/30 active:bg-orange-50"
                >
                  2
                </button>
                  <button
                  onClick={() => handleSuccess(3)}
                  className="text-2xl py-5 border text-lime-500 border-lime-100 bg-lime-50/30 active:bg-lime-50"
                >
                  3
                </button>
                  <button
                  onClick={() => handleSuccess(4)}
                  className="text-2xl py-5 border text-lime-500 border-lime-100 bg-lime-50/30 active:bg-lime-50"
                >
                  4
                </button>
                  <button
                  onClick={() => handleSuccess(5)}
                  className="text-2xl py-5 border text-emerald-500 border-emerald-100 bg-emerald-50/30 active:bg-emerald-50"
                >
                  5
                </button>
              </div>


              <button
              onClick={handleBack}
              disabled={history.length === 0}
              className={`w-full py-4 border border-gray-200 flex items-center justify-center gap-2 transition-colors ${
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
                <RotateCcw className="size-4" />
                Reset
              </button>
              </>
            ) : (
                  <div>lksdjf</div>
              )}

        </div>
      </div>
    </div>
  );
}
