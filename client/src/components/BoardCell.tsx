import React from "react";
import { useRef, useEffect } from "react";
import classes from "./BoardCell.module.css";

type BoardProps = {
  key: string;
  id: string;
  value: number;
  winner: boolean;
};

const BoardCell = ({ value, id, winner }: BoardProps) => {
  const focusRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<boolean>(false);

  // 'x' or 'o' sign or empty cell:
  let cellContent = null;
  if (value === 1) cellContent = "\u00D7";
  else if (value === 2) cellContent = "\u20D8";

  useEffect(() => {
    // highlighting and scrolling into view the last move:
    const cell = focusRef.current;
    // preventing highlighting on mount with the use of numRef:
    if (cell && numRef.current) {
      cell.style.backgroundColor = "#aaa";
      setTimeout(() => {
        cell.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        console.log("running");
      }, 0);
      setTimeout(() => {
        cell.style.backgroundColor = "transparent";
      }, 3000);
    } else {
      numRef.current = true;
    }
  }, [value]);

  // cell content classes (normal, highlighted, winning):
  let cellContentClass = winner
    ? `${classes.boardCell_sign} ${classes.boardCell_sign___red}`
    : `${classes.boardCell_sign}`;

  return (
    <div className={classes.boardCell} ref={focusRef}>
      <p className={cellContentClass} id={id}>
        {cellContent}
      </p>
    </div>
  );
};

export default React.memo(BoardCell);
