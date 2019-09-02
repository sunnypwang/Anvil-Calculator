var enchant_list = require('./enchant_list.json')
var applicable_enchant = require('./applicable.json')
var names = Object.keys(enchant_list)

target = {
    type: 'Sword',
    enchantments: {
        // Sharpness: 3,
        // Knockback: 2,
        Looting: 2
    },
    prior_penalty: 0,
    durability: 255
}

sacrifice = {
    type: 'Book',
    enchantments: {
        Protection: 3,
        Sharpness: 1,
        Looting: 2
    },
    prior_penalty: 0,
    durability: 255
}

conflict = [
    [
        'Protection',
        'Fire Protection',
        'Blast Protection',
        'Projectile Protection'
    ],
    ['Sharpness', 'Bane of Arthropods', 'Smite'],
    ['Silk Touch', 'Fortune'],
    ['Depth Strider', 'Frost Walker'],
    ['Infinity', 'Mending'],
    ['Loyalty', 'Riptide'],
    ['Channeling', 'Riptide'],
    ['Multishot', 'Piercing']
]

// function isAlsoInTarget(element, index, array) {
//     // console.log(element + ' is already in target')
//     return Object.keys(target.enchantments).includes(element)
// }

function isConflictWithTarget(name) {
    var isConflict = false
    for (conflict_group of conflict) {
        // console.log(
        //     name,
        //     conflict_group,
        //     conflict_group.includes(name)
        // )
        if (conflict_group.includes(name)) {
            for (other_name of conflict_group) {
                if (
                    other_name != name &&
                    Object.keys(target.enchantments).includes(other_name)
                ) {
                    isConflict = true
                }
            }
        }
    }
    return isConflict
}

total_cost = 0

// For each enchantment on the sacrifice:
for (name in sacrifice.enchantments) {
    // Ignore any enchantment that cannot be applied to the target (e.g. Protection on a sword).
    if (!applicable_enchant[target.type].includes(name)) {
        console.log(name + ' not applicable')
        continue
    }

    // Add one level for every incompatible enchantment on the target (In Java Edition).
    if (isConflictWithTarget(name)) {
        console.log(name + ' has conflict. Cost: 1')
        total_cost += 1
    }

    //If the enchantment is compatible
    else {
        // If the target has the enchantment as well
        if (name in target.enchantments) {
            console.log(
                'Combining ' +
                    name +
                    ' ' +
                    target.enchantments[name] +
                    ' and ' +
                    name +
                    ' ' +
                    sacrifice.enchantments[name] +
                    '...'
            )
            //If sacrifice level is equal, the target gains one level, unless it is already at the maximum level for that enchantment.
            if (target.enchantments[name] == sacrifice.enchantments[name]) {
                target.enchantments[name] = Math.min(
                    target.enchantments[name] + 1,
                    enchant_list[name].max
                )
            }
            //If sacrifice level is greater, the target is raised to the sacrifice's level
            else if (target.enchantments[name] < sacrifice.enchantments[name]) {
                target.enchantments[name] = sacrifice.enchantments[name]
            }
        }

        //If the target does not have the enchantment, it gains all levels of that enchantment
        else {
            target.enchantments[name] = sacrifice.enchantments[name]
        }

        // For Java Edition, add the final level of the enchantment on the resulting item multiplied by the multiplier from the table below.
        multiplier = enchant_list[name].mul_item
        if (sacrifice.type == 'Book') {
            multiplier = enchant_list[name].mul_book
        }
        cost = multiplier * target.enchantments[name]
        total_cost += cost
        console.log(
            'Enchant Name: ' +
                name +
                ' ' +
                target.enchantments[name] +
                '. Cost: ' +
                cost
        )
    }

    console.log('Total cost: ' + total_cost)
}

console.log('Final Cost')
console.log(total_cost)
console.log(target)
