import React from 'react';

export default function EnchantmentRow({ name, maxLevel, currentLevel, onChange }) {
    const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

    return (
        <div className="enchant-row">
            <span className="enchant-name">{name}</span>
            <div className="level-controls">
                {levels.map((lvl) => (
                    <button
                        key={lvl}
                        className={`btn-level ${currentLevel === lvl ? 'active' : ''}`}
                        onClick={() => onChange(currentLevel === lvl ? 0 : lvl)}
                        title={`${name} Level ${lvl}`}
                    >
                        {lvl}
                    </button>
                ))}
            </div>
        </div>
    );
}
