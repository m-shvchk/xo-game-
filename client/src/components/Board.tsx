import { useState, useEffect } from "react";
import classes from "./Board.module.css";
import { Socket } from "socket.io-client";
import BoardCell from "./BoardCell";
import GameRecordingControl from "./GameRecordingControl"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  makeMove,
  receiveMove,
  activateFirstPlayer,
  leaveGame,
} from "../features/gameSlice";
import { MoveMade } from "../features/gameSlice";
import { adjustBoard } from "../features/adjustBoard";

type boardProps = {
  socket: Socket | null;
  roomNumber: string;
  setShowBoard: React.Dispatch<React.SetStateAction<boolean>>;
};

const Board = ({ socket, roomNumber, setShowBoard }: boardProps) => {
  const [rowsStart, setRowsStart] = useState<number>(-12);
  const [rowsEnd, setRowsEnd] = useState<number>(12);
  const [colsStart, setColsStart] = useState<number>(-12);
  const [colsEnd, setColsEnd] = useState<number>(12);

  const dispatch = useDispatch();

  const myTurn = useSelector((state: RootState) => {
    return state.game.myTurn;
  });
  const sign = useSelector((state: RootState) => {
    return state.game.sign;
  });
  const moves = useSelector((state: RootState) => {
    return state.game.moves;
  });
  const winner = useSelector((state: RootState) => {
    return state.game.winner;
  });

  // ON MAKING MOVE (MOUSE EVENT):
  const makeMoveHandler = (e: React.MouseEvent) => {
    const id = (e.target as HTMLDivElement)?.id;
    console.log("coordinates sent: ", id);
    if (!id) return;
    if (!myTurn) return;
    if (id in moves) return;

    const moveObj = { [id]: sign };
    dispatch(makeMove(moveObj));
    if (socket) socket.emit("send_move", { moveObj, roomNumber }); // emit move event with moveObj and roomNumber as parameters (emiting to a room is only possible from server)

    // ADJUST BOARD SIZE:
    adjustBoard(
      moveObj,
      rowsStart,
      rowsEnd,
      colsStart,
      colsEnd,
      setRowsStart,
      setRowsEnd,
      setColsStart,
      setColsEnd
    );
  };

  // ON LISTEN TO "ACTIVATE_GAME" EVENT (FIRST MOVE):
  useEffect(() => {
    if (socket) {
      socket.on("activate_game", () => {
        dispatch(activateFirstPlayer());
      });
    }
  }, [socket, dispatch]);

  // ON LISTEN TO "RECEIVE_MOVE" EVENT:
  useEffect(() => {
    if (socket) {
      socket.on("receive_move", (data: MoveMade) => {
        console.log("coordinates received: ", data)
        dispatch(receiveMove(data));
        // ADJUST BOARD SIZE:
        adjustBoard(
          data,
          rowsStart,
          rowsEnd,
          colsStart,
          colsEnd,
          setRowsStart,
          setRowsEnd,
          setColsStart,
          setColsEnd
        );
      });
    }
    // remove listeners for "receive_move" if there is more than one:
    if(socket?.listeners("receive_move") && socket?.listeners("receive_move").length > 1){
      socket.listeners("receive_move").splice(0, socket?.listeners("receive_move").length - 1);
    }
  }, [socket, dispatch, rowsStart, rowsEnd, colsStart, colsEnd]);

  // ON LEAVE GAME:
  const leaveGameHandler = (e: React.SyntheticEvent) => {
    if (socket) socket.emit("leave_game", { roomNumber });
     socket?.disconnect();
     console.log("I'm leaving")
     dispatch(leaveGame());
     setShowBoard(false);
     setRowsStart(-12)
     setRowsEnd(12)
     setColsStart(-12)
     setColsEnd(12)
  }

  // ON OPPONENT LEAVING GAME:
  useEffect(() => {
    if (socket) {
      socket.on("opponent_left", () => {
        console.log("opponent left room")
        socket?.disconnect();
      });
    }
  }, [socket]);

  let rowsLength = Math.abs(rowsStart) + rowsEnd + 1;
  let columnsLength = Math.abs(colsStart) + colsEnd + 1;

  const board = new Array(rowsLength);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(columnsLength).fill(0);
  }

  const content = board.map((row, rowIdx) => (
    <div
      className={classes.flexContainer}
      style={{ width: `${(Math.abs(colsStart) + colsEnd + 1) * 3}vh` }}
      key={rowIdx + rowsStart}
    >
      {row.map((val: number, colIdx: number) => (
        <BoardCell
          key={`${rowIdx + rowsStart},${colIdx + colsStart}`}
          id={`${rowIdx + rowsStart},${colIdx + colsStart}`}
          value={
            `${rowIdx + rowsStart},${colIdx + colsStart}` in moves
              ? moves[`${rowIdx + rowsStart},${colIdx + colsStart}`]
              : val
          }
          winner={
            `${rowIdx + rowsStart},${colIdx + colsStart}` in winner
              ? true
              : false
          }
        />
      ))}
    </div>
  ));

  let signalAreaText = !sign ? "PENDING..." : "";
  let signalAreaStyle = {};
  if (sign && myTurn) signalAreaStyle = { backgroundColor: "#07da63" };
  if (sign && !myTurn) signalAreaStyle = { backgroundColor: "#ff4122" };

  return (
    <>
      <div className={classes.appContainer}>
        <div className={classes.boardContainer} onClick={makeMoveHandler}>
          {content}
        </div>
        <div className={classes.boardControls}>
          <div
            className={classes.boardControls_signalArea}
            style={signalAreaStyle}
          >
            <p>{signalAreaText}</p>
          </div>
          <div className={classes.boardControls_btnContainer}>
            <GameRecordingControl />
            <button
              type="button"
              className={classes.boardControls_btnContainer_btn}
              onClick={leaveGameHandler}
            >
              LEAVE GAME
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
