import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import GridView from './GridView';

function StateView(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [state, setState] = useState(null);
    const [status, setStatus] = useState(null);

    const [board, setBoard] = useState(null);

    const [col, setCol] = useState(null);
    const [row, setRow] = useState(null);

    const decodeBase64Numpy = (base64String) => {
        const binaryString = atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const intArray = new Int32Array(bytes.buffer);
        // Convert to n x n array
        const b = [];
        for (let i = 0; i < props.boardSize; i++) {
            b.push(Array.from(intArray.slice(i * props.boardSize, (i + 1) * props.boardSize)));
        }
        setBoard(b);
      };

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/gomoku/start?board_size=${props.boardSize}&win_size=${props.winSize}&ai_first=${props.aiFirst}`)
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
    }, []);

    useEffect(() => {
        setLoading(true);
        if (col !== null && row !== null) {
            fetch(`http://127.0.0.1:8000/gomoku/move?board_size=${props.boardSize}&win_size=${props.winSize}&col=${col}&row=${row}&state_str=${state}`)
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
        }
    }, [col, row]);

    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">Error: {error.message}</p>;

    const handleClick = (rIdx, cIdx) => {
        if (status === 1) return; // player win
        if (status === 2) return; // AI win
        setRow(rIdx);
        setCol(cIdx);
    }

    return (
        <div className='board-view'>
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