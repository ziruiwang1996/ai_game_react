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
                    <h1>Roomba Cleaner</h1>
                    <p>Zirui's room has been dirty for a week, but luckily, his Roomba can clean it. Zirui designed an A* search algorithm so that:</p>
                    <ul>
                        <li>Roomba cleans every dirty spot (white cell).</li>
                        <li>Roomba avoids walls (black cell).</li>
                        <li>Roomba finishes cleaning before running out of power.</li>
                        <li>Roomba returns to a charger (gray cell) after cleaning.</li>
                    </ul>
                    <p>Let's test Zirui's solution! Input <b>positive integer</b> to define room dimension and Roomba power capacity. It is recommended that the <b>power capacity</b> be set to <b>2 × max(room width, room length) + 1</b> to ensure a solution.</p>
                    <p>Roomba instructions:</p>
                    <ul>
                        <li>Moves in 5 directions: up, down, left, right, or stay put.</li>
                        <li>Loses 1 power per move (except staying put on a clean square).</li>
                        <li>Cleans a dirty square only by staying put on it, consuming 1 power.</li>
                        <li>Charges by staying put on a charger (if not at max power).</li>
                        <li>Passing over dirt or a charger without staying put has no effect.</li>
                        <li>If power reaches zero, it can only stay put.</li>
                    </ul>
                </div>
            </div>
            <div className="roomba-input-container">
                <label htmlFor="rw">Room Width:</label>
                <input id="rw" type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))}/>
                <label htmlFor="rl">Room Length:</label>
                <input id="rl" type="number" value={length} onChange={(event) => setLength(Number(event.target.value))}/>
                <label htmlFor="pc">Power Capacity:</label>
                <input id="pc" type="number" value={maxPower} onChange={(event) => setMaxPower(Number(event.target.value))}/>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
                <button classname="home-button" onClick={() => setPlayRoomba(false)}>Back Home</button>
            </div>
            {showGridView 
                && (width > 0) 
                && (length > 0)
                && (maxPower > 0) 
                && ( <AnimView width={width} length={length} maxPower={maxPower}/> )}
        </div>
    )
}

export default RoombaHome;


