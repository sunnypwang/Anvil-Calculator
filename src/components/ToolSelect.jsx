import React from 'react';
import { applicableEnchants } from '../data/tools';

const toolTypes = Object.keys(applicableEnchants);

export default function ToolSelect({ side, tool, onToolChange, onPenaltyChange }) {
    const isTarget = side === 'target';
    const label = isTarget ? 'Target' : 'Sacrifice';

    // Icon handling: simple implementation assuming images exist
    // Fallback to empty if not found? Browser handles broken image.
    const iconSrc = `/res/${tool.type}.png`;

    return (
        <div className="tool-select-container">
            <div className="tool-select-header">
                {/* Penalty Input moved to header for better layout */}
                <div className="penalty-input-group" title="Prior Work Penalty">
                    <span>Penalty:</span>
                    <input
                        className="penalty-input"
                        type="number"
                        value={tool.prior_penalty}
                        onChange={(e) => onPenaltyChange(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        max="39"
                    />
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
