import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function AnimView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/roomba/?row=${props.width}&col=${props.length}&max_power=${props.maxPower}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response not ok");
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
    }, []);

    if (loading) return <p className="loading-text">Loading...</p>;
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