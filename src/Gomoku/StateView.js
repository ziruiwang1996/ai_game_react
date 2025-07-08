import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import GridView from './GridView';
import { getApiUrl } from '../utils/api';

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
        fetch(`${API_URL}/api/gomoku/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                board_size: props.boardSize,
                win_size: props.winSize,
                ai_first: props.aiFirst
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        })
        .then(data => {
            setState(data.state);
            setStatus(data.status);
            decodeBase64Numpy(data.state);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.boardSize, props.winSize, props.aiFirst, API_URL]);

    useEffect(() => {
        setLoading(true);
        if (col !== null && row !== null) {
            fetch(`${API_URL}/api/gomoku/move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    board_size: props.boardSize,
                    win_size: props.winSize,
                    col: col,
                    row: row,
                    state_str: state
                })
            }) 
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response not ok");
                }
                return response.json();
            })
            .then(data => {
                setState(data.state);
                setStatus(data.status);
                decodeBase64Numpy(data.state);
                setLoading(false);
                if (data.status === "tie") setMessage("It is a Tie");
                if (data.status === "player_win") setMessage("You Win!");
                if (data.status === "ai_win") setMessage("AI Win!");
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [col, row, state, props.boardSize, props.winSize, API_URL]);

    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">Error: {error.message}</p>;

    const handleClick = (rIdx, cIdx) => {
        if (status === "in_progress" && board !== null) {
            if (board[rIdx][cIdx] === 0) {
                setRow(rIdx);
                setCol(cIdx);
            }
        }
    }

    return (
        <div className="board-container">
            {message && <div style={{textAlign: "center"}}>
                            <h1>Game Over!</h1>
                            <h1>{message}</h1>
                        </div>}
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