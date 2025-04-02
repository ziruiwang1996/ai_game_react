import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function CMAnimView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/catmouse/?row=${props.width}&col=${props.length}`)
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
            {data && <img src={data} alt="Cat Mouse Animation" />}
        </div>
    )
}

CMAnimView.PropTypes = {
    width: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired
}


export default CMAnimView;