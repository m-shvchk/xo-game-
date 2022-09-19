import React from 'react';
import { MoveMade } from './gameSlice';

export const adjustBoard = (
  moveObj: MoveMade,
  rowStart: number,
  rowEnd: number,
  colsStart: number,
  colsEnd: number,
  rowsStartSetter: React.Dispatch<React.SetStateAction<number>>,
  rowsEndSetter: React.Dispatch<React.SetStateAction<number>>,
  colsStartSetter: React.Dispatch<React.SetStateAction<number>>,
  colsEndSetter: React.Dispatch<React.SetStateAction<number>>
) => {

    // Getting coordinates of the last move:
    let [rowCoordinate, columnCoordinate] = Object.keys(moveObj)[0].split(',');
    let x = parseInt(rowCoordinate, 10);
    let y = parseInt(columnCoordinate, 10);

    // Adding additional rows if needed. If "x > 0" - check the index of first row, if "x < 0" - check the index of last row  
    switch (x > 0){
        case true:
            if (rowEnd - x < 4) rowsEndSetter(x+4)
            break;
        case false:
            if (Math.abs(rowStart - x) < 4) rowsStartSetter(x-4)
            break;
        default:
            break; 
    }

        // Adding additional columns if needed. If "x > 0" - check the index of first column, if "x < 0" - check the index of last column:
        switch (y > 0){
            case true:
                if (colsEnd - y < 4) colsEndSetter(y+4)
                break;
            case false:
                if (Math.abs(colsStart - y) < 4) colsStartSetter(y-4)
                break;
            default:
                break; 
        }


};
