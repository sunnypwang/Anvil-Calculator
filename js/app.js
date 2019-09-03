$(document).ready(function() {
    $('.addEnchantBtn').click(addEnchant)
    $('.type').change(function() {
        console.log('B')
        $(this)
            .siblings('.enchant')
            .html('')
    })
    $('.findCost').click(findCost)
})

function addEnchant() {
    let tool_type = $(this)
        .siblings('.type')
        .children('select')
        .val()
    let total_enchant = $(this)
        .siblings('.enchant')
        .children().length
    // console.log(total_enchant)
    let enchantNode = $(
        `<div class=enchant_${total_enchant}><select class=enchant_name>
        <option disable>--Enchantment Name--</option>
        </select>
        <select class=enchant_lv>
        <option disable>--Level--</option>
        </select></div>`
    )

    $(this)
        .siblings('.enchant')
        .append(enchantNode)

    for (name of applicable_enchant[tool_type]) {
        $(this)
            .siblings('.enchant')
            .children(`.enchant_${total_enchant}`)
            .children('.enchant_name')
            .append($(`<option>${name}</option>`))
    }

    $(this)
        .siblings('.enchant')
        .children(`.enchant_${total_enchant}`)
        .children('.enchant_name')
        .change(function() {
            let name = $(this).val()
            var max_lv = enchant_list[name].max
            $(this)
                .siblings('.enchant_lv')
                .html('')
            for (let i = 1; i <= max_lv; i += 1) {
                $(this)
                    .siblings('.enchant_lv')
                    .append(`<option>${i}</option>`)
            }
        })
}

// function addTargetEnchant() {
//     let tool_type = $('#target > .type > select').val()
//     let total_enchant = $('#target > .enchant').length
//     let enchantNode = $(
//         `<div><select class=enchant_${total_enchant}>
//         <option disable>--Enchantment Name--</option>
//         </select><select class=enchant_${total_enchant}_lv><option disable>--Level--</select></div>`
//     )
//     $('#target > .enchant').append(chantNode)

//     for (name of applicable_enchant[tool_type]) {
//         $(`#target > .enchant > .enchant_${total_enchant}`).append(
//             $(`<option>${name}</option>`)
//         )
//     }

//     $(`#target > .enchant > .enchant_${total_enchant}`).change(function() {
//         let name = $(this).val()
//         var max_lv = enchant_list[name].max
//         $(`#target > .enchant > .enchant_${total_enchant}_lv`).html('')
//         for (let i = 1; i <= max_lv; i += 1) {
//             $(`#target > .enchant > .enchant_${total_enchant}_lv`).append(
//                 `<option>${i}</option>`
//             )
//         }
//     })
// }

function getTool(which) {
    tool = {
        type: $(`#${which} > .type > select`).val(),
        enchantments: {},
        prior_penalty: 0
    }

    for (i = 0; i < $(`#${which} > .enchant`).children().length; i += 1) {
        let enchant_name = $(
            `#${which} > .enchant > .enchant_${i} > .enchant_name`
        ).val()
        if (Object.keys(enchant_list).includes(enchant_name)) {
            let enchant_lv = $(
                `#${which} > .enchant > .enchant_${i} > .enchant_lv`
            ).val()
            tool['enchantments'][enchant_name] = enchant_lv
        }
    }
    return tool
}
