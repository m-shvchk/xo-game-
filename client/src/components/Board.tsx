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
  leaveGame,
} from "../features/gameSlice";
import { adjustBoard, switchToDefaults } from "../features/uiSlice";
import { MoveMade } from "../features/gameSlice";
import BoardControls from "./BoardControls";

type boardProps = {
  socket: Socket | null;
  roomNumber: string;
  setShowBoard: React.Dispatch<React.SetStateAction<boolean>>;
  setRelaunchToggle: React.Dispatch<React.SetStateAction<boolean>>;
  relaunchToggle: boolean;
};

const Board = ({
  socket,
  roomNumber,
  setShowBoard,
  setRelaunchToggle,
  relaunchToggle,
}: boardProps) => {
  
  const [timer, setTimer] = useState<number>(1000); // timeout for highlighting last move;
  const [opponentLeft, setOpponentLeft] = useState<boolean>(false)
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
  const rowsStart = useSelector((state: RootState) => {
    return state.ui.rowsStart;
  });
  const rowsEnd = useSelector((state: RootState) => {
    return state.ui.rowsEnd;
  });
  const colsStart = useSelector((state: RootState) => {
    return state.ui.colsStart;
  });
  const colsEnd = useSelector((state: RootState) => {
    return state.ui.colsEnd;
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
    dispatch(adjustBoard(moveObj));
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
        console.log("coordinates received: ", data);
        dispatch(receiveMove(data));
        // ADJUST BOARD SIZE:
        dispatch(adjustBoard(data));
      });
    }
    // remove listeners for "receive_move" if there is more than one:
    if (
      socket?.listeners("receive_move") &&
      socket?.listeners("receive_move").length > 1
    ) {
      socket
        .listeners("receive_move")
        .splice(0, socket?.listeners("receive_move").length - 1);
    }
  }, [socket, dispatch, rowsStart, rowsEnd, colsStart, colsEnd]);

  // ON LEAVE GAME:
  const leaveGameHandler = (e: React.SyntheticEvent) => {
    if (socket) socket.emit("leave_game", { roomNumber });
    socket?.disconnect();
    console.log("I'm leaving");
    dispatch(leaveGame());
    dispatch(switchToDefaults());
    setShowBoard(false);
    setTimer(1000);
    setRelaunchToggle(!relaunchToggle);
    setOpponentLeft(false)
  };

  // ON OPPONENT LEAVING GAME:
  useEffect(() => {
    if (socket) {
      socket.on("opponent_left", () => {
        console.log("opponent left room");
        socket?.disconnect();
        setOpponentLeft(true)
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
          timer={timer}
        />
      ))}
    </div>
  ));

  return (
    <>
      <div className={classes.appContainer}>
        <div className={classes.boardContainer} onClick={makeMoveHandler}>
          {content}
        </div>
        <BoardControls
          timer={timer}
          setTimer={setTimer}
          myTurn={myTurn}
          winner={winner}
          sign={sign}
          leaveGameHandler={leaveGameHandler}
          opponentLeft={opponentLeft}
        />
      </div>
    </>
  );
};

export default Board;
