import { useState, useRef } from "react";
import {
  TbPlayerSkipBack,
  TbPlayerSkipForward,
  TbPlayerStop,
  TbPlayerPause,
  TbPlayerPlay,
} from "react-icons/tb";
import classes from "./GameRecordingControl.module.css";

type GameRecordingControlProps = {
    setTimer: React.Dispatch<React.SetStateAction<number>>
}

type T = ReturnType<typeof setTimeout>

const GameRecordingControl = ({setTimer}: GameRecordingControlProps) => {
  const [toggleInPlay, setToggleInPlay] = useState<boolean>(false);
  const moveCounterRef = useRef<number>(null);
  const timerRef = useRef<T>(null);

  let counter = moveCounterRef.current
  let timerId = timerRef.current


  const playbackSpeedHandler = (e: React.SyntheticEvent) => {}
  const runRecordHandler = (e: React.SyntheticEvent) => {
    setToggleInPlay(true);
    if(counter === null) counter = 0;
  }
  const pauseRecordHandler = (e: React.SyntheticEvent) => {
    setToggleInPlay(false);
  }
  const stopRecordHandler = (e: React.SyntheticEvent) => {}
  const moveBackRecordHandler = (e: React.SyntheticEvent) => {}
  const moveForwardRecordHandler = (e: React.SyntheticEvent) => {}

  return (
    <div className={classes.gameRecordContainer}>
      <div className={classes.gameRecordContainer_rangeContainer}>
        <label htmlFor="speed">Playback speed</label>
        <input
          type="range"
          id="speed"
          name="speed"
          min="500"
          max="5000"
          //   value="2500"
          step="500"
          onChange = {playbackSpeedHandler}
        ></input>
      </div>
      <div className={classes.gameRecordContainer_playerContainer}>
        <button type="button" onClick={moveBackRecordHandler}>
          <TbPlayerSkipBack />
        </button>
        <button type="button" onClick={stopRecordHandler}>
          <TbPlayerStop />
        </button>
        {!toggleInPlay && (
          <button type="button" onClick={runRecordHandler}>
            <TbPlayerPlay />
          </button>
        )}
        {toggleInPlay && (
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
