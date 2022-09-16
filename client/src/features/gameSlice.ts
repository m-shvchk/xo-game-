import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface gameState {
  sign: null | 1 | 2; // 1 for "x" and 2 for "o"
  moves: { [key: string]: number };
  lastTwoMoves: [string | null, string | null];
  myTurn: boolean;
}

interface MoveMade {
  [key: string]: number;
}

const initialState: gameState = {
  sign: null,
  moves: {},
  lastTwoMoves: [null, null],
  myTurn: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {

    activateFirstPlayer: (state) => {
      state.sign = 1;
      state.myTurn = true;
    },

    receiveMove: (state, action: PayloadAction<MoveMade>) => {
      if (!state.sign) {
        const opponentsSign = Object.values(action.payload)[0];
        if (opponentsSign === null) throw new Error("invalid sign received");
        state.sign = opponentsSign === 1 ? 2 : 1;
      }
      state.moves = Object.assign(state.moves, action.payload);

      const payloadKey = Object.keys(action.payload)[0];
      state.lastTwoMoves.shift();
      state.lastTwoMoves.push(payloadKey);

      // check winning condition
      
      state.myTurn = true;
    },

    makeMove: (state, action: PayloadAction<MoveMade>) => {
      state.moves = Object.assign(state.moves, action.payload);

      const payloadKey = Object.keys(action.payload)[0];
      state.lastTwoMoves.shift();
      state.lastTwoMoves.push(payloadKey);

      // check winning condition

      state.myTurn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { makeMove } = gameSlice.actions;
export default gameSlice.reducer;
