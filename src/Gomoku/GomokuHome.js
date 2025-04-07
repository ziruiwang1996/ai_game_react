import React, {useState, useEffect, useContext} from "react";
import { GameContext } from "../App";
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
            if (boardSize > 10) {
                window.alert("Due to server limitations, this game only supports board size < 10.");
            } else if (winSize > boardSize) {
                window.alert("The win size cannot be greater than the board size.");
            } else if (aiFirst === null) {
                window.alert("Please set who goes first to start the game.");
            }
            else {
                setShowStateView(true);
                setButtonText("Play Again");
            }
        }, 0);
    };

    useEffect(() => {
        setShowStateView(false);
        setButtonText("Start Game");
    }, [boardSize, winSize]);

    return (
        <div>
            <div className="instruction-container">
                <div className="instruction">
                    <h1>Can You Outsmart AI?</h1>
                    <p>Zirui takes gaming very seriously—so seriously that he designed a Minimax algorithm to ensure victory! This AI isn’t just making random moves—it strategically evaluates every possibility to minimize your chances of winning while maximizing its own.</p>
                    <p><b>How It Works:</b></p>
                    <ul>
                        <li>The AI uses the Minimax algorithm, a decision-making strategy commonly used in two-player games like chess and Gomoku.</li>
                        <li>To make the AI more efficient, Alpha-Beta pruning is implemented, reducing the number of moves it needs to evaluate.</li>
                        <li>However, on larger boards, response time may increase due to the complexity of searching for the best move.</li>
                    </ul>
                    <p>Think you can outplay Zirui’s AI? It’s designed to be ruthless, but with clever strategy and patience, you just might find a way to win.</p>
                    <a href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://en.wikipedia.org/wiki/Gomoku%23:~:text%3D13%2520External%2520links-,Rules,horizontally%252C%2520vertically%252C%2520or%2520diagonally.&ved=2ahUKEwjXpdD_uJWMAxVQD1kFHStLIMkQFnoECCsQAw&usg=AOvVaw3MeskL1eRz7jcfYEF185Dz">
                        Click here to check Gomoku rules
                    </a>
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="bs">Board Size:</label>
                <input id="bs" type="number" min="1"  value={boardSize} onChange={(event) => setBoardSize(Number(event.target.value))}/>
                <label htmlFor="ws">Win Size:</label>
                <input id="ws" type="number" min="1" value={winSize} onChange={(event) => setWinSize(Number(event.target.value))}/>
                <select value={aiFirst} onChange={(event)=>{setAiFirst(event.target.value)}}>
                    <option value="" disabled selected hidden>Who Goes First</option>
                    <option value="false">Player</option>
                    <option value="true">Zirui</option>
                </select>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
                <button className="home-button" onClick={handlePlayClick}>Reset Game</button>
                <button className="home-button" onClick={() => setPlayGomoku(false)}>Back Home</button>
            </div>
            {showStateView 
                && ( <StateView boardSize={boardSize} winSize={winSize} aiFirst={aiFirst}/> )}
        </div>
    )
}
export default GomokuHome;
