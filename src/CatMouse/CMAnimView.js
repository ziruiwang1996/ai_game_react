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
        fetch(`${API_URL}/api/catmouse/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grid_rows: props.width,
                grid_cols: props.length
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