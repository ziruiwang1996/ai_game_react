import PropTypes from 'prop-types';

function GridView(props) {
    let symbol = ' ';

    switch(props.value) {
        case 0:
            symbol = ' ';
            break;
        case 1:
            symbol = 'X';
            break;
        case -1:
            symbol = 'O';
            break;
        default:
            symbol = ' ';
    }

    return (
        <div className='grid-view' onClick={props.onClick}>
            <h1>{symbol}</h1>
        </div>
    );
}

GridView.propTypes = {
    value: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
};

export default GridView;