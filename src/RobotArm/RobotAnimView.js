import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

function RobotAnimView(props) {
    const [data, setData] = useState(null);
    const [loading, setLoanding] = useState(null);
    const [error, setError] = useState(null);

    useEffect( () => {
        setLoanding(true);
        fetch(`/api/robotarm/?arms=${props.arms}&target=${props.target}&iterations=${props.iterations}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response not ok");
                }
                return response.blob();
            })
            .then (blob => {
                const url = URL.createObjectURL(blob);
                setData(url);
                setLoanding(false);
            })
            .catch(error => {
                setError(error);
                setLoanding(false);
            })
    }, []);

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