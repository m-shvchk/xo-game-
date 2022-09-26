import GameRecordingControl from "./GameRecordingControl";
import classes from "./BoardControls.module.css";
import {PayloadKey} from "../features/gameSlice"

type BoardControlsProps = {
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  rowsStart: number;
  rowsEnd: number;
  colsStart: number;
  colsEnd: number;
  setRowsStart: React.Dispatch<React.SetStateAction<number>>;
  setRowsEnd: React.Dispatch<React.SetStateAction<number>>;
  setColsStart: React.Dispatch<React.SetStateAction<number>>;
  setColsEnd: React.Dispatch<React.SetStateAction<number>>;
  myTurn: boolean;
  winner: { [key: PayloadKey]: number };
  sign: null | 1 | 2;
  leaveGameHandler: (e: React.SyntheticEvent) => void 
  showPlayer: boolean;
  setShowPlayer: React.Dispatch<React.SetStateAction<boolean>>; 
};

const BoardControls = ({
  setTimer,
  rowsStart,
  rowsEnd,
  colsStart,
  colsEnd,
  setRowsStart,
  setRowsEnd,
  setColsStart,
  setColsEnd,
  myTurn,
  sign,
  winner,
  leaveGameHandler,
  showPlayer,
  setShowPlayer,
}: BoardControlsProps) => {

  // signal area text (indicates at what point the game is: "panding", "you won", "you lost"):
  let signalAreaText = "";
  let winArr: number[] = [];
  if(winner) winArr = Object.values(winner); // won't be empty if there is a winner;
  if (!sign) signalAreaText = "PENDING...";
  if (winArr.length > 0 && winArr[0] === sign) {
    signalAreaText = "CONGRATS, YOU WON!";
  }
  if (winArr.length > 0 && winArr[0] !== sign) {
    signalAreaText = "GAME OVER, TRY AGAIN";
  }
  // signal area color (indicates who's turn):
  let signalAreaStyle = {};
  if (sign && myTurn && !winArr.length) {
    signalAreaStyle = { backgroundColor: "#07da63" };
  }
  if (sign && !myTurn && !winArr.length) {
    signalAreaStyle = { backgroundColor: "#ff4122" };
  }

  let random = Math.floor(Math.random() * 20) + 1; // from 1 to 20 (there are 20 images)
  const image = require(`../images/img${random}.png`); // import random image from /images folder (require common js syntax)

  if (winArr.length) {
    signalAreaStyle = {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      opacity: "0.7",
    };
  }

  return (
    <div className={classes.boardControls}>
      {!showPlayer && (
        <div
          className={classes.boardControls_signalArea}
          style={signalAreaStyle}
        >
          <p>{signalAreaText}</p>
        </div>
      )}
      {showPlayer && (
        <GameRecordingControl
          setTimer={setTimer}
          rowsStart={rowsStart}
          rowsEnd={rowsEnd}
          colsStart={colsStart}
          colsEnd={colsEnd}
          setRowsStart={setRowsStart}
          setRowsEnd={setRowsEnd}
          setColsStart={setColsStart}
          setColsEnd={setColsEnd}
        />
      )}

      <div className={classes.boardControls_btnContainer}>
        {!showPlayer && !!winArr.length && (
          <button
            type="button"
            className={classes.boardControls_btnContainer_btn}
            onClick={() => setShowPlayer(true)}
          >
            PLAY RECORD
          </button>
        )}
        <button
          type="button"
          className={classes.boardControls_btnContainer_btn}
          onClick={leaveGameHandler}
        >
          LEAVE GAME
        </button>
      </div>
    </div>
  );
};

export default BoardControls;