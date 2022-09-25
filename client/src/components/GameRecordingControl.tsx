import { useState } from "react";
import {
  TbPlayerSkipBack,
  TbPlayerSkipForward,
  TbPlayerStop,
  TbPlayerPause,
  TbPlayerPlay,
} from "react-icons/tb";
import classes from "./GameRecordingControl.module.css";

const GameRecordingControl = () => {
  const [inPlay, setInPlay] = useState<boolean>(false);

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
        ></input>
      </div>
      <div className={classes.gameRecordContainer_playerContainer}>
        <button type="button">
          <TbPlayerSkipBack />
        </button>
        <button type="button">
          <TbPlayerStop />
        </button>
        {!inPlay && (
          <button type="button">
            <TbPlayerPlay />
          </button>
        )}
        {inPlay && (
          <button type="button">
            <TbPlayerPause />
          </button>
        )}
        <button type="button">
          <TbPlayerSkipForward />
        </button>
      </div>
    </div>
  );
};

export default GameRecordingControl;
