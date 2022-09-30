import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoveMade } from "./gameSlice";

export interface uiState {
  rowsStart: number;
  rowsEnd: number;
  colsStart: number;
  colsEnd: number;
}

const initialState: uiState = {
  rowsStart: -12,
  rowsEnd: 12,
  colsStart: -12,
  colsEnd: 12,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    adjustBoard: (state, action: PayloadAction<MoveMade>) => {
      // Getting coordinates of the last move:
      let [rowCoordinate, columnCoordinate] = Object.keys(
        action.payload
      )[0].split(",");
      let x = parseInt(rowCoordinate, 10);
      let y = parseInt(columnCoordinate, 10);

      // Adding additional rows if needed. If "x > 0" - check the index of first row, if "x < 0" - check the index of last row
      switch (x > 0) {
        case true:
          if (state.rowsEnd - x < 4) state.rowsEnd = x + 4;
          break;
        case false:
          if (Math.abs(state.rowsStart - x) < 4) state.rowsStart = x - 4;
          break;
        default:
          break;
      }

      // Adding additional columns if needed. If "y > 0" - check the index of first column, if "y < 0" - check the index of last column:
      switch (y > 0) {
        case true:
          if (state.colsEnd - y < 4) state.colsEnd = y + 4;
          break;
        case false:
          if (Math.abs(state.colsStart - y) < 4) state.colsStart = y - 4;
          break;
        default:
          break;
      }
    },

    switchToDefaults: (state) =>{
        state.rowsStart = -12;
        state.rowsEnd = 12;
        state.colsStart = -12;
        state.colsEnd = 12;
    }

  },
});

// Action creators are generated for each case reducer function
export const { adjustBoard, switchToDefaults } = uiSlice.actions;
export default uiSlice.reducer;
