import React from 'react';
import { applicableEnchants } from '../data/tools';

const toolTypes = Object.keys(applicableEnchants);

export default function ToolSelect({ side, tool, onToolChange, onPenaltyChange }) {
    const isTarget = side === 'target';
    const label = isTarget ? 'Target' : 'Sacrifice';

    // Icon handling: simple implementation assuming images exist
    // Fallback to empty if not found? Browser handles broken image.
    // Base URL support for GitHub Pages
    const iconSrc = `${import.meta.env.BASE_URL}res/${tool.type}.png`;

    return (
        <div className="tool-select-container">
            <div className="tool-select-header">
                {/* Penalty Input moved to header for better layout */}
                <div className="penalty-input-group" title="How many times this tool has been used in an Anvil">
                    <span style={{ cursor: 'help', borderBottom: '1px dotted var(--text-muted)' }}>Penalty:</span>
                    <div className="flex items-center gap-2">
                        <input
                            className="penalty-slider"
                            type="range"
                            value={tool.prior_penalty}
                            onChange={(e) => onPenaltyChange(parseInt(e.target.value))}
                            min="0"
                            max="5"
                        />
                        <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{tool.prior_penalty}</span>
                    </div>
                </div>
            </div>

            <div className="tool-preview">
                <img
                    src={iconSrc}
                    alt={tool.type}
                    className="tool-icon"
                    onError={(e) => e.target.style.display = 'none'}
                    onLoad={(e) => e.target.style.display = 'block'}
                />
                <select
                    className="tool-dropdown"
                    value={tool.type}
                    onChange={(e) => onToolChange(e.target.value)}
                >
                    {toolTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
