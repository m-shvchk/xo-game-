import React from 'react'
import classes from './BoardCell.module.css'

type BoardProps = {
  key: string;
  value: number;
}

const Board = (props: BoardProps) => {
  return (
    <div className={classes.boardCell}>
      <p className={`${classes.boardCell_sign} ${classes.boardCell_sign___red}`}>&#xd7;</p>
      {/* <p className={`${classes.boardCell_sign} ${classes.boardCell_sign___red}`}>&#x20D8;</p> */}
    </div>
  )
}

export default Board