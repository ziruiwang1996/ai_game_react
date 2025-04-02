import React, {useState, useContext} from "react";
import { GameContext } from "../App";
import RobotAnimView from "./RobotAnimView";

function RobotArmHome() {
    const [arms, setArms] = useState("");
    const [target, setTarget] = useState("");
    const [showAnimView, setShowAnimView] = useState(false);
    const [buttonText, setButtonText] = useState("Play");
    const {setPlayRobotArm} = useContext(GameContext);

    const handlePlayClick = () => {
        setShowAnimView(false);
        setTimeout( () => {
            setShowAnimView(true);
            setButtonText("Play Again");
        }, 0);
    }

    return (
        <div>
            <div className="instruction-container">
                <div className="instruction">
                    <h1>Robot Arm Challenge</h1>
                    <p>Embark on a hands-on journey into the world of optimization with Gradient Descent: Robot Arm Challenge! In this interactive game, you'll explore how gradient descent—a fundamental machine learning and optimization algorithm—helps a robotic arm adjust its joint angles to precisely reach a designated target.</p>
                    <p><b>How It Works:</b></p>
                    <ul>
                        <li>The robot arm consists of multiple segments connected by joints.</li>
                        <li>Your goal is to set a target position, and the algorithm will iteratively adjust the angles of the arm's joints using gradient descent to move closer to the target.</li>
                        <li>The optimization process continuously minimizes the distance between the arm’s end-effector (hand) and the target by adjusting angles step by step.</li>
                    </ul>
                    <p><b>How It Works:</b></p>
                    <ul>
                        <li>To ensure the arm can reach the target, make sure the total length of all arm segments is at least as long as the straight-line distance from the origin to the target.</li>
                        <li>Watch in real time as the arm dynamically updates its angles to find an optimal configuration!</li>
                    </ul>
                </div>
            </div>
            <div className="input-container">
                <label htmlFor="ra">Robot Arms:</label>
                <input id="ra" type="string" value={arms} placeholder="Length 1, Length 2, ..." onChange={(event) => setArms(event.target.value)}/>
                <label htmlFor="tc">Target Coordinate:</label>
                <input id="tc" type="string" value={target} placeholder="x, y" onChange={(event) => setTarget(event.target.value)}/>
                <button className="play-button" onClick={handlePlayClick}>{buttonText}</button>
                <button className="home-button" onClick={() => setPlayRobotArm(false)}>Back Home</button>
            </div>
            {showAnimView && arms && target
                && ( <RobotAnimView arms={arms} target={target}/>)}
        </div>
    );
}

export default RobotArmHome;