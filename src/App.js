import RoombaHome from "./Roomba/RoombaHome";
import GameCard from "./GameCard";
import Header from "./Header";
import roombaImage from './assets/roomba.jpg';
import gomokuImage from './assets/gomoku.jpg';
import comeSoonImage from './assets/comesoon.jpg';
import { useState, createContext } from "react";

export const GameContext = createContext();

function App() {
  const [playRoomba, setPlayRoomba] = useState(false);
  const [playGomoku, setPlayGomoku] = useState(false);

  if (playRoomba) {
    return (
      <GameContext.Provider value={{setPlayRoomba}}>
        <RoombaHome/>
      </GameContext.Provider>
      );
  }

  return (
    <div>
      <Header/>
      <GameCard name="Roomba" image={roombaImage} onClick={() => {setPlayRoomba(true);}}/>
      <GameCard name="Gomoku" image={gomokuImage} onClick={() => {setPlayGomoku(true);}}/>
      <GameCard name="Stay Tuned" image={comeSoonImage}/>
    </div>
  );
}

export default App;
