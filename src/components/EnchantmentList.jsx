import React from 'react';
import { applicableEnchants } from '../data/tools';
import { enchantList } from '../data/enchantments';
import EnchantmentRow from './EnchantmentRow';
import EnchantmentSearch from './EnchantmentSearch';

export default function EnchantmentList({ toolType, enchantments, onEnchantChange }) {
    const isBook = toolType === 'Book';

    // For Book: Show only added enchants
    // For Others: Show all applicable enchants
    let displayList = [];

    if (isBook) {
        // Enchants explicitly added (have a level > 0, or just exist in the object?)
        // The App logic: `handleEnchantChange` sets level. If level 0, it deletes key.
        // So `Object.keys(enchantments)` is the list.
        displayList = Object.keys(enchantments);
    } else {
        displayList = applicableEnchants[toolType] || [];
    }

    const handleAddEnchant = (name) => {
        // Default to level 1 when added
        onEnchantChange(name, 1);
    };

    return (
        <div className="enchant-list">
            {isBook && (
                <EnchantmentSearch
                    existingEnchants={enchantments}
                    onAdd={handleAddEnchant}
                />
            )}

            {displayList.map((enchantName) => {
                const data = enchantList[enchantName];
                if (!data) return null;

                return (
                    <EnchantmentRow
                        key={enchantName}
                        name={enchantName}
                        maxLevel={data.max}
                        currentLevel={enchantments[enchantName] || 0}
                        onChange={(level) => onEnchantChange(enchantName, level)}
                    />
                );
            })}

            {isBook && displayList.length === 0 && (
                <div className="text-muted text-sm center" style={{ padding: '1rem' }}>
                    Search to add enchantments
                </div>
            )}
        </div>
    );
}
