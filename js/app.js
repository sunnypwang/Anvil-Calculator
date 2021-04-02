$(document).ready(function () {
    for (tool in applicable_enchant) {
        $(".type")
            .children()
            .append(`<option value="${tool}">${tool}</option>`);
    }
    $("#findCostBtn").click(setResult);
    $(".type").change(setEnchantList).trigger("change");
});

function setEnchantList() {
    tool = getToolName($(this));
    $(this).siblings(".enchant").html("");
    applicable_enchant[tool].forEach((enchant) => {
        $(this).siblings(".enchant").append(getEnchantNode(enchant));
    });
}

function getToolName(toolSelObject) {
    tool = toolSelObject.children("select").val();
    console.log(tool);
    return tool;
}

function getEnchantNode(enchant) {
    maxLevel = enchant_list[enchant]["max"];
    // console.log(maxLevel)
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
    enchantments = {};
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
    tool["type"] = $(`#${id} .type select`).val();
    tool["enchantments"] = getEnchantments($(`#${id} .enchant`));
    tool["prior_penalty"] = Number($(`#${id}_penalty`).val());
    console.log(tool);
    return tool;
}

function setResult() {
    const [total_cost, result_tool] = findCost();
    console.log(total_cost, result_tool);
    $("#total_cost").text("Cost : " + total_cost);

    tool_summary_text = "";
    for (enchant in result_tool.enchantments) {
        tool_summary_text +=
            enchant + " " + result_tool.enchantments[enchant] + "<br/>";
    }
    $("#result_tool").html(tool_summary_text);
}

function writeLog(msg) {
    $("#log").append(msg + "\n");
}

function resetLog() {
    $("#log").text(""); // reset textarea
}
