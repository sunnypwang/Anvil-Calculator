$(document).ready(function () {
    for (tool in applicable_enchant) {
        $("#targetType").append(`<option value="${tool}">${tool}</option>`);
        $("#sacrificeType").append(`<option value="${tool}">${tool}</option>`);
    }
    $("#findCostBtn").click(setResult);
    $("#targetType").change(() => {selectEnchant('target')}).trigger("change");
    $("#sacrificeType").change(() => {selectEnchant('sacrifice')}).trigger("change");
    $('#target-damaged').change(setResult); //For auto update
    $('#swapTool').change(setResult); //For auto update
});

function updateEnchantList(enchantListObj, tool){
    enchantListObj.html("");
    applicable_enchant[tool].forEach((enchant) => {
        enchantListObj.append(getEnchantNode(enchant));
    });
}

function selectEnchant(side) {
    console.log('test')
    var id = `#${side}Type`
    var enchantId = `#${side}Enchant`
    var iconId = `#${side}Icon`
    var tool = $(id).val();
    console.log(side, id, enchantId)
    $(id).val(tool);
    updateEnchantList($(enchantId), tool);
    setIcon(iconId, tool);

    if ($("#syncTool").is(":checked")){
        var otherSide = (side == 'target') ? 'sacrifice' : 'target';
        var otherId = `#${otherSide}Type`
        var otherEnchantId = `#${otherSide}Enchant`
        var otherIconId = `#${otherSide}Icon`
        $(otherId).val(tool);
        updateEnchantList($(otherEnchantId), tool);
        setIcon(otherIconId, tool);
    }

    //For auto update
    $('button').click(setResult); 
    setResult();
}

// function getToolName(toolSelObject) {
//     tool = toolSelObject.children("select").val();
//     // console.log(tool);
//     return tool;
// }

function getEnchantNode(enchant) {
    maxLevel = enchant_list[enchant]["max"];
    //  .log(maxLevel)
    levelButtonNode = ``;
    for (let index = 1; index <= maxLevel; index++) {
        levelButtonNode += `<button onclick=updateEnchantBtn(this) class="enchant_lv_button">${index}</button>`;
    }
    // console.log(levelButtonNode)
    node = $(`<div class="row">
    <div class="column-6 enchant_name">${enchant}</div>
    <div class="column-4 enchant_lv">
    ${levelButtonNode}
    </div>
    </div>`);
    return node;
}

function updateEnchantBtn(button) {
    if ($(button).hasClass("clicked")) {
        $(button).removeClass("clicked");
    } else {
        $(button).addClass("clicked");
    }
    $(button).siblings().removeClass("clicked");
}

function getEnchantments(tool) {
    var enchantments = {};
    tool.children().each(function () {
        enchant = $(this).children(".enchant_name").text();
        level =
            Number(
                $(this).children(".enchant_lv").find("button.clicked").text()
            ) || 0;
        if (level > 0) enchantments[enchant] = level;
    });
    // console.log(enchants)
    return enchantments;
}

function getTool(id) {
    tool = {};
    tool["type"] = $(`#${id}Type`).val();
    tool["enchantments"] = getEnchantments($(`#${id}Enchant`));
    tool["prior_penalty"] = Number($(`#${id}_penalty`).val());
    console.log(tool);
    return tool;
}

function setResult() {
    var target = getTool("target");
    var sacrifice = getTool("sacrifice");

    if ($("#swapTool").is(":checked")) {
        var target = getTool("sacrifice");
        var sacrifice = getTool("target");
    }
    var isDamaged = $("#target-damaged").is(":checked") && target.type == sacrifice.type
    // console.log(isDamaged)
    const [total_cost, result_tool] = findCost(target, sacrifice, isDamaged);
    // console.log(total_cost, result_tool);
    $("#total_cost").text("Cost : " + total_cost);

    tool_summary_text = "";
    for (enchant in result_tool.enchantments) {
        tool_summary_text +=
            enchant + " " + result_tool.enchantments[enchant] + "<br/>";
    }
    $("#result_tool").html(tool_summary_text);
}

function setIcon(iconId, toolName){
    // console.log(toolName);
    var url = `./css/res/${toolName}.png`
    $(iconId).attr('src',url);
    $(iconId).click((evt) => {
        evt.stopImmediatePropagation();
        console.log('hi',iconId)
        // $('#targetType').trigger('selected')
    });
}

function writeLog(msg) {
    $("#log").append(msg + "\n");
}

function resetLog() {
    $("#log").text(""); // reset textarea
}