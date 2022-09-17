import { gameState, PayloadKey } from "./gameSlice";
 
const checkCell = (
  i: number,
  j: number,
  sign: number,
  state: gameState,
  temp: PayloadKey[],
  final: PayloadKey[],
) => {
  let cell_key: PayloadKey = `${i},${j}`;

  if (!state.moves[cell_key]) {
    return;
  } else if (state.moves[cell_key] === sign) {
    temp.push(cell_key);
  } else if (state.moves[cell_key] !== sign && temp.length < 5) {
    temp = [];
  } else {
    final = final.concat(temp);
    temp = [];
  }
};

export const checkWinningCondition = (
  sign: number,
  state: gameState,
  cell_id: PayloadKey
) => {
  const [x, y] = cell_id.split(",").map((n) => parseInt(n, 10));

  // checking winning condition on four possible directions:
  let temp: PayloadKey[] = [];
  let final: PayloadKey[] = [];

  // axis 1 (top -> bottom):
  for (let i = x, j = y - 4; j < y + 5; j++) {
    checkCell(i, j, sign, state, temp, final);
  }
  if (temp.length < 5) temp = [];
  else {
    final = final.concat(temp);
    temp = [];
  }

  // axis 2 (bottom-left -> top-right):
  for (let i = x - 4, j = y + 4; i < x + 5 && j > y - 5; i++ && j--) {
    checkCell(i, j, sign, state, temp, final);
  }
  if (temp.length < 5) temp = [];
  else {
    final = final.concat(temp);
    temp = [];
  }

  // axis 3 (left -> right):
  for (let i = x - 4, j = y; i < x + 5; i++) {
    checkCell(i, j, sign, state, temp, final);
  }
  if (temp.length < 5) temp = [];
  else {
    final = final.concat(temp);
    temp = [];
  }

  // axis 4 (top-left -> bottom-right):
  for (let i = x - 4, j = y - 4; i < x + 5 && j < y + 5; i++ && j++) {
    checkCell(i, j, sign, state, temp, final);
  }
  if (temp.length < 5) temp = [];
  else {
    final = final.concat(temp);
    temp = [];
  }

  return final;
};

