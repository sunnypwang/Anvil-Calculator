import { applicableEnchants } from "../data/tools";
import { enchantList } from "../data/enchantments";
import { conflictGroup } from "../data/conflicts";

export function isApplicable(enchant, toolType) {
    if (toolType === "Book") return true; // Books can hold any enchant
    // Special case: toolType might not be in list (e.g. Shield?)
    const list = applicableEnchants[toolType];
    return list && list.includes(enchant);
}

export function getConflicts(enchant, currentEnchants) {
    const currentKeys = Object.keys(currentEnchants);
    return currentKeys.filter((e) => {
        if (e === enchant) return false;
        // Check if both are in a conflict group and share the same group ID
        if (
            conflictGroup[e] !== undefined &&
            conflictGroup[enchant] !== undefined &&
            conflictGroup[e] === conflictGroup[enchant]
        ) {
            return true;
        }
        return false;
    });
}

/**
 * Calculates the anvil cost.
 * @param {Object} target - { type, enchantments: { Name: Level }, prior_penalty }
 * @param {Object} sacrifice - { type, enchantments: { Name: Level }, prior_penalty }
 * @param {Boolean} isDamaged - Only true if target and sacrifice are same type and used for repair.
 * @returns {Object} { cost, result, logs, error }
 */
export function findCost(target, sacrifice, isDamaged = false) {
    const logs = [];
    let totalCost = 0;

    // Clone target to create result
    const result = {
        ...target,
        enchantments: { ...target.enchantments },
        prior_penalty: target.prior_penalty, // Will increase later
    };

    // Base repair cost (if repairing durability)
    if (isDamaged) {
        totalCost += 2;
        logs.push("Repair Cost: 2");
    }

    // Iterate over sacrifice enchantments
    for (const enchant in sacrifice.enchantments) {
        const sacrificeLevel = sacrifice.enchantments[enchant];

        // Check applicability
        // Note: If sacrifice is a Book, we check if enchant applies to Target Type.
        // If sacrifice is a Tool, it must match Target Type (usually handled by UI/game), 
        // but anvil allows combining two swords even if one has incompatible enchants? 
        // Actually, anvil only transfers compatible enchants.
        // If target is Book, it accepts everything.
        if (target.type !== "Book" && !isApplicable(enchant, target.type)) {
            logs.push(`${enchant} is not applicable to ${target.type}`);
            continue;
        }

        // Check conflicts
        const conflicts = getConflicts(enchant, result.enchantments); // Check against CURRENT result state
        // Note: Original logic checked against target.enchantments (initial state).
        // Standard behavior: Conflicts on target prevent sacrifice enchant transfer.
        // AND they add 1 level cost per conflict.

        if (conflicts.length > 0) {
            logs.push(`${enchant} is incompatible with ${conflicts.join(", ")}! Cost: +1`);
            totalCost += 1;
            continue;
        }

        // Logic for combining levels
        const targetLevel = result.enchantments[enchant] || 0;
        let finalLevel = targetLevel;

        if (targetLevel === sacrificeLevel) {
            finalLevel = Math.min(targetLevel + 1, enchantList[enchant].max);
        } else if (targetLevel < sacrificeLevel) {
            finalLevel = sacrificeLevel;
        } else {
            // targetLevel > sacrificeLevel -> keeps targetLevel
            finalLevel = targetLevel;
        }

        // Apply enchant to result
        result.enchantments[enchant] = finalLevel;

        // Calculate generic cost for this enchant transfer
        // "For Java Edition, add the final level of the enchantment on the resulting item multiplied by the multiplier."
        // Multiplier depends if sacrifice is Item or Book.
        let multiplier = enchantList[enchant].mul_item;
        if (sacrifice.type === "Book") {
            multiplier = enchantList[enchant].mul_book;
        }

        // Cost is based on FINAL level * multiplier
        const enchantCost = finalLevel * multiplier;
        totalCost += enchantCost;
        logs.push(`${enchant} ${finalLevel} x ${multiplier} = ${enchantCost}`);
    }

    // Calculate Penalty Cost
    // Cost = (2^TargetPenalty - 1) + (2^SacrificePenalty - 1)
    const targetPenaltyCost = Math.pow(2, target.prior_penalty) - 1;
    const sacrificePenaltyCost = Math.pow(2, sacrifice.prior_penalty) - 1;
    const penaltyCost = targetPenaltyCost + sacrificePenaltyCost;

    if (penaltyCost > 0) {
        totalCost += penaltyCost;
        logs.push(`Penalty Cost: ${targetPenaltyCost} + ${sacrificePenaltyCost} = ${penaltyCost}`);
    }

    // Calculate Result Prior Work Penalty
    // Result Penalty = Max(TargetPenalty, SacrificePenalty) + 1
    const newPenalty = Math.max(target.prior_penalty, sacrifice.prior_penalty) + 1;
    result.prior_penalty = newPenalty;

    // Anvil Limit (39 levels) - strictly speaking, the calculation is valid even if > 39,
    // but "Too Expensive" shows in game.
    // We return the cost regardless.

    return {
        cost: totalCost,
        result,
        logs
    };
}
