import React from 'react';

export default function ResultDisplay({ result, cost, logs }) {
    if (!result) return null;

    const resultEnchants = Object.entries(result.enchantments)
        .filter(([_, level]) => level > 0)
        .map(([name, level]) => ({ name, level }));

    const hasIssues = logs.some(log => log.toLowerCase().includes("incompatible"));

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
                    <span
                        className="cost-value"
                        style={{ color: hasIssues ? 'var(--accent-orange)' : 'var(--accent-success)' }}
                    >
                        {cost}
                    </span>
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

            <details open={hasIssues} className="debug-section">
                <summary className="cursor-pointer text-muted text-sm mb-2 hover:text-white">Debug Logs</summary>
                <div className="log-viewer">
                    {logs.map((log, index) => {
                        const isError = log.toLowerCase().includes("incompatible");
                        return (
                            <div
                                key={index}
                                style={{
                                    color: isError ? 'var(--accent-danger)' : 'inherit',
                                    marginBottom: '2px'
                                }}
                            >
                                {log}
                            </div>
                        );
                    })}
                </div>
            </details>
        </div>
    );
}
