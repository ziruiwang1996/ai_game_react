import React from 'react';
import PropTypes from 'prop-types';

function GameCard(props) {
    return (
        <div className="game-card" onClick={props.onClick} style={{ cursor: 'pointer'}}>
            <img src={props.image} alt={props.name} />
            <h3>{props.name}</h3>
        </div>
    );
}

GameCard.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default GameCard;