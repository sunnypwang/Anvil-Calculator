$(document).ready(function() {
    $('.addEnchantBtn').click(addEnchant)
    $('.type').change(function() {
        console.log('B')
        $(this)
            .siblings('.enchant')
            .html('')
    })
    $('.findCost').click(setFinalCost)
})

function addEnchant() {
    let tool_type = $(this)
        .parent()
        .siblings('.type')
        .children('select')
        .val()
    let total_enchant = $(this)
        .parent()
        .siblings('.enchant')
        .children().length
    // console.log(total_enchant)
    let enchantSelectNode = $(
        `<div class="enchant_${total_enchant}"><select class="enchant_name">
        
        </select>
        <select class="enchant_lv">
        
        </select>
        <button class="enchant_remove removeEnchantBtn">X</button></div>`
    )

    // Add enchant select node
    $(this)
        .parent()
        .siblings('.enchant')
        .append(enchantSelectNode)

    let selectedNames = []
    for (i = 0; i < total_enchant; i += 1) {
        selectedNames.push(
            $(this)
                .parent()
                .siblings('.enchant')
                .children(`.enchant_${i}`)
                .children('.enchant_name')
                .val()
        )
    }
    console.log(selectedNames)

    // Add applicable enchantment list
    for (name of applicable_enchant[tool_type]) {
        $(this)
            .parent()
            .siblings('.enchant')
            .children(`.enchant_${total_enchant}`)
            .children('.enchant_name')
            .append($(`<option>${name}</option>`))
    }

    function getLevelOption(name) {
        var max_lv = enchant_list[name].max

        let optionHtml = ''
        for (let i = 1; i <= max_lv; i += 1) {
            optionHtml += `<option>${i}</option>`
        }
        return optionHtml
    }

    // Add applicable enchantment level (First time only)
    let first_name = $(this)
        .parent()
        .siblings('.enchant')
        .children(`.enchant_${total_enchant}`)
        .children('.enchant_name')
        .val()
    $(this)
        .parent()
        .siblings('.enchant')
        .children(`.enchant_${total_enchant}`)
        .children('.enchant_lv')
        .html(getLevelOption(first_name))

    // Update applicable enchantment level everytime enchantment name is changed
    $(this)
        .parent()
        .siblings('.enchant')
        .children(`.enchant_${total_enchant}`)
        .children('.enchant_name')
        .change(function() {
            let name = $(this).val()
            $(this)
                .siblings('.enchant_lv')
                .html(getLevelOption(name))
        })

    //Create event for remove button
    $('.removeEnchantBtn').click(removeEnchant)
}

function removeEnchant() {
    $(this)
        .parent()
        .remove()
}

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
            tool['enchantments'][enchant_name] = Number(enchant_lv)
        }
    }
    return tool
}

function setFinalCost() {
    const [total_cost, result_tool] = findCost()
    console.log(total_cost, result_tool)
    $('#total_cost').text('Cost : ' + total_cost)

    let tool_summary_text = ''
    for (enchant in result_tool.enchantments) {
        tool_summary_text +=
            enchant + ' ' + result_tool.enchantments[enchant] + '<br/>'
    }
    $('#result_tool').html(tool_summary_text)
}
