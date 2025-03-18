import React, {useState, useContext} from "react";
import GridView from "./GridView";
import { GameContext } from "../App";

function RoombaHome() {
    const [width, setWidth] = useState(0);
    const [length, setLength] = useState(0);
    const [maxPower, setMaxPower] = useState(1);
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
            <div>
                <input type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))}/>
                <input type="number" value={length} onChange={(event) => setLength(Number(event.target.value))}/>
                <input type="number" value={maxPower} onChange={(event) => setMaxPower(Number(event.target.value))}/>
                <button onClick={handlePlayClick}>{buttonText}</button>
                <button onClick={() => setPlayRoomba(false)}>Home</button>
            </div>
            {showGridView && ( <GridView width={width} length={length} maxPower={maxPower}/> )}
        </div>
    )
}

export default RoombaHome;


