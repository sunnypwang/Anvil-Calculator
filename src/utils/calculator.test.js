import { describe, it, expect } from 'vitest';
import { findCost } from './calculator';

describe('Anvil Calculator', () => {
    it('should combine two same level enchantments to next level', () => {
        const target = { type: 'Sword', enchantments: { 'Sharpness': 4 }, prior_penalty: 0 };
        const sacrifice = { type: 'Sword', enchantments: { 'Sharpness': 4 }, prior_penalty: 0 };

        const result = findCost(target, sacrifice);
        // Cost: 5 (Level) * 1 (Item Mult) = 5.
        // Penalty: 0.
        // Total: 5.
        expect(result.result.enchantments['Sharpness']).toBe(5);
        expect(result.cost).toBe(5);
    });

    it('should combine different levels correctly', () => {
        const target = { type: 'Sword', enchantments: { 'Sharpness': 3 }, prior_penalty: 0 };
        const sacrifice = { type: 'Sword', enchantments: { 'Sharpness': 4 }, prior_penalty: 0 };

        const result = findCost(target, sacrifice);
        // Cost: 4 (Final Level) * 1 = 4.
        expect(result.result.enchantments['Sharpness']).toBe(4);
        expect(result.cost).toBe(4);
    });

    it('should add new compatible enchantment', () => {
        const target = { type: 'Pickaxe', enchantments: { 'Efficiency': 4 }, prior_penalty: 0 };
        const sacrifice = { type: 'Book', enchantments: { 'Mending': 1 }, prior_penalty: 0 };

        const result = findCost(target, sacrifice);
        // Cost: 1 (Level) * 2 (Book Mult for Mending) = 2.
        expect(result.result.enchantments['Efficiency']).toBe(4);
        expect(result.result.enchantments['Mending']).toBe(1);
        expect(result.cost).toBe(2);
    });

    it('should handle conflicts (Protection vs Blast Protection)', () => {
        const target = { type: 'Helmet', enchantments: { 'Protection': 3 }, prior_penalty: 0 };
        const sacrifice = { type: 'Book', enchantments: { 'Blast Protection': 3 }, prior_penalty: 0 };

        const result = findCost(target, sacrifice);
        // Conflict cost: 1.
        expect(result.result.enchantments['Protection']).toBe(3);
        expect(result.result.enchantments['Blast Protection']).toBeUndefined();
        expect(result.cost).toBe(1);
    });

    it('should handle Mace specific enchantments', () => {
        const target = { type: 'Mace', enchantments: {}, prior_penalty: 0 };
        const sacrifice = { type: 'Book', enchantments: { 'Density': 5 }, prior_penalty: 0 };

        const result = findCost(target, sacrifice);
        // Density Max 5. Book Mult: 1.
        // Cost: 5 * 1 = 5.
        expect(result.result.enchantments['Density']).toBe(5);
        expect(result.cost).toBe(5);
    });

    it('should calculate Prior Work Penalty correctly', () => {
        const target = { type: 'Sword', enchantments: {}, prior_penalty: 2 }; // Used twice (cost 3)
        const sacrifice = { type: 'Sword', enchantments: {}, prior_penalty: 3 }; // Used thrice (cost 7)

        const result = findCost(target, sacrifice);
        // Penalty Cost: (2^2 - 1) + (2^3 - 1) = 3 + 7 = 10.
        expect(result.cost).toBe(10);
        // New Penalty: Max(2, 3) + 1 = 4.
        expect(result.result.prior_penalty).toBe(4);
    });

    it('should apply repair cost if damaged', () => {
        const target = { type: 'Sword', enchantments: {}, prior_penalty: 0 };
        const sacrifice = { type: 'Sword', enchantments: {}, prior_penalty: 0 };

        const result = findCost(target, sacrifice, true); // isDamaged = true
        // Repair cost: 2.
        // Penalty: 0.
        expect(result.cost).toBe(2);
    });
});
