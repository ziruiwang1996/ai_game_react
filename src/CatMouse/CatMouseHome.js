import React, {useState} from "react";
import CMAnimView from './CMAnimView';

function CatMouseHome() {
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [showAnimView, setShowAnimView] = useState(false);
    const [buttonText, setButtonText] = useState("Play");

    const handlePlayClick = () => {
        setShowAnimView(false);
        setTimeout(() => {
            const widthNum = Number(width);
            const lengthNum = Number(length);
            
            if (!width || !length || widthNum <= 0 || lengthNum <= 0) {
                window.alert("Please enter valid positive numbers for width and length.");
            } else if (widthNum < 3 || lengthNum < 3) {
                window.alert("Grid dimensions must be at least 3x3.");
            } else if (widthNum > 20 || lengthNum > 20) {
                window.alert("Grid dimensions must not exceed 20x20.");
            } else {
                setShowAnimView(true);
                setButtonText("Play Again");
            }
        }, 0);
    };

    return (
         <div>
            <div className="instruction-container">
                <div className="instruction">
                    <h1>Cat and the Learning Mouse</h1>
                    <div className="cat-mouse-content">
                        <div>
                        <p>Meet a special toy mouse! But this isn’t just any ordinary toy—it has been programmed by Zirui to learn and adapt using Temporal Difference (TD) learning, a powerful reinforcement learning technique.</p>
                        <p><b>How It Works:</b></p>
                        <ul>
                            <li>The toy mouse (represented as a small blue circle) learns from experience, continuously improving its ability to evade the cat.</li>
                            <li>The cat (represented as a larger red circle) tries to catch the mouse.</li>
                            <li>The mouse doesn’t rely on pre-programmed paths—it actively learns from each attempt, updating its strategy to avoid getting caught.</li>
                        </ul>
                        <p><b>The Power of TD Learning:</b></p>
                        <ul>
                            <li>Predict and adapt: TD learning helps the mouse estimate the future value of different actions by predicting the rewards they might yield.</li>
                            <li>Real-time decision-making: With every move, the mouse updates its knowledge, improving its ability to escape.</li>
                            <li>Optimizing behavior: Over time, the mouse refines its strategy, making it increasingly difficult for the cat to catch it.</li>
                        </ul>
                        <p>Can the cat outsmart its learning toy, or will the mouse keep slipping away? Watch as reinforcement learning unfolds in real time!<br/>
                        Set the game in motion by defining the room dimensions, and see if the cat can finally catch its clever little mouse! 🐭🔥</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="w">Width:</label>
                <input id="w" type="number" min="1" value={width} onChange={(event) => setWidth(event.target.value)}/>
                <label htmlFor="l">Length:</label>
                <input id="l" type="number" min="1" value={length} onChange={(event) => setLength(event.target.value)}/>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
            </div>
            {showAnimView 
                && ( <CMAnimView width={Number(width)} length={Number(length)}/> )}
        </div>
    );
}

export default CatMouseHome;