import React, {useState, useContext} from "react";
import AnimView from "./AnimView";
import { GameContext } from "../App";

function RoombaHome() {
    const [width, setWidth] = useState(null);
    const [length, setLength] = useState(null);
    const [maxPower, setMaxPower] = useState(null);
    const [showGridView, setShowGridView] = useState(false);
    const [buttonText, setButtonText] = useState("Play");
    const {setPlayRoomba} = useContext(GameContext);

    const handlePlayClick = () => {
        setShowGridView(false); // Unmount GridView
        setTimeout(() => {
            setShowGridView(true); // Remount GridView with new props
            setButtonText("Play Again");
        }, 0);
    };

    return (
        <div>
            <div className="instruction-container">
                <div className="instruction">
                    <h1>Can Roomba Clean Zirui’s Messy Room?</h1>
                    <p>Zirui’s room has been a mess for a week—but luckily, his Roomba is ready to clean! To ensure efficiency, Zirui designed an A search algorithm* that helps Roomba navigate the room intelligently while conserving power.</p>
                    <p><b>How It Works:</b></p>
                    <ul>
                        <li>Objective: Roomba must clean every dirty spot (white cells) while avoiding obstacles (black cells).</li>
                        <li>Energy Management: It must finish cleaning before running out of power and return to a charger (gray cell) when needed.</li>
                        <li>Smart Navigation: The A* algorithm ensures Roomba finds the most efficient path to complete its task.</li>
                    </ul>
                    <p><b>Game Setup:</b></p>
                    <ul>
                        <li>Input a positive integer to define the room’s dimensions and Roomba’s power capacity.</li>
                        <li>To guarantee a solution, it’s recommended to set the power capacity to 2 × max(room width, room length) + 1.</li>
                    </ul>
                    <p><b>Roomba instructions:</b></p>    
                    <ul>
                        <li>Moves in five directions: up, down, left, right, or stay put.</li>
                        <li>Loses 1 power per move (except when staying put on a clean square).</li>
                        <li>Cleans a dirty square by staying put on it, consuming 1 power.</li>
                        <li>Charges by staying put on a charger (unless already at max power).</li>
                        <li>Passing over dirt or a charger without staying put has no effect.</li>
                        <li>If power reaches zero, Roomba can only stay put.</li>
                    </ul>
                    <p>Can Zirui’s Roomba clean the room efficiently before running out of power? Test the algorithm and see if it can handle the mess! 🧹🤖</p>
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="rw">Room Width:</label>
                <input id="rw" type="number" min="1" value={width} onChange={(event) => setWidth(Number(event.target.value))}/>
                <label htmlFor="rl">Room Length:</label>
                <input id="rl" type="number" min="1" value={length} onChange={(event) => setLength(Number(event.target.value))}/>
                <label htmlFor="pc">Power Capacity:</label>
                <input id="pc" type="number" min="1" value={maxPower} onChange={(event) => setMaxPower(Number(event.target.value))}/>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
                <button classname="home-button" onClick={() => setPlayRoomba(false)}>Back Home</button>
            </div>
            {showGridView 
                && ( <AnimView width={width} length={length} maxPower={maxPower}/> )}
        </div>
    )
}

export default RoombaHome;


