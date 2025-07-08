import React from 'react';
import PropTypes from 'prop-types';

function GameCard(props) {
    return (
        <div className={`game-card ${props.onClick ? 'clickable' : 'disabled'}`} onClick={props.onClick}>
            <div className="game-card-image-container">
                <img src={props.image} alt={props.name} />
                {props.onClick && (
                    <div className="game-card-overlay">
                        <div className="play-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span>Click to Play</span>
                    </div>
                )}
            </div>
            <div className="game-card-content">
                <h3>{props.name}</h3>
                {!props.onClick && <span className="coming-soon">Coming Soon</span>}
            </div>
        </div>
    );
}

GameCard.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default GameCard;