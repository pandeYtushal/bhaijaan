import React from 'react';
import { ERAS } from '../../data/eras';
import { audioFX } from '../../utils/audioFX';

export function EraSelector({ activeEra = 'all', onSelectEra }) {
  const handleEraClick = (eraId) => {
    audioFX.playScissors();
    onSelectEra?.(eraId);
  };

  return (
    <div className="era-selector-container">
      <div className="era-header">
        <span className="era-badge">TIMELINE JOURNEY</span>
        <h3 className="era-title">SELECT SALMAN KHAN ERA</h3>
        <p className="era-subtitle">Filter 40 Full-Length Hit Songs by Era & Decade</p>
      </div>

      <div className="era-grid">
        {ERAS.map((era) => {
          const isActive = activeEra === era.id;
          return (
            <button
              key={era.id}
              type="button"
              className={`era-card ${isActive ? 'active' : ''}`}
              onClick={() => handleEraClick(era.id)}
              style={{
                '--era-glow': era.glowColor,
                '--era-badge': era.badgeColor,
                '--era-gradient': era.gradient
              }}
            >
              <div className="era-card-top">
                <span className="era-icon">{era.icon}</span>
                <span className="era-span">{era.span}</span>
              </div>
              <div className="era-label">{era.label}</div>
              <div className="era-card-title">{era.title}</div>
              <div className="era-quote">"{era.quote}"</div>
              {isActive && <div className="era-active-indicator">NOW TUNED</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EraSelector;
