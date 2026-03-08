import { useNavigate } from 'react-router';
import {AlertTriangle, RotateCcw, Zap} from 'lucide-react';
import { useState } from 'react';

export default function Survival() {
  const navigate = useNavigate();
  // const [isRunning, setIsRunning] = useState(false);
  // const [time, setTime] = useState(0);
  const [lives, setLives] = useState(1);
  const [beenHere, setBeenHere] = useState(false);
  // const amountOfPutts = useState(0);
  const [distance, setDistance] = useState(3);
  const [round, setRound] = useState(1);
  // const maxRounds = 20;
  const [history, setHistory] = useState<{lives: number, distance: number, beenHere: boolean}[]>([]);

  function handleSuccess(amountOfPutts: number){

    setHistory(prev => [...prev, { lives, distance, beenHere }]);

    if(amountOfPutts === 1) {
      if(lives-1 === 0) handleFinish()
      setLives(prev => prev-1)
      setBeenHere(true)

    } else if(amountOfPutts === 3) {
      if(!beenHere) setLives(lives + 1)

      setDistance(prev => prev+1)
      setBeenHere(false)

    } else {
      setBeenHere(true)
    }

    setRound(prev => prev+1)

  }

  const handleBack = () => {
    if(history.length === 0) return;

    const previousState = history[history.length-1];

    setLives(previousState.lives);
    setDistance(previousState.distance);
    setRound(prev => prev-1)
    setBeenHere(previousState.beenHere)

    setHistory(prev => prev.slice(0, -1));
  };

  const handleFinish = () => {
    // setIsRunning(false);
    // Navigate to results or back
    setTimeout(() => {
      navigate('/training/survival');
    }, 1000);
  };

  const handleReset = () => {
    // setIsRunning(false);
    // setTime(0);
    setLives(1);
    setDistance(3);
    setRound(1);
    setHistory([]);
  };

  const gameName = 'Survival';

  return (
    <div className="size-full bg-white overflow-auto flex flex-col pb-20">

      <div className="flex-1 flex flex-col px-6">
        {/* Game Info */}
        <div className="text-center py-4">
          <h2 className="text-xl font-light mb-2">{gameName}</h2>
          <p className="text-gray-500">Kolo {round}</p>
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
              <p className="text-5xl font-light mb-1">{lives}</p>
              <p className="text-xs text-gray-400">Životů</p>
            </div>
          </div>

          {/* Progress Bar */}
          {/*<div className="w-full max-w-xs">*/}
          {/*  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">*/}
          {/*    <div*/}
          {/*      className="h-full bg-black transition-all duration-300"*/}
          {/*      style={{ width: `${(round) * 100}%` }}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {/* Controls */}
        <div className="pb-8 space-y-3">
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleFinish()}
                  className="text-2xl py-5 border text-red-500 border-red-100 bg-red-50/30 active:bg-red-50"
                >
                  0
                </button>
                <button
                  onClick={() => handleSuccess(1)}
                  className="flex items-center justify-center text-2xl py-5 border text-orange-400 border-orange-100 bg-orange-50/30 active:bg-orange-50"
                >
                  { lives === 1 && round !== 1 ? <AlertTriangle className="size-8" strokeWidth={1.5} /> : "1" }
                </button>
                  <button
                  onClick={() => handleSuccess(2)}
                  className="text-2xl py-5 border text-gray-400 border-gray-100 bg-gray-50/30 active:bg-gray-50"
                >
                  2
                </button>
                  <button
                  onClick={() => handleSuccess(3)}
                  className="flex items-center justify-center text-2xl py-5 border text-lime-500 border-lime-100 bg-lime-50/30 active:bg-lime-50"
                >
                  { !beenHere && round !== 1 ? <Zap className="size-8" strokeWidth={1.5} /> : "3" }
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

        </div>
      </div>
    </div>
  );
}
