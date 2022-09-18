import React from "react";
import classes from "./BoardCell.module.css";

type BoardProps = {
  key: string;
  id: string;
  value: number;
  winner: boolean;
};

const BoardCell = ({ value, id, winner }: BoardProps) => {
  // 'x' or 'o' sign or empty cell:
  let cellContent = null;
  if (value === 1) cellContent = "\u00D7";
  else if (value === 2) cellContent = "\u20D8";

  // cell content classes (normal, highlighted, winning):
  let cellContentClass = winner
    ? `${classes.boardCell_sign} ${classes.boardCell_sign___red}`
    : `${classes.boardCell_sign}`;

  return (
    <div className={classes.boardCell}>
      <p className={cellContentClass} id={id}>
        {cellContent}
      </p>
    </div>
  );
};

export default React.memo(BoardCell);
