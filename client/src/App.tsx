import { useRef } from "react";
import classes from "./App.module.css";
import BoardCell from "./components/BoardCell";
import Layout from "./components/Layout";

const App = () => {
  const rowsNumRef = useRef<number>();
  const columnssNumRef = useRef<number>();
  rowsNumRef.current = 49;
  columnssNumRef.current = 49;

  const rowAxisModifierRef = useRef<number>();
  const columnAxisModifierRef = useRef<number>();
  rowAxisModifierRef.current = 0;
  columnAxisModifierRef.current = 0;

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
          key={`${rowIdx + rowAxisStartIdx}-${colIdx + columnAxisStartIdx}`}
          value={val}
        />
      ))}
    </div>
  ));

  return (
    <Layout>
      <div className={classes.appContainer}>
        <div className={classes.boardContainer}>{content}</div>
      </div>
    </Layout>
  );
};

export default App;
