import classes from "./App.module.css";
import Layout from "./components/Layout";
import { io } from "socket.io-client";
import Board from "./components/Board";
import { useEffect, useRef, useState } from "react";

export const socket = io("http://localhost:3001");

const App = () => {
  const [roomNumber, setRoomNumber] = useState<string>("");
  // const [] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const randomRoomRef = useRef<string>("");

  useEffect(() => inputRef.current?.focus(), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRoomNumber(e.target.value);
  };

  const joinChosenRoomHandler = () => {
    socket.emit("join_room", roomNumber);
  };

  const joinRandomRoomHandler = () => {
    randomRoomRef.current = Math.random().toString()

    socket.emit("join_room", "room1");
  };
  joinRandomRoomHandler();

  return (
    <Layout>
      <div className={classes.buttonContainer}>
        <form onSubmit={joinChosenRoomHandler}>
          <input
            ref={inputRef}
            onChange={handleChange}
            className={classes.buttonContainer_input}
            type="text"
            placeholder="enter room number"
          ></input>
          <button className={classes.buttonContainer_btn} type="button">
            START GAME BY ROOM NUMBER
          </button>
        </form>
        <button
          onClick={joinRandomRoomHandler}
          className={classes.buttonContainer_btn}
          type="button"
        >
          START GAME WITH RANDOM OPPONENT
        </button>
      </div>
      <Board />
    </Layout>
  );
};

export default App;
