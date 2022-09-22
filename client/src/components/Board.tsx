import { useState, useEffect } from "react";
import classes from "./Board.module.css";
import { Socket } from "socket.io-client";
import BoardCell from "./BoardCell";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  makeMove,
  receiveMove,
  activateFirstPlayer,
} from "../features/gameSlice";
import { MoveMade } from "../features/gameSlice";
import { adjustBoard } from "../features/adjustBoard";

type boardProps = {
  socket: Socket | null;
  roomNumber: string;
};

const Board = ({ socket, roomNumber }: boardProps) => {
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

  const makeMoveHandler = (e: React.MouseEvent) => {
    const id = (e.target as HTMLDivElement)?.id;
    console.log(id);
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

  // listen to "activate_game" event (first move):
  useEffect(() => {
    if (socket) {
      socket.on("activate_game", () => {
        dispatch(activateFirstPlayer());
      });
    }
  }, [socket, dispatch]);

  // listen to "receive_move" event:
  useEffect(() => {
    if (socket) {
      socket.on("receive_move", (data: MoveMade) => {
        console.log("data: ", data);
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
  }, [socket, dispatch, rowsStart, rowsEnd, colsStart, colsEnd]);

  // console.log("rowStart: ", rowsStart)
  // console.log("rowEnd: ", rowsEnd)
  // console.log("colsStart: ", colsStart)
  // console.log("colsEnd: ", colsEnd)

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
            <button
              type="button"
              className={classes.boardControls_btnContainer_btn}
            >
              FOCUS LATEST
            </button>
            <button
              type="button"
              className={classes.boardControls_btnContainer_btn}
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
