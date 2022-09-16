import React from "react";
import classes from "./BoardCell.module.css";

type BoardProps = {
  key: string;
  id: string;
  value: number;
};

const BoardCell = ({value, id}: BoardProps) => {

  // 'x' or 'o' sign or empty cell: 
  let cellContent = null;
  if(value === 1) cellContent = '\u00D7'
  else if (value === 2) cellContent = '\u20D8'

  // cell content classes (normal, highlighted, winning):
  let cellContentClass =`${classes.boardCell_sign}`

  return (
    <div className={classes.boardCell}>
      <p className={cellContentClass}>{cellContent}</p>
    </div>
  );
};

export default React.memo(BoardCell);
