import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getApiUrl } from '../utils/api';

function AnimView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = getApiUrl();

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/roomba/pathfind`, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grid_rows: props.length,
                grid_cols: props.width,
                max_power: props.maxPower,
                num_dirty_spots: 5, // Example value, adjust as needed
                algorithm: 'a_star', // or 'breadth_first'
                animation_speed: 500 // milliseconds per frame
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            return response.json();
        })
        .then(data => {
            // Now fetch the animation using the animation_url from the JSON response
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
    }, [API_URL, props.length, props.width, props.maxPower]);

    if (loading) return (
        <div className="loading-text">
            <div className="loading-spinner"></div>
            Loading animation...
        </div>
    );
    if (error) return <p className="error-text">Error: {error.message}</p>;

    return (
        <div className='anim-view'>
            {data && <img src={data} alt="Roomba Animation" />}
        </div>
    )
}

AnimView.propTypes = {
    width: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    maxPower: PropTypes.number.isRequired
};

export default AnimView;