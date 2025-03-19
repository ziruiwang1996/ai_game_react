import React, {useState, useContext} from "react";
import { GameContext } from "../App";
import Dropdown from 'react-bootstrap/Dropdown';
import StateView from "./StateView";

function GomokuHome() {
    const [boardSize, setBoardSize] = useState(null);
    const [winSize, setWinSize] = useState(null);
    const [aiFirst, setAiFirst] = useState(null);

    const [showStateView, setShowStateView] = useState(false);
    const [buttonText, setButtonText] = useState("Start Game");
    const {setPlayGomoku} = useContext(GameContext);

    const handlePlayClick = () => {
        setShowStateView(false); 
        setTimeout(() => {
            setShowStateView(true);
            setButtonText("Play Again");
        }, 0);
    };

    return (
        <div>
            <div className="instruction-container">
                <div className="instruction">
                    <h1>Gomoku</h1>
                    <p>Zirui gets pretty competitive when it come to games. To secure victory, he designed a Minimax algorithm to challenge you. The algorithmn aims to minimize your chances of wining while maxmizing Zirui's wining. Give a try to see if you can outsmart AI algorithmn.</p>
                    <a href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://en.wikipedia.org/wiki/Gomoku%23:~:text%3D13%2520External%2520links-,Rules,horizontally%252C%2520vertically%252C%2520or%2520diagonally.&ved=2ahUKEwjXpdD_uJWMAxVQD1kFHStLIMkQFnoECCsQAw&usg=AOvVaw3MeskL1eRz7jcfYEF185Dz">
                        Click here to check Gomoku rules
                    </a>
                </div>
            </div>
            <div className="roomba-input-container">
                <label htmlFor="bs">Board Size:</label>
                <input id="bs" type="number" value={boardSize} onChange={(event) => setBoardSize(Number(event.target.value))}/>
                <label htmlFor="ws">Win Size:</label>
                <input id="ws" type="number" value={winSize} onChange={(event) => setWinSize(Number(event.target.value))}/>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">Who Goes First</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setAiFirst(false)}>Player</Dropdown.Item>
                        <Dropdown.Item onClick={() => setAiFirst(true)}>Zirui</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
                <button className="home-button" onClick={() => setPlayGomoku(false)}>Back Home</button>
                <button className="home-button" onClick={() => setShowStateView(false)}>Reset Game</button>
                <button className="home-button">Move</button>
            </div>

            {showStateView 
                && (boardSize > 0) 
                && (winSize > 0)
                && ( <StateView boardSize={boardSize} winSize={winSize} aiFirst={aiFirst}/> )}
        </div>
    )
}
export default GomokuHome;
