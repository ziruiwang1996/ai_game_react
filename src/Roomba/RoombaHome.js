import React, {useState} from "react";
import AnimView from "./AnimView";

function RoombaHome() {
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [maxPower, setMaxPower] = useState("");
    const [showGridView, setShowGridView] = useState(false);
    const [buttonText, setButtonText] = useState("Play");

    const handlePlayClick = () => {
        setShowGridView(false); // Unmount GridView
        setTimeout(() => {
        const widthNum = Number(width);
            const lengthNum = Number(length);
            const maxPowerNum = Number(maxPower);
            
            if (!width || !length || !maxPower || widthNum <= 0 || lengthNum <= 0 || maxPowerNum <= 0) {
                window.alert("Please enter valid positive numbers for all fields.");
            } else if (widthNum < 5 || lengthNum < 5) {
                window.alert("Room dimensions must be at least 5x5.");
            } else if (widthNum > 20 || lengthNum > 20) {
                window.alert("Room dimensions must not exceed 20x20.");
            } else if (maxPowerNum < 10) {
                window.alert("Power capacity must be at least 10.");
            } else if (maxPowerNum > 300) {
                window.alert("Power capacity must not exceed 300.");
            } else if (maxPowerNum < 2 * Math.max(widthNum, lengthNum) + 1) {
                window.alert("To guarantee a solution, try a larger power capacity.");
            }
            else {
                setShowGridView(true); // Remount GridView with new props
                setButtonText("Play Again");
            }
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
                        <li>Objective: Roomba must clean every dirty spot (white cells, randomly assigned when initiating the state) while avoiding obstacles (black cells).</li>
                        <li>Energy Management: It must finish cleaning before running out of power and return to a charger (gray cell) when needed.</li>
                        <li>Smart Navigation: The A* algorithm ensures Roomba finds the most efficient path to complete its task.</li>
                    </ul>
                    <p><b>Game Setup:</b></p>
                    <ul>
                        <li>Input room dimensions (5-20 for width and length) and Roomba's power capacity (10-300).</li>
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
                <label htmlFor="rw">Room Width (5-20):</label>
                <input id="rw" type="number" min="5" max="20" value={width} onChange={(event) => setWidth(event.target.value)}/>
                <label htmlFor="rl">Room Length (5-20):</label>
                <input id="rl" type="number" min="5" max="20" value={length} onChange={(event) => setLength(event.target.value)}/>
                <label htmlFor="pc">Power Capacity (10-300):</label>
                <input id="pc" type="number" min="10" max="300" value={maxPower} onChange={(event) => setMaxPower(event.target.value)}/>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
            </div>
            {showGridView 
                && ( <AnimView width={Number(width)} length={Number(length)} maxPower={Number(maxPower)}/> )}
        </div>
    )
}

export default RoombaHome;


