function isApplicable(enchant, type) {
    return applicable_enchant[type].includes(enchant);
}

function hasConflict(enchant, enchantments) {
    conflicts = enchantments.filter(
        (e) =>
            e != enchant &&
            e in conflict_group &&
            enchant in conflict_group &&
            conflict_group[e] == conflict_group[enchant]
    );
    return conflicts;
}

function findCost(target, sacrifice, isDamaged) {
    console.log('findCost')
    resetLog();
    total_cost = 0;

    // For each enchantment on the sacrifice:
    for (enchant in sacrifice.enchantments) {
        // Ignore any enchantment that cannot be applied to the target (e.g. Protection on a sword).
        if (!isApplicable(enchant, target.type)) {
            // console.log(enchant + ' not applicable')
            writeLog(`${enchant} not applicable`);
            continue;
        }

        // Add one level for every incompatible enchantment on the target (In Java Edition).
        conflicts = hasConflict(enchant, Object.keys(target.enchantments));
        console.log("conflicts", conflicts);

        if (conflicts && conflicts.length > 0) {
            writeLog(`${enchant} is incompatible with ${conflicts}! Cost: 1`);
            total_cost += 1;
        }

        //If the enchantment is compatible
        else {
            // If the target has the enchantment as well
            if (enchant in target.enchantments) {
                // writeLog(
                //     `${enchant} ${target.enchantments[enchant]} + ${sacrifice.enchantments[enchant]}`
                // );
                //If sacrifice level is equal, the target gains one level, unless it is already at the maximum level for that enchantment.
                if (
                    target.enchantments[enchant] ==
                    sacrifice.enchantments[enchant]
                ) {
                    target.enchantments[enchant] = Math.min(
                        target.enchantments[enchant] + 1,
                        enchant_list[enchant].max
                    );
                }
                //If sacrifice level is greater, the target is raised to the sacrifice's level
                else if (
                    target.enchantments[enchant] <
                    sacrifice.enchantments[enchant]
                ) {
                    target.enchantments[enchant] =
                        sacrifice.enchantments[enchant];
                }
            }
            //If the target does not have the enchantment, it gains all levels of that enchantment
            else {
                target.enchantments[enchant] = sacrifice.enchantments[enchant];
            }

            // For Java Edition, add the final level of the enchantment on the resulting item multiplied by the multiplier from the table below.
            multiplier = enchant_list[enchant].mul_item;
            if (sacrifice.type == "Book") {
                multiplier = enchant_list[enchant].mul_book;
            }
            cost = multiplier * target.enchantments[enchant];
            total_cost += cost;
            writeLog(
                `${enchant}: ${target.enchantments[enchant]} x ${multiplier} = ${cost}`
            );
        }
    }

    //Calculate Penalty cost
    target_penalty_cost = Math.pow(2, target.prior_penalty) - 1;
    sacrifice_penalty_cost = Math.pow(2, sacrifice.prior_penalty) - 1;
    penalty_cost = target_penalty_cost + sacrifice_penalty_cost;
    total_cost += penalty_cost;
    // new_penalty = Math.max(target_penalty, sacrifice_penalty);
    // target.prior_penalty = new_penalty + 1;
    writeLog(
        `Penalty Cost: ${target_penalty_cost} + ${sacrifice_penalty_cost} = ${penalty_cost}`
    );

    //Calculate Repair cost
    if (isDamaged) {
        console.log('is damaged')
        //Is it repairable
        total_cost += 2;
        writeLog("Repair Cost: 2");
    }

    writeLog(`Final Cost: ${total_cost}`);

    return [total_cost, target];
}
