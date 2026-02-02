import React from 'react';
import { applicableEnchants } from '../data/tools';
import { enchantList } from '../data/enchantments';
import EnchantmentRow from './EnchantmentRow';

export default function EnchantmentList({ toolType, enchantments, onEnchantChange }) {
    // Get applicable enchants for the tool type
    // Default to empty array if not found
    const enchants = applicableEnchants[toolType] || [];

    return (
        <div className="enchant-list">
            {enchants.map((enchantName) => {
                const data = enchantList[enchantName];
                if (!data) return null; // Should not happen if data is consistent

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
        </div>
    );
}
