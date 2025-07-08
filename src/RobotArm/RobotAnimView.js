import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { getApiUrl } from '../utils/api';

function RobotAnimView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const API_URL = getApiUrl();

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/robotarm/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                arm_lengths: props.arms.split(',').map(s => parseFloat(s.trim())),
                target_position: props.target.split(',').map(s => parseFloat(s.trim())),
                iterations: props.iterations,
                learning_rate: 0.01,
                convergence_threshold: 0.1
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        })
        .then(data => {
            return fetch(`${API_URL}${data.animation_url}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch animation");
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            setData(url);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, [props.arms, props.target, props.iterations, API_URL]);

    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">Error: {error.message}</p>;

    return (
        <div className='anim-view'>
        {data && <img src={data} alt="Robot Arm Animation" />}
    </div>
    )
}

RobotAnimView.propTypes = {
    arms: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    iterations: PropTypes.number.isRequired
};

export default RobotAnimView;