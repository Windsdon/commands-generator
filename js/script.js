// Minecraft Command Generator by Windsdon
function itemTagCheck(mcitem) {
    if (!mcitem.tag) {
        mcitem.tag = new Object();
    }
}

function itemEnchant(mcitem, id, lvl) {
    itemTagCheck(mcitem);
    if (!mcitem.tag.ench) {
        mcitem.tag.ench = new Array();
    }

    mcitem.tag.ench[mcitem.tag.ench.length] = {
        id: id,
        lvl: lvl
    };
};

function makeModifier(name, amount, operation) {
    this.Name = name;
    this.Amount = amout;
    this.Operation = operation;
}

function itemAddModifier(mcitem, attributeName, name, amount, operation) {
    itemTagCheck(mcitem);
    if (!mcitem.tag.AttributeModifiers) {
        mcitem.tag.AttributeModifiers = new Array();
    }

    modifier = new makeModifier(name, amount, operation);
    modifier.AttributeName = attributeName;

    mcitem.tag.AttributeModifiers[mcitem.tag.AttributeModifiers.length] = modifier;
}

function itemSetName(mcitem, name) {
    itemTagCheck(mcitem);
    if (!mcitem.tag.display) {
        mcitem.tag.display = new Object();
    }

    mcitem.tag.display.Name = name;
}

function itemAddLoreLine(mcitem, lore) {
    itemTagCheck(mcitem);
    if (!mcitem.tag.display) {
        mcitem.tag.display = new Object();
    }

    if (!mcitem.tag.display.Lore) {
        mcitem.tag.display.Lore = new Array();
    }

    mcitem.tag.display.Lore[mcitem.tag.display.Lore.length] = lore;
}

function makePotionEffect(id, amplifier, duration, ambient) {
    this.Id = id;
    this.Amplifier = amplifier;
    this.Duration = duration;
    if (!!ambient) {
        this.Ambient = ambient;
    }
}

function itemAddCustomPotionEffect(mcitem, id, amplifier, duration, ambient) {
    itemTagCheck(mcitem);
    if (!mcitem.tag.CustomPotionEffects) {
        mcitem.tag.CustomPotionEffects = new Array();
    }

    mcitem.tag.CustomPotionEffects[mcitem.tag.CustomPotionEffects.length] = new makePotionEffect(id, amplifier, duration, ambient);
}

function itemSetSkullOwner(mcitem, owner) {
    itemTagCheck(mcitem);
    mcitem.tag.SkullOwner = owner;
}

function Item(id, damage, count, slot) {
    this.id = id;
    this.Damage = damage;
    this.Count = count;
    if (!!slot || slot === 0) {
        this.Slot = slot;
    }

    return this;
}

var MCItem = {
    Item: function (id, damage, count, slot) {
        if (typeof id === "number") {
            //normal constructor
            this.id = id;
            this.Damage = damage;
            this.Count = count;
            if (!!slot || slot === 0) {
                this.Slot = slot;
            }
        } else {
            //copy constructor
            //weird notation because of id :/
            this.id = id.id;
            this.damage = id.damage;
            this.Count = id.Count;
            if (!!id.slot || id.slot === 0) {
                this.Slot = id.slot;
            }
        }
    }
}

