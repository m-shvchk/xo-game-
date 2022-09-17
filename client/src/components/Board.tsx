import { useRef, useEffect } from "react";
import classes from "./Board.module.css";
import { Socket } from "socket.io-client";
import BoardCell from "./BoardCell";
import {useSelector, useDispatch} from "react-redux"
import { RootState } from "../app/store"
import { makeMove, receiveMove } from "../features/gameSlice"

// type ID = `${number},${number}`;

type boardProps = {
  socket: Socket | null;
  roomNumber: string
};

const Board = ({ socket, roomNumber }: boardProps) => {
  const rowsNumRef = useRef<number>();
  const columnssNumRef = useRef<number>();
  rowsNumRef.current = 25;
  columnssNumRef.current = 25;

  const rowAxisModifierRef = useRef<number>();
  const columnAxisModifierRef = useRef<number>();
  rowAxisModifierRef.current = 0;
  columnAxisModifierRef.current = 0;

  const dispatch = useDispatch()
  const myTurn = useSelector((state: RootState) => {
    return state.game.myTurn;
  })
  const sign = useSelector((state: RootState) =>{
    return state.game.sign;
  })

  const makeMoveHandler = (e: React.MouseEvent) => {
    const id = (e.target as HTMLDivElement)?.id;
    if (!id) return;
    if (!myTurn) return;

    const moveObj = {id: sign}
    dispatch(makeMove(moveObj));
    if(socket) socket.emit('send_move', {moveObj, roomNumber}) // emit move event with moveObj and roomNumber as parameters (emiting to a room is only possible from server)
  }

  // listen to "receive_move" event:
  useEffect(()=>{
    if(socket) socket.on("receive_move", data => {
      dispatch(receiveMove(data))
    })
  }, [socket, dispatch])

  
  const board = new Array(rowsNumRef.current);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(columnssNumRef.current).fill(0);
  }

  let rowAxisStartIdx =
    Math.floor(rowsNumRef.current / 2) * -1 + rowAxisModifierRef.current;
  let columnAxisStartIdx =
    Math.floor(columnssNumRef.current / 2) * -1 + columnAxisModifierRef.current;

  const content = board.map((row, rowIdx) => (
    <div className={classes.flexContainer} key={rowIdx + rowAxisStartIdx}>
      {row.map((val: number, colIdx: number) => (
        <BoardCell
          key={`${rowIdx + rowAxisStartIdx},${colIdx + columnAxisStartIdx}`}
          id={`${rowIdx + rowAxisStartIdx},${colIdx + columnAxisStartIdx}`}
          value={val}
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
      </div>
    </>
  );
};

export default Board;
