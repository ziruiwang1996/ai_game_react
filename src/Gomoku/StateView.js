import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import GridView from './GridView';
import { getApiUrl, fetchApi } from '../utils/api';

// Move the function outside the component to avoid dependency issues
const createDecodeBase64Numpy = (boardSize, setBoard) => (base64String) => {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const intArray = new Int32Array(bytes.buffer);
    const b = [];
    for (let i = 0; i < boardSize; i++) {
        b.push(Array.from(intArray.slice(i * boardSize, (i + 1) * boardSize)));
    }
    setBoard(b);
};

function StateView(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [state, setState] = useState(null);
    const [status, setStatus] = useState(null);
    const [board, setBoard] = useState(null);
    const [message, setMessage] = useState(null);
    const [col, setCol] = useState(null);
    const [row, setRow] = useState(null);
    const API_URL = getApiUrl();
    
    // Create the decoder function with the current props
    const decodeBase64Numpy = createDecodeBase64Numpy(props.boardSize, setBoard);

    useEffect(() => {
        setLoading(true);
        
        const requestBody = {
            board_size: props.boardSize,
            win_size: props.winSize,
            ai_first: props.aiFirst
        };
        
        // Log the request payload
        console.log('Request payload for start:', requestBody);
        
        // Use the common fetchApi utility to ensure consistent handling
        fetchApi('/api/gomoku/start', {
            method: 'POST',
            body: JSON.stringify(requestBody)
        })
        .then(data => {
            console.log('Success response data from start:', data);
            setState(data.state);
            setStatus(data.status);
            decodeBase64Numpy(data.state);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error in start API call:', error);
            setError(error);
            setLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.boardSize, props.winSize, props.aiFirst, API_URL]);

    useEffect(() => {
        if (col !== null && row !== null) {
            // Additional validation before making the API call
            if (board && board[row] && board[row][col] !== 0) {
                console.error(`Invalid move attempt: Position (${row}, ${col}) is already occupied with value ${board[row][col]}`);
                setError(new Error("This position is already occupied. Please select an empty position."));
                // Reset selection to allow another attempt
                setRow(null);
                setCol(null);
                setLoading(false);
                return;
            }
            
            setLoading(true);
            const requestBody = {
                board_size: props.boardSize,
                win_size: props.winSize,
                col: col,
                row: row,
                state_str: state
            };
            
            // Log the request payload
            console.log('Request payload for move:', requestBody);
            
            // Use the common fetchApi utility to ensure consistent handling
            fetchApi('/api/gomoku/move', {
                method: 'POST',
                body: JSON.stringify(requestBody)
            })
            .then(data => {
                console.log('Success response data from move:', data);
                setState(data.state);
                setStatus(data.status);
                decodeBase64Numpy(data.state);
                setLoading(false);
                
                // Clear any previous error
                setError(null);
                
                // Set game status message
                if (data.status === "tie") setMessage("It is a Tie");
                if (data.status === "player_win") setMessage("You Win!");
                if (data.status === "ai_win") setMessage("AI Win!");
                
                // Reset selection for next move
                setRow(null);
                setCol(null);
            })
            .catch(error => {
                console.error('Error in move API call:', error);
                setError(error);
                setLoading(false);
                
                // Reset selection to allow another attempt
                setRow(null);
                setCol(null);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [col, row, state, props.boardSize, props.winSize, API_URL]);

    if (loading) return <p className="loading-text">Loading...</p>;
    
    // Improved error display that doesn't block the game UI
    const errorMessage = error ? 
        (error.message.includes("position already occupied") ? 
            "That position is already taken. Please choose an empty spot." : 
            `Error: ${error.message}`) 
        : null;

    const handleClick = (rIdx, cIdx) => {
        if (status === "in_progress" && board !== null) {
            // Check if the cell is empty (value === 0) before allowing the move
            if (board[rIdx][cIdx] === 0) {
                setRow(rIdx);
                setCol(cIdx);
            } else {
                console.log(`Cell at row ${rIdx}, col ${cIdx} is already occupied with value ${board[rIdx][cIdx]}`);
                // Optionally show a user-friendly message
                // setError(new Error("This position is already occupied. Please select an empty position."));
            }
        }
    }

    return (
        <div className="board-container">
            {message && <div style={{textAlign: "center"}}>
                            <h1>Game Over!</h1>
                            <h1>{message}</h1>
                        </div>}
                        
            {/* Display error message if any */}
            {errorMessage && 
                <div style={{textAlign: "center", color: "red", marginBottom: "15px"}}>
                    <p>{errorMessage}</p>
                </div>
            }
            
            <div style={{display: "grid", gridTemplateColumns: `repeat(${props.boardSize}, 1fr)`, width: "fit-content"}}>
                {board !== null && 
                    board.map((rowValues, rIdx) => (
                        rowValues.map((val, cIdx) => (
                            <GridView 
                                key={`${rIdx}-${cIdx}`} 
                                value={val} 
                                onClick={() => handleClick(rIdx, cIdx)}
                            />
                        ))
                    ))
                }
            </div>
        </div>
    );
}

StateView.propTypes = {
    boardSize: PropTypes.number.isRequired,
    winSize: PropTypes.number.isRequired,
    aiFirst: PropTypes.bool.isRequired
}

export default StateView;