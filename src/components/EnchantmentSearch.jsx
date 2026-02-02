import React, { useState, useEffect, useRef } from 'react';
import { applicableEnchants } from '../data/tools';

export default function EnchantmentSearch({ existingEnchants, onAdd }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Get all Book enchants
    const allBookEnchants = applicableEnchants['Book'] || [];

    // Filter suggestions
    const suggestions = allBookEnchants.filter(name => {
        // Exclude if already added
        if (existingEnchants[name]) return false;
        // Match query (case insensitive)
        return name.toLowerCase().includes(query.toLowerCase());
    });

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (name) => {
        onAdd(name);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className="enchant-search-wrapper" ref={wrapperRef}>
            <input
                type="text"
                className="enchant-search-input"
                placeholder="Search enchantments..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
            />

            {isOpen && query && suggestions.length > 0 && (
                <ul className="enchant-search-dropdown">
                    {suggestions.map((name) => (
                        <li
                            key={name}
                            className="enchant-search-item"
                            onClick={() => handleSelect(name)}
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
