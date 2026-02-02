import React from 'react';

export default function ResultDisplay({ result, cost, logs }) {
    if (!result) return null;

    const resultEnchants = Object.entries(result.enchantments)
        .filter(([_, level]) => level > 0)
        .map(([name, level]) => ({ name, level }));

    return (
        <div className="result-card">
            <div className="result-header">
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Repair & Enchant</h2>
                    <div className="text-muted text-sm">
                        Total Penalty: {result.prior_penalty}
                    </div>
                </div>

                <div className="cost-display">
                    <span className="cost-label">Experience Cost</span>
                    <span className="cost-value">{cost}</span>
                </div>
            </div>

            <div className="result-items">
                {resultEnchants.length > 0 ? (
                    resultEnchants.map(({ name, level }) => (
                        <div key={name} className="result-item-badge">
                            {name} {level}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-muted center">No resulting enchantments</div>
                )}
            </div>

            <details>
                <summary className="cursor-pointer text-muted text-sm mb-2 hover:text-white">Debug Logs</summary>
                <textarea
                    className="log-viewer"
                    readOnly
                    value={logs.join('\n')}
                    placeholder="Calculation logs..."
                />
            </details>
        </div>
    );
}
