import Header from "./Header";
import GameCard from "./GameCard";
import RoombaHome from "./Roomba/RoombaHome";
import GomokuHome from "./Gomoku/GomokuHome";
import CatMouseHome from "./CatMouse/CatMouseHome";
import RobotArmHome from "./RobotArm/RobotArmHome";
import roombaImage from './assets/roomba.jpg';
import gomokuImage from './assets/gomoku.jpg';
import comeSoonImage from './assets/comesoon.jpg';
import catMouseImage from './assets/catmouse.jpg';
import robotArmImage from './assets/robotarm.png';
import { useState, createContext } from "react";

export const GameContext = createContext();

function App() {
  const [playRoomba, setPlayRoomba] = useState(false);
  const [playGomoku, setPlayGomoku] = useState(false);
  const [playCatMouse, setPlayCatMouse] = useState(false);
  const [playRobotArm, setPlayRobotArm] = useState(false);

  if (playRoomba) {
    return (
      <GameContext.Provider value={{setPlayRoomba}}>
        <RoombaHome/>
      </GameContext.Provider>
      );
  }

  if (playGomoku) {
    return (
      <GameContext.Provider value={{setPlayGomoku}}>
        <GomokuHome/>
      </GameContext.Provider>
    );
  }

  if (playCatMouse) {
    return (
      <GameContext.Provider value={{setPlayCatMouse}}>
        <CatMouseHome/>
      </GameContext.Provider>
    );
  }

  if (playRobotArm) {
    return (
      <GameContext.Provider value={{setPlayRobotArm}}>
        <RobotArmHome/>
      </GameContext.Provider>
    );
  }

  return (
    <div>
      <Header/>
      <div className="game-container">
        <GameCard name="Roomba" image={roombaImage} onClick={() => {setPlayRoomba(true);}}/>
        <GameCard name="Gomoku" image={gomokuImage} onClick={() => {setPlayGomoku(true);}}/>
        <GameCard name="Escape from Liam" image={catMouseImage} onClick={() => {setPlayCatMouse(true);}}/>
        <GameCard name="Robot Arm" image={robotArmImage} onClick={() => {setPlayRobotArm(true);}}/>
        <GameCard name="Stay Tuned" image={comeSoonImage}/>
      </div>
    </div>
  );
}

export default App;
