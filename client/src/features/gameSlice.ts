import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkWinningCondition } from "./winning_condition";

export type PayloadKey = `${number},${number}`;

export interface gameState {
  sign: null | 1 | 2; // 1 for "x" and 2 for "o"
  moves: { [key: PayloadKey]: number };
  myTurn: boolean;
  winner: { [key: PayloadKey]: number };
  movesInOrder: MoveMade[];
}

export interface MoveMade {
  [key: PayloadKey]: number | null;
}

const initialState: gameState = {
  sign: null,
  moves: {},
  myTurn: false,
  winner: {},
  movesInOrder: [],
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
        state.sign = opponentsSign === 1 ? 2 : 1;
      }
      state.moves = Object.assign(state.moves, action.payload);

      state.movesInOrder.push(action.payload);

      const payloadKey = Object.keys(action.payload)[0];

      // check winning condition:
      const winnerArray = checkWinningCondition(
        state.sign === 1 ? 2 : 1,
        state,
        payloadKey as PayloadKey
      );
      if (winnerArray.length > 0) {
        winnerArray.forEach(
          (el) => (state.winner[el] = state.sign === 1 ? 2 : 1)
        );
        state.myTurn = false;
      } else {
        state.myTurn = true;
      }
    },

    makeMove: (state, action: PayloadAction<MoveMade>) => {
      state.moves = Object.assign(state.moves, action.payload);

      state.movesInOrder.push(action.payload);

      const payloadKey = Object.keys(action.payload)[0];

      // check winning condition:
      const winnerArray = checkWinningCondition(
        state.sign === 1 ? 1 : 2,
        state,
        payloadKey as PayloadKey
      );
      if (winnerArray.length > 0) {
        winnerArray.forEach(
          (el) => (state.winner[el] = state.sign === 1 ? 1 : 2)
        );
      }
      state.myTurn = false;
    },

    leaveGame: (state) => {
      state.sign = null;
      state.moves = {};
      state.myTurn = false;
      state.winner = {};
      state.movesInOrder = [];
    },

    prepareRecording: (state) => {
      state.moves = {};
      state.winner = {};
    },

    reproduceMoveForward: (state, action: PayloadAction<MoveMade>) => {
      state.moves = Object.assign(state.moves, action.payload);

      // check winning condition:
      const payloadKey = Object.keys(action.payload)[0];
      const payloadValue = Object.values(action.payload)[0];

      const winnerArray = checkWinningCondition(
        payloadValue,
        state,
        payloadKey as PayloadKey
      );
      if (winnerArray.length > 0) {
        winnerArray.forEach((el) => (state.winner[el] = payloadValue));
        state.myTurn = false;
      }
    },

    reproduceMoveBack: (state, action: PayloadAction<MoveMade>) => {
      const keyToRemove = Object.keys(action.payload)[0] as PayloadKey;
      delete state.moves[keyToRemove];
      state.winner = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  activateFirstPlayer,
  receiveMove,
  makeMove,
  leaveGame,
  prepareRecording,
  reproduceMoveForward,
  reproduceMoveBack,
} = gameSlice.actions;
export default gameSlice.reducer;
