import React from 'react'

type BoardProps = {
  key: string;
  value: number;
}

const Board = (props: BoardProps) => {
  return (
    <div>{props.value}</div>
  )
}

export default Board