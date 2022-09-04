import React from 'react'
import classes from './BoardCell.module.css'

type BoardProps = {
  key: string;
  value: number;
}

const Board = (props: BoardProps) => {
  return (
    <div className={classes.boardCell}></div>
  )
}

export default Board