import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function GridView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/roomba/${props.width}&${props.length}&${props.maxPower}`)
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
    }, [props.width, props.length, props.maxPower]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className='grid-view'>
            {data && <img src={data} alt="Roomba Animation" />}
        </div>
    )
}

GridView.propTypes = {
    width: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    maxPower: PropTypes.number.isRequired
};

export default GridView;