var ItemRegister = {
    items: [],
    customItems: [],
    currentUID: 0,

    create: function (name, id, data, friendlyName, texture) {
        this.items.push(new this.Item(name, id, data, friendlyName, texture));
    },

    Item: function (name, id, metaData, friendlyName, texture, mcItem) {
        this.name = name; //eg minecraft:stone
        this.id = id; //eg 1
        this.friendlyName = friendlyName; //eg Stone
        this.metaData = metaData; //eg 0
        this.texture = texture; //eg stone
        this.UID = ItemRegister.currentUID++;
        if (mcItem === undefined) {
            this.mcItem = new MCItem.Item(id, metaData, 1);
        } else {
            this.mcItem = mcItem;
        }
    },

    ItemByCopy: function (item) {
        return new ItemRegister.Item(item.name, item.id, item.metaData, item.friendlyName, item.texture, new MCItem.Item(item.mcItem));
    },

    add: function (item) {
        this.customItems.push(item);
    },

    getHighestUID: function (itemList) {
        highest = 0;
        for (k in itemList) {
            highest = (highest < itemList[k] ? itemList[k] : highest);
        }
        return highest;
    },

    getById: function (id) {
        for (k in ItemRegister.items) {
            if (ItemRegister.items[k].id == id) {
                return ItemRegister.items[k];
            }
        }

        return ItemRegister.UnknownItem;
    },

    init: function () {
        this.create("minecraft:stone", 1, 0, "Stone", "stone");
        this.create("minecraft:grass", 2, 0, "Grass", "grass_side");
        this.create("minecraft:dirt", 3, 0, "Dirt", "dirt");
        this.create("minecraft:cobblestone", 4, 0, "Cobblestone", "cobblestone");
        this.create("minecraft:planks", 5, 0, "Oak Wood Plank", "planks_oak");
        this.create("minecraft:planks", 5, 1, "Spruce Wood Plank", "planks_spruce");
        this.create("minecraft:planks", 5, 2, "Birch Wood Plank", "planks_birch");
        this.create("minecraft:planks", 5, 3, "Jungle Wood Plank", "planks_jungle");
        this.create("minecraft:planks", 5, 4, "Acacia Wood Plank", "planks_acacia");
        this.create("minecraft:planks", 5, 5, "Dark Oak Wood Plank", "planks_big_oak");
        this.create("minecraft:sapling", 6, 0, "Oak Sapling", "sapling_oak");
        this.create("minecraft:sapling", 6, 1, "Spruce Sapling", "sapling_spruce");
        this.create("minecraft:sapling", 6, 2, "Birch Sapling", "sapling_birch");
        this.create("minecraft:sapling", 5, 3, "Jungle Sapling", "sapling_jungle");
        this.create("minecraft:sapling", 6, 4, "Acacia Sapling", "sapling_acacia");
        this.create("minecraft:sapling", 6, 5, "Dark Oak Sapling", "sapling_roofed_oak");

        this.UnknownItem = new this.Item("Unknown Item", -1, 0, "unknown");
    },

    getAllItems: function () {
        return this.items.concat(this.customItems);
    },

    makeItemContainer: function (itemList, multipleSelection) {
        this.holder = $("<div/>", {
            "class": "itemDialogContainer"
        });

        this.searchBarTyped = function (event) {
            owner = $(this).data("owner");
            itemList = owner.itemList;
            search = $(this).val();
            reg = new RegExp(search, "gi");

            for (k in itemList) {
                item = itemList[k];
                itemObj = item.data("item");
                if (itemObj.friendlyName.match(reg)) {
                    item.removeClass("hidden");
                } else {
                    if (!item.hasClass("hidden")) {
                        item.addClass("hidden");
                    }
                }
            }
        };

        this.searchBar = $("<input>", {
            "class": "dialogInput itemListSearch ui-widget-content ui-corner-all",
            id: "itemListSearch"
        }).keyup(this.searchBarTyped).data("owner", this);

        this.itemsContainer = $("<div/>", {
            "class": "itemListIconsContainer"
        });

        this.multipleSelection = multipleSelection;

        this.itemSelectedCheck = function () {
            owner = $(this).data("owner");
            owner.itemSelected(this);
        };

        this.itemSelected = function (obj) {
            if (!this.multipleSelection) {
                this.itemsContainer.children(".item").each(function () {
                    if ($(this).data("item").UID != $(obj).data("item").UID) {
                        $(this).removeClass("selected");
                    }
                });
            }

            $(obj).toggleClass("selected");
        }

        this.itemList = new Array();
        for (k in itemList) {
            newItem = $("<div/>", {
                "class": "item"
            }).click(this.itemSelectedCheck).css("background-image", "url(images/icons/" + itemList[k].texture + ".png)")
                .disableSelection()
                .data("owner", this)
                .data("item", itemList[k])
                .tooltip({
                    content: itemList[k].friendlyName,
                    items: ".item",
                    track: true,
                    show: false,
                    hide: false
                });
            this.itemsContainer.append(newItem);
            this.itemList.push(newItem);
        }

        this.getSelectedItems = function () {
            itemList = new Array();
            this.itemsContainer.children(".item.selected").each(function () {
                itemList.push($(this).data("item"));
            });
            return itemList;
        };

        this.holder.append(this.searchBar).append(this.itemsContainer).disableSelection();
    }
};

