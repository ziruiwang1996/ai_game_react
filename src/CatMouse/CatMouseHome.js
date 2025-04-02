import React, {useState, useContext} from "react";
import { GameContext } from "../App";
import CMAnimView from './CMAnimView';

function CatMouseHome() {
    const {setPlayCatMouse} = useContext(GameContext);
    const [width, setWidth] = useState(null);
    const [length, setLength] = useState(null);
    const [showAnimView, setShowAnimView] = useState(false);
    const [buttonText, setButtonText] = useState("Play");

    const handlePlayClick = () => {
        setShowAnimView(false); // Unmount GridView
        setTimeout(() => {
            setShowAnimView(true); // Remount GridView with new props
            setButtonText("Play Again");
        }, 0);
    };

    return (
         <div>
            <div className="instruction-container">
                <div className="instruction">
                    <h1>Escape the Cat</h1>
                    <p>Place Holder ... talk about Markov Decision Process</p>
                </div>
            </div>
            <div>
                <label htmlFor="rw">Width:</label>
                <input id="rw" type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))}/>
                <label htmlFor="rl">Length:</label>
                <input id="rl" type="number" value={length} onChange={(event) => setLength(Number(event.target.value))}/>
                
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
                <button classname="home-button" onClick={() => setPlayCatMouse(false)}>Back Home</button>
            </div>
            {showAnimView 
                && (width > 0) 
                && (length > 0)
                && ( <CMAnimView width={width} length={length}/> )}
        </div>
    );
}

export default CatMouseHome;