import classes from "./App.module.css";
import Layout from "./components/Layout";
import { io, Socket } from "socket.io-client";
import Board from "./components/Board";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [showBoard, setShowBoard] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [relaunchToggle, setRelaunchToggle] = useState<boolean>(false);

  useEffect(() => {
    const newSocket: Socket = io("http://localhost:3001");
    setSocket(newSocket);
    return () => {
      socket?.close();
    };
    // eslint-disable-next-line
  }, [relaunchToggle]);

  useEffect(() => inputRef.current?.focus(), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRoomNumber(e.target.value);
  };

  const joinChosenRoomHandler = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    if (roomNumber === "") return;
    socket?.emit("join_room", roomNumber);
    setShowBoard(true);
    console.log("joined chosen room: ", roomNumber);
  };

  const joinRandomRoomHandler = () => {
    socket?.emit("generate_random_room");
    setShowBoard(true);
  };

  useEffect(() => {
    socket?.on("room_generated", (data) => {
      console.log("joined random room: ", data);
      setRoomNumber(data);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("room_is_full", () => {
      console.log("room is full");
    });
  }, [socket]);

  // const notifyUser = useCallback(
  //   (e: BeforeUnloadEvent) => {
  //     if (socket) socket.emit("leave_game", { roomNumber }); // trigger "leave_game" event when page gets reload
  //     console.log("notifyUser")
  //   },
  //   [socket, roomNumber]
  // );

  // useEffect(() => {
  //   window.addEventListener("beforeunload", notifyUser); // listen to "beforeunload" event (page refresh)
  //   return () => {
  //     window.removeEventListener("beforeunload", notifyUser);
  //   };
  // }, [notifyUser]);

  

  let buttonContainerContent = (
    <div className={classes.buttonContainer}>
      <form onSubmit={joinChosenRoomHandler}>
        <input
          ref={inputRef}
          onChange={handleChange}
          className={classes.buttonContainer_input}
          type="text"
          placeholder="enter room number"
        ></input>
        <button className={classes.buttonContainer_btn} type="submit">
          START GAME BY ROOM NUMBER
        </button>
      </form>
      <p>OR</p>
      <button
        onClick={joinRandomRoomHandler}
        className={classes.buttonContainer_btn}
        type="button"
      >
        START GAME WITH RANDOM OPPONENT
      </button>
    </div>
  );

  return (
    <Layout>
      {!showBoard && buttonContainerContent}
      {showBoard && (
        <Board
          socket={socket}
          roomNumber={roomNumber}
          setShowBoard={setShowBoard}
          setRelaunchToggle={setRelaunchToggle}
          relaunchToggle={relaunchToggle}
        />
      )}
    </Layout>
  );
};

export default App;