var Enchantments = {
    list: [],

    enchantment: function (id, name) {
        this.id = id;
        this.name = name;
        Enchantments.list.push(this);
    },

    init: function () {
        this.protection = new Enchantments.enchantment(0, "Protection");
        this.fireProtection = new Enchantments.enchantment(1, "Fire protection");
        this.featherFalling = new Enchantments.enchantment(2, "Feather falling");
    },

    getById: function (id) {
        for (k in Enchantments.list) {
            if (Enchantments.list[k].id == k) {
                return Enchantments.list[k];
            }
        }
        return -1;
    },

    makeEnchantment: function (id, lvl) {
        return {
            id: id,
            lvl: lvl
        }
    },

    makeList: function (enchList, labelText, fieldId, fieldClass) {
        valList = new Array();
        i = 0;
        for (k in enchList) {
            valList[i++] = {
                name: enchList[k].name + " (" + enchList[k].id + ")",
                value: enchList[k].id
            };
        }

        holder = $("<div/>");
        holder.append($("<label/>", {
            "for": fieldId,
            text: labelText,
        })).append(makeSelect(valList, fieldId, fieldClass));

        return holder;
    }

}

var ItemEditor = {
    propertyList: [
        {
            name: "Custom Name",
            evaluates: ["tag", "display", "Name"],
            affects: "all",
            optional: true,
            generator: false
        },
        {
            affects: "all",
            generator: "ItemEditor.BaseItemSelector",
            optional: false
        }
    ],

    BaseItemSelector: function (selected, options) {
        this.holder = $("<div/>", {
            "class": "dialogItemSelector",
            "title": "Click to change"
        }).data("owner", this);
        this.options = options;
        this.selected = selected;

        this.itemSelected = function (object) {
            this.selected = object.getSelectedItems()[0];

            ItemEditor.setItemIcon(this.itemIcon, this.selected)
            ItemEditor.setItemDefaultName(this.itemName, this.selected);
        };

        this.itemIcon = ItemEditor.makeItemIcon(selected);
        this.itemName = ItemEditor.makeItemDefaultName(selected);
        this.holder.append(this.itemIcon)
            .append(this.itemName);

        this.holder.click(function () {
            $(this).data("selector", showItemSelectDialog($(this).data("owner").options, false, $(this).data("owner"), "itemSelected"));
        }).tooltip({
                track: true,
                show: false,
                hide: false
            });

        this.holder.disableSelection();
    },

    setItemIcon: function (object, item) {
        object.css("background-image", "url(images/icons/" + item.texture + ".png)")
    },

    setItemDefaultName: function (object, item) {
        object.text(item.friendlyName);
    },

    makeItemIcon: function (item) {
        elem = $("<div/>", {
            "class": "item"
        });
        ItemEditor.setItemIcon(elem, item);
        return elem;
    },

    makeItemDefaultName: function (item) {
        elem = $("<div/>", {
            "class": "itemName"
        });
        ItemEditor.setItemDefaultName(elem, item)
        return elem;
    },

    makeLine: function (label, id, object, source) {
        return $("<div/>", {

        })
    },

    create: function (item) {
        this.holder = $("<div/>", {
            "class": "itemEditorDialogContainer"
        }).data("owner", this);

        this.nameInput = ItemEditor.makeLine("Custom name", "customName");
        this.baseItemSelector = new ItemEditor.BaseItemSelector(item, ItemRegister.getAllItems());

        this.holder.append(this.baseItemSelector.holder)
            .append(this.nameInput)
            .disableSelection();
    }
}

function ItemDialog(itemObject, callback) {
    this.itemProp = itemObject;
    this.container = $("<div/>", {
        title: "Edit item"
    }).data("owner", this);

    this.container.append((new ItemEditor.create(itemObject)).holder);

    this.saveItem = function () {
        alert("saved");
        $(this).dialog("close");
    };

    this.container.dialog({
        modal: false,
        minWidth: 840,
        minHeight: 400,
        height: 400,
        buttons: {
            "Save": this.saveItem,
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).remove();
        }
    });
}

function showItemDialog(itemObject, callback) {
    if (!itemObject) {
        //create a new item
        itemObject = new ItemRegister.ItemByCopy(ItemRegister.getById(1));
    }

    new ItemDialog(itemObject);
}

function EnchantingDialog(ench, caller, callback) {
    this.container = $("<div/>", {
        title: "Add enchantment"
    }).data("owner", this);

    this.enchSelector = Enchantments.makeList(ench, "Enchantment", "enchDialogType", "dialogInput ui-widget-content ui-corner-all");
    this.levelInput = makeLabeledInput("Level", "enchDialogLevel", "dialogInput ui-widget-content ui-corner-all");
    this.container.append(this.enchSelector);
    this.container.append(this.levelInput);

    this.callback = callback;
    this.caller = caller;

    this.diagCallback = function () {
        owner = $(this).data("owner");
        owner.caller[owner.callback](owner);
        $(this).dialog("close");
    };

    this.getEnchantment = function () {
        var selected = parseInt(this.enchSelector.children("select").children("option:selected").val());
        var level = parseInt(this.levelInput.children("input").val());
        return Enchantments.makeEnchantment(selected, level);
    };

    diag = this;

    this.container.dialog({
        modal: true,
        buttons: {
            "Apply": diag.diagCallback,
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).remove();
        }
    });
}

