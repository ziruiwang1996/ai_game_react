import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getApiUrl } from '../utils/api';

function CMAnimView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = getApiUrl();
    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/catmouse/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grid_rows: props.length,
                grid_cols: props.width
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error("API Error Response:", text);
                    throw new Error(`API Error ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // Animation URL includes /api prefix, we need to remove it for proxy compatibility
            const animationPath = data.animation_url.startsWith('/api') 
                ? data.animation_url.substring(4)  // Remove '/api'
                : data.animation_url;
            
            // Now fetch the animation using the animation_url from the JSON response
            return fetch(`${API_URL}${animationPath}`);
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error("Animation fetch error:", response.status, text);
                    throw new Error(`Failed to fetch animation: ${response.status}`);
                });
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
    }, [props.width, props.length, API_URL]);

    if (loading) return <p className="loading-text">Loading...</p>;
    if (error) return <p className="error-text">Error: {error.message}</p>;

    return (
        <div className='anim-view'>
            {data && <img src={data} alt="Cat Mouse Animation" />}
        </div>
    )
}

CMAnimView.propTypes = {
    width: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired
};

export default CMAnimView;