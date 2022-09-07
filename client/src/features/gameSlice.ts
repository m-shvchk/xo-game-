import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface gameState {
    name: string;
    oponent: string;
    sign: 1 | 2; // 1 for "x" and 2 for "o"
    movesX: string[];
    movesO: string[];
  }
  
  const initialState: gameState = {
    name: "",
    oponent: "",
    sign: 1,
    movesX: [],
    movesO: [],
  }
  
  export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      makeMove: (state, action: PayloadAction<number>) => {
        // state.sign += action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { makeMove } = gameSlice.actions
  export default gameSlice.reducer