function createEnchantingDialog(caller, callback) {
    return new EnchantingDialog(Enchantments.list, caller, callback);
}

function ItemSelectDialog(itemList, multiple, caller, callback) {
    this.itemList = itemList;
    this.container = $("<div/>", {
        title: "Select Item"
    }).data("owner", this);

    this.callback = callback;
    this.caller = caller;

    this.containerObject = new ItemRegister.makeItemContainer(itemList, multiple);
    this.container.append(this.containerObject.holder);

    this.diagCallback = function () {
        owner = $(this).data("owner");
        result = owner.caller[owner.callback](owner);
        if (!result) {
            $(this).dialog("close");
        } else {
            showDialog(result);
        }
    };

    this.getSelectedItems = function () {
        return this.containerObject.getSelectedItems();
    };

    diag = this;

    this.container.dialog({
        modal: true,
        minWidth: 840,
        resizable: false,
        buttons: {
            "Select": diag.diagCallback,
            "Cancel": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).remove();
        }
    });
}

function showItemSelectDialog(itemList, multiple, caller, callback) {
    return new ItemSelectDialog(itemList, multiple, caller, callback);
}

var PlayerSelector = {
    defaultLabel: "@a",

    create: function (to) {
        if (typeof to === "undefined") {
            to = PlayerSelector.defaultLabel;
        }

        this.container = $("<div/>", {
            "class": "guiPlayerSelectorInterface"
        }).data("owner", this);

        this.textElem = makeLabeledInput("Player Selector", "playerSelectorText", "dialogInput ui-widget-content ui-corner-all");
        this.createSelectorButton = $("<div/>").text("Create Selector").button().data("owner", this);

        this.container.append(this.textElem);
        this.container.append(this.createSelectorButton);

        this.target = new PlayerSelector.target("@a", [
            new PlayerSelector.selector.position(0, 0, 0),
            new PlayerSelector.selector.gamemode(1),
            new PlayerSelector.selector.team("green", false)
        ]);

        this.createDialog = function () {
            this.dialog = new PlayerSelector.dialog(this.target, this, "updateText");
        };

        this.createSelectorButton.click(function(){
            var owner = $(this).data("owner");
            owner.createDialog();
        });

        this.updateText = function () {
            console.info("This ", this);
            console.log("Value: ", this.target.getString());
            this.textElem.children("input").val(this.target.getString());
        };

        this.updateText();
    },

    //target is used to fill the fields ONLY, and is not modified when saving
    dialog: function (target, owner, callback) {
        this.container = $("<div/>", {
            title: "Create Selector"
        }).data("owner", this);

        this.owner = owner;
        this.callback = callback;

        this.targetSelector = makeSelect([
            {
                name: "@a",
                value: "@a"
            },
            {
                name: "@p",
                value: "@p"
            },
            {
                name: "@r",
                value: "@r"
            }
        ], "targetSelector", "dialogInput ui-widget-content ui-corner-all", target.target);

        this.makeSelector = function(model, values){
            var container = $("<div/>", {
                "class": "selectorLine"
            });

            container.append($("<div/>").text(model.name).css({
                fontWeight: "bold",
                marginTop: "10px",
                marginBottom: "2px"
            }));

            for(var k in model.fields){
                var field = model.fields[k];
                var fieldContainer = $("<label/>").text(field.label).css("color", "#888");
                var fieldObject;

                console.log(field);

                if(field.type == "text"){
                    fieldObject = $("<input>", {
                        "type": "text",
                        "class": "ui-widget-content ui-corner-all"
                    }).attr("size", "10");

                    if(typeof values[field.id] != "undefined"){
                        fieldObject.val(values[field.id]);
                    }
                }else if(field.type == "select"){
                    fieldObject = $("<select/>", {
                        "class": "ui-widget-content ui-corner-all"
                    });

                    for(var l in model.fields[k].options){
                        var option = model.fields[k].options[l];

                        var optionObject = $("<option/>", {
                            value: option.value
                        }).text(option.label);

                        if(typeof values[field.id] != "undefined"){
                            if(values[field.id] == option.value){
                                optionObject.attr("selected", "true");
                            }
                        }

                        fieldObject.append(optionObject);
                    }
                }

                fieldContainer.append(fieldObject);

                container.append(fieldContainer);
            }

            return container;
        };

        var list = PlayerSelector.selector.list;
        for (var k in list) {
            var match = false;
            for (var l in target.selector) {
                if (target.selector[l].id == list[k].id) {
                    match = l;
                    break;
                }
            }

            if (match !== false) {
                this.container.append(this.makeSelector(list[k], target.selector[match]));
            }else{
                this.container.append(this.makeSelector(list[k], {}));
            }
        }

        this.container.dialog({
            modal: true,
            width: 800
        });
    },

    // intended to be used as "new PlayerSelector.target(...)"
    target: function (target, selector) {
        this.target = (typeof target === "undefined") ? "@a" : target;
        this.selector = (typeof selector === "undefined") ? [] : selector;

        this.getString = function () {
            var str = "";

            str += this.target;

            if (this.selector.length > 0) {
                str += "[";
                var count = 0;

                for (var k in this.selector) {
                    if (count > 0) {
                        str += ",";
                    }
                    count++;
                    str += this.selector[k].getString();
                }

                str += "]";
            }

            return str;
        }
    },

    //all of these are constructors
    selector: {
        //correspondence for form creation
        list: [
            {
                id: "position",
                name: "Position",
                fields: [
                    {
                        label: "x",
                        id: "x",
                        type: "text"
                    },
                    {
                        label: "y",
                        id: "y",
                        type: "text"
                    },
                    {
                        label: "z",
                        id: "z",
                        type: "text"
                    }
                ]
            },
            {
                id: "team",
                name: "Team",
                fields: [
                    {
                        label: "Team",
                        id: "team",
                        type: "text"
                    },
                    {
                        label: "Operation",
                        id: "condition",
                        type: "select",
                        options: [
                            {
                                label: "IS",
                                value: "1"
                            },
                            {
                                label: "IS NOT",
                                value: "0"
                            }
                        ]
                    }
                ]
            },
            {
                id: "radius",
                name: "Radius",
                fields: [
                    {
                        label: "Max",
                        id: "max",
                        type: "text"
                    },
                    {
                        label: "Min",
                        id: "min",
                        type: "text"
                    }
                ]
            },
            {
                id: "gamemode",
                name: "Gamemode",
                fields: [
                    {
                        label: "",
                        id: "gm",
                        type: "text"
                    }
                ]
            },
            {
                id: "level",
                name: "Exp level",
                fields: [
                    {
                        label: "Max",
                        id: "max",
                        type: "text"
                    },
                    {
                        label: "Min",
                        id: "min",
                        type: "text"
                    }
                ]
            },
            {
                id: "count",
                name: "Player Count",
                fields: [
                    {
                        label: "",
                        id: "c",
                        type: "text"
                    }
                ]
            },
            {
                id: "score",
                name: "Score",
                fields: [
                    {
                        label: "Name",
                        id: "name",
                        type: "text"
                    },
                    {
                        label: "Min",
                        id: "min",
                        type: "text"
                    },
                    {
                        label: "Max",
                        id: "max",
                        type: "text"
                    }
                ]
            },
            {
                id: "name",
                name: "Player name",
                fields: [
                    {
                        label: "Name",
                        id: "name",
                        type: "text"
                    },
                    {
                        label: "Operation",
                        id: "condition",
                        type: "select",
                        options: [
                            {
                                label: "IS",
                                value: "1"
                            },
                            {
                                label: "IS NOT",
                                value: "0"
                            }
                        ]
                    }
                ]
            }
        ],
        position: function (x, y, z) {
            this.x = (typeof x === "undefined") ? false : x;
            this.y = (typeof y === "undefined") ? false : y;
            this.z = (typeof z === "undefined") ? false : z;

            this.id = "position"; //for construction

            this.getString = function () {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var count = 0;
                var str = "";
                if (x !== false) {
                    count++;
                    str += "x=" + x;
                }

                if (y !== false) {
                    if (count > 0) {
                        str += ",";
                    }
                    count++;
                    str += "y=" + y;
                }

                if (z !== false) {
                    if (count > 0) {
                        str += ",";
                    }
                    count++;

                    str += "z=" + z;
                }

                return str;
            }
        },

        team: function (team, condition) {
            this.team = team;
            this.condition = (typeof condition === "undefined") ? true : condition;

            this.id = "team";

            this.getString = function () {
                var str = "";
                str += "team=";
                if (!this.condition) {
                    str += "!";
                }
                str += this.team;

                return str;
            }
        },

        radius: function (max, min) {
            this.min = (typeof min === "undefined") ? false : min;
            this.max = (typeof max === "undefined") ? false : max;

            this.id = "radius";

            this.getString = function () {
                var str = "";
                var count = 0;
                if (this.min !== false) {
                    str += "rm=" + this.min;
                    count++;
                }

                if (this.max !== false) {
                    if (count > 0) {
                        str += ",";
                    }
                    str += "r=" + this.max;
                }

                return str;
            }
        },

        gamemode: function (gm) {
            this.gm = (typeof gm === "undefined") ? -1 : gm;

            this.id = "gamemode";

            this.getString = function () {
                var str = "";
                if (gm >= 0) {
                    str += "m=" + this.gm;
                }

                return str;
            }
        },

        number: function (c) {
            this.c = (typeof c === "undefined") ? false : c;

            this.id = "number";

            this.getString = function () {
                var str = "";
                if (c !== false) {
                    str += "c=" + this.c;
                }

                return str;
            }
        },

        level: function (min, max) {
            this.min = (typeof min === "undefined") ? false : min;
            this.max = (typeof max === "undefined") ? false : max;

            this.id = "level";

            this.getString = function () {
                var str;
                var count = 0;

                if (this.min !== false) {
                    count++;
                    str += "lm=" + this.min;
                }

                if (this.max !== false) {
                    if (count > 0) {
                        str += ",";
                    }

                    str += "l=" + this.max;
                }

                return str;
            }
        },

        score: function (name, min, max) {
            this.name = name;
            this.min = (typeof min === "undefined") ? false : min;
            this.max = (typeof max === "undefined") ? false : max;

            this.id = "score";

            this.getString = function () {
                var str;
                var count = 0;

                if (this.min !== false) {
                    count++;
                    str += "score_" + this.name + "_min=" + this.min;
                }

                if (this.max !== false) {
                    if (count > 0) {
                        str += ",";
                    }

                    str += "score_" + this.name + "=" + this.max;
                }

                return str;
            }
        },

        name: function (name, condition) {
            this.name = name;
            this.condition = (typeof condition === "undefined") ? false : condition;

            this.id = "name";

            this.getString = function () {
                var str = "";
                str += "name=";
                if (!this.condition) {
                    str += "!";
                }
                str += this.name;

                return str;
            }
        }
    }
}

