import PropTypes from 'prop-types';

function Header({ showBackButton = false, onBackClick = null, currentGame = null, hideTitle = false }) {
    return (
      <header className="header">
        <div className="header-content">
          {showBackButton && (
            <button className="back-button" onClick={onBackClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Home
            </button>
          )}
          {!hideTitle && <h1>AI Game Center</h1>}
          {currentGame && (
            <div className="current-game-indicator">
              <span className="game-breadcrumb">{hideTitle ? currentGame : `Playing: ${currentGame}`}</span>
            </div>
          )}
        </div>
      </header>
    );
}

Header.propTypes = {
  showBackButton: PropTypes.bool,
  onBackClick: PropTypes.func,
  currentGame: PropTypes.string,
  hideTitle: PropTypes.bool
};

export default Header;