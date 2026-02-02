import React, { useState, useEffect } from 'react';
import './App.css';
import ToolSelect from './components/ToolSelect';
import EnchantmentList from './components/EnchantmentList';
import ResultDisplay from './components/ResultDisplay';
import { findCost } from './utils/calculator';
import { applicableEnchants } from './data/tools';

const DEFAULT_TOOL = 'Sword';

const initialToolState = {
  type: DEFAULT_TOOL,
  prior_penalty: 0,
  enchantments: {},
};

function App() {
  const [target, setTarget] = useState({ ...initialToolState });
  const [sacrifice, setSacrifice] = useState({ ...initialToolState });

  const [isSync, setIsSync] = useState(true);
  const [isDamaged, setIsDamaged] = useState(false);

  const [result, setResult] = useState(null);

  // Sync Logic: When Sync is ON, if Target changes, update Sacrifice to match Type.
  // Actually, original app synced TYPE and ENCHANTS? 
  // "Sync" label usually implies keeping them identical or just keeping type identical?
  // Original code: `if ($("#syncTool").is(":checked")){ ... $(otherId).val(tool); ... }`
  // It synced Type, Enchants, Penalty?
  // Let's keep it simple: Synced Type makes sense.
  // We'll implement a helper to update.

  const handleToolChange = (side, newType) => {
    if (side === 'target') {
      const newTarget = { ...target, type: newType, enchantments: {} }; // Reset enchants on type change for safety
      setTarget(newTarget);
      if (isSync) {
        setSacrifice({ ...sacrifice, type: newType, enchantments: {} });
      }
    } else {
      setSacrifice({ ...sacrifice, type: newType, enchantments: {} });
      if (isSync) {
        setTarget({ ...target, type: newType, enchantments: {} });
      }
    }
  };

  const handlePenaltyChange = (side, newVal) => {
    if (side === 'target') setTarget({ ...target, prior_penalty: newVal });
    else setSacrifice({ ...sacrifice, prior_penalty: newVal });
  };

  const handleEnchantChange = (side, name, level) => {
    const update = (prev) => {
      const newEnchants = { ...prev.enchantments };
      if (level === 0) delete newEnchants[name];
      else newEnchants[name] = level;
      return { ...prev, enchantments: newEnchants };
    };

    if (side === 'target') {
      const newTarget = update(target);
      setTarget(newTarget);
      // Removed sync for enchantments as requested
    } else {
      const newSacrifice = update(sacrifice);
      setSacrifice(newSacrifice);
      // Removed sync for enchantments as requested
    }
  };

  const handleSwap = () => {
    const temp = { ...target };
    setTarget({ ...sacrifice });
    setSacrifice(temp);
  };

  // Calculation Effect
  useEffect(() => {
    // If sync is on, logic.js didn't force them to be identical, it just auto-updated UI.
    // Calculate cost
    const res = findCost(target, sacrifice, isDamaged && target.type === sacrifice.type);
    setResult(res);
  }, [target, sacrifice, isDamaged]);

  // Scroll Sync Logic
  const targetPanelRef = React.useRef(null);
  const sacrificePanelRef = React.useRef(null);
  const isSyncingScroll = React.useRef(false);

  const handleScroll = (e, source) => {
    if (isSyncingScroll.current) return;
    // Only sync if tools are the same type
    if (target.type !== sacrifice.type) return;

    const sourceEl = e.target;
    const targetEl = source === 'target' ? sacrificePanelRef.current : targetPanelRef.current;

    if (targetEl) {
      isSyncingScroll.current = true;
      targetEl.scrollTop = sourceEl.scrollTop;
      // Small timeout to reset the flag to prevent loop
      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 50);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Anvil Calculator</h1>
        <p className="app-subtitle">Optimize your enchantment combinations</p>
      </header>

      <div className="calculator-grid">
        {/* Target Section */}
        <div
          className="panel"
          ref={targetPanelRef}
          onScroll={(e) => handleScroll(e, 'target')}
        >
          <div className="panel-header">
            <span>Target Item</span>
            {target.type !== 'Book' && (
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDamaged}
                  onChange={(e) => setIsDamaged(e.target.checked)}
                />
                Damaged?
              </label>
            )}
          </div>

          <ToolSelect
            side="target"
            tool={target}
            onToolChange={(t) => handleToolChange('target', t)}
            onPenaltyChange={(p) => handlePenaltyChange('target', p)}
          />
          <EnchantmentList
            toolType={target.type}
            enchantments={target.enchantments}
            onEnchantChange={(n, l) => handleEnchantChange('target', n, l)}
          />
        </div>

        {/* Center Controls & Result */}
        <div className="controls-center">
          <div className="action-bar flex-col w-full">
            <button
              className="btn-primary w-full"
              onClick={handleSwap}
              title="Swap Items"
            >
              ⇋ Swap Items
            </button>

            <label className="btn-secondary flex items-center justify-between gap-2 cursor-pointer w-full" title="Automatically updates the other tool type to match when you change one.">
              <span>Auto-Match Tool Type</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isSync}
                  onChange={(e) => setIsSync(e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>

          <ResultDisplay result={result?.result} cost={result?.cost} logs={result?.logs || []} />
        </div>

        {/* Sacrifice Section */}
        <div
          className="panel"
          ref={sacrificePanelRef}
          onScroll={(e) => handleScroll(e, 'sacrifice')}
        >
          <div className="panel-header">
            <span>Sacrifice Item</span>
          </div>
          <ToolSelect
            side="sacrifice"
            tool={sacrifice}
            onToolChange={(t) => handleToolChange('sacrifice', t)}
            onPenaltyChange={(p) => handlePenaltyChange('sacrifice', p)}
          />
          <EnchantmentList
            toolType={sacrifice.type}
            enchantments={sacrifice.enchantments}
            onEnchantChange={(n, l) => handleEnchantChange('sacrifice', n, l)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
