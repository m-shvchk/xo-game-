import { useState, useRef, useEffect } from "react";
import {
  TbPlayerSkipBack,
  TbPlayerSkipForward,
  TbPlayerStop,
  TbPlayerPause,
  TbPlayerPlay,
} from "react-icons/tb";
import classes from "./GameRecordingControl.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  prepareRecording,
  reproduceMoveForward,
  reproduceMoveBack,
} from "../features/gameSlice";
// import { MoveMade } from "../features/gameSlice";
// import { adjustBoard } from "../features/adjustBoard";

type GameRecordingControlProps = {
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
};

type T = ReturnType<typeof setInterval>;

const GameRecordingControl = ({
  timer,
  setTimer,
}: GameRecordingControlProps) => {
  const [inPlay, setInPlay] = useState<boolean>(false);

  useEffect(() => {
    return () => setInPlay(false);
  }, []);

  const [counter, setCounter] = useState<number>(0);
  const timerRef = useRef<T>();

  const dispatch = useDispatch();
  const movesInOrder = useSelector((state: RootState) => {
    return state.game.movesInOrder;
  });
  const moves = useSelector((state: RootState) => {
    return state.game.moves;
  });
  const movesDispatchedNum = Object.keys(moves).length; // number of moves already rendered on board
  const movesTotalNum = movesInOrder.length; // number of moves made in the game

  useEffect(() => {
    if (counter < 0) {
      setCounter(0);
    } else if (counter > movesTotalNum) {
      clearInterval(timerRef.current);
      setCounter(movesTotalNum);
    } else if (counter !==0 && movesDispatchedNum < counter) {
      dispatch(reproduceMoveForward(movesInOrder[counter-1]));
    } else if (movesDispatchedNum > counter) {
      dispatch(reproduceMoveBack(movesInOrder[counter]));
    }
  }, [counter, movesTotalNum, movesDispatchedNum, dispatch, movesInOrder]);

  const playbackSpeedHandler = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    console.log(target.value)
    clearInterval(timerRef.current);
    setInPlay(false);
    setTimer(parseInt(target.value, 10))
  };

  const runRecordHandler = (e: React.SyntheticEvent) => {
    setInPlay(true);
    timerRef.current = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, timer);
  };
  const pauseRecordHandler = (e: React.SyntheticEvent) => {
    setInPlay(false);
    clearInterval(timerRef.current);
  };
  const stopRecordHandler = (e: React.SyntheticEvent) => {
    setInPlay(false);
    clearInterval(timerRef.current);
    setCounter(0);
    dispatch(prepareRecording());
  };
  const moveBackRecordHandler = (e: React.SyntheticEvent) => {
    clearInterval(timerRef.current);
    setCounter((prev) => prev - 1);
  };
  const moveForwardRecordHandler = (e: React.SyntheticEvent) => {
    clearInterval(timerRef.current);
    setCounter((prev) => prev + 1);
  };

  return (
    <div className={classes.gameRecordContainer}>
      <div className={classes.gameRecordContainer_rangeContainer}>
        <label htmlFor="speed">Playback speed</label>
        <input
          type="range"
          id="speed"
          name="speed"
          min="500"
          max="3500"
          value={timer}
          step="500"
          onChange={playbackSpeedHandler}
        ></input>
      </div>
      <div className={classes.gameRecordContainer_playerContainer}>
        <button type="button" onClick={moveBackRecordHandler}>
          <TbPlayerSkipBack />
        </button>
        <button type="button" onClick={stopRecordHandler}>
          <TbPlayerStop />
        </button>
        {!inPlay && (
          <button type="button" onClick={runRecordHandler}>
            <TbPlayerPlay />
          </button>
        )}
        {inPlay && (
          <button type="button" onClick={pauseRecordHandler}>
            <TbPlayerPause />
          </button>
        )}
        <button type="button" onClick={moveForwardRecordHandler}>
          <TbPlayerSkipForward />
        </button>
      </div>
    </div>
  );
};

export default GameRecordingControl;