//Handles unique dialogs, such as create command, enchants list, side item list
var GUI = {
        commands: {
            give: {
                dialog: function () {
                    this.holder = $("<div/>", {
                        "class": "dialogCommand",
                        "title": "/give"
                    }).data("owner", this);

                    var spacer = $("<br/>");

                    this.enchSelector = new ItemEditor.BaseItemSelector(ItemRegister.getById(1), ItemRegister.getAllItems());
                    this.playerSelector = new PlayerSelector.create();

                    this.holder.append(this.enchSelector.holder);
                    this.holder.append(spacer);
                    this.holder.append(this.playerSelector.container);

                    this.holder.dialog({
                        width: 600
                    });
                },
                command: function (obj) {
                }
            }
        },

        init: function () {

        }
    }
    ;

$(document).ready(function (e) {
    $(".navButton").button().click(function (event) {
        event.preventDefault();

        switch ($(this).attr("id")) {
            case "openItemSelectDialog":
                showItemSelectDialog(ItemRegister.items, true, function (obj) {
                    console.log(obj.getSelectedItems());
                });
                break;
            case "openItemDialog":
                showItemDialog();
                break;
        }
    });
    Enchantments.init();
    ItemRegister.init();
    GUI.init();

    $(".loadingOverlay").hide();
});

function makeLabeledInput(labelText, fieldId, fieldClass) {
    return $("<div/>").append($("<label/>", {
            "for": fieldId,
            text: labelText,
        })).append($("<input>", {
            type: "text",
            "class": fieldClass
        }));
}

function makeSelect(values, fieldId, fieldClass, defaultValue) {
    container = $("<select/>", {
        id: fieldId,
        "class": fieldClass
    });
    for (k in values) {
        container.append($("<option/>", {
            text: values[k].name,
            value: values[k].value,
            selected: (!defaultValue) ? null : (defaultValue == values[k].value ? "selected" : null)
        }));
    }
    return container;
}