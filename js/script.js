// Minecraft Command Generator by Windsdon

function itemTagCheck(mcitem){
	if(!mcitem.tag){
		mcitem.tag = new Object();
	}
}

function itemEnchant(mcitem, id, lvl){
	itemTagCheck(mcitem);
	if(!mcitem.tag.ench){
		mcitem.tag.ench = new Array();
	}
	
	mcitem.tag.ench[mcitem.tag.ench.length] = {
		id: id,
		lvl: lvl
	};
};

function makeModifier(name, amount, operation){
	this.Name = name;
	this.Amount = amout;
	this.Operation = operation;
}

function itemAddModifier(mcitem, attributeName, name, amount, operation){
	itemTagCheck(mcitem);
	if(!mcitem.tag.AttributeModifiers){
		mcitem.tag.AttributeModifiers = new Array();
	}
	
	modifier = new makeModifier(name, amount, operation);
	modifier.AttributeName = attributeName;
	
	mcitem.tag.AttributeModifiers[mcitem.tag.AttributeModifiers.length] = modifier;
}

function itemSetName(mcitem, name){
	itemTagCheck(mcitem);
	if(!mcitem.tag.display){
		mcitem.tag.display = new Object();
	}
	
	mcitem.tag.display.Name = name;
}

function itemAddLoreLine(mcitem, lore){
	itemTagCheck(mcitem);
	if(!mcitem.tag.display){
		mcitem.tag.display = new Object();
	}
	
	if(!mcitem.tag.display.Lore){
		mcitem.tag.display.Lore = new Array();
	}
	
	mcitem.tag.display.Lore[mcitem.tag.display.Lore.length] = lore;
}

function makePotionEffect(id, amplifier, duration, ambient){
	this.Id = id;
	this.Amplifier = amplifier;
	this.Duration = duration;
	if(!!ambient){
		this.Ambient = ambient;
	}
}

function itemAddCustomPotionEffect(mcitem, id, amplifier, duration, ambient){
	itemTagCheck(mcitem);
	if(!mcitem.tag.CustomPotionEffects){
		mcitem.tag.CustomPotionEffects = new Array();
	}
	
	mcitem.tag.CustomPotionEffects[mcitem.tag.CustomPotionEffects.length] = new makePotionEffect(id, amplifier, duration, ambient);
}

function itemSetSkullOwner(mcitem, owner){
	itemTagCheck(mcitem);
	mcitem.tag.SkullOwner = owner;
}

function Item(id, damage, count, slot){
	this.id = id;
	this.Damage = damage;
	this.Count = count;
	if(!!slot || slot === 0){
		this.Slot = slot;
	}
	
	return this;
}

var MCItem = {
	Item: function(id, damage, count, slot){
    	if(typeof id === "number"){
        	//normal constructor
            this.id = id;
            this.Damage = damage;
            this.Count = count;
            if(!!slot || slot === 0){
                this.Slot = slot;
            }
        }else{
        	//copy constructor
            //weird notation because of id :/
        	this.id = id.id;
            this.damage = id.damage;
            this.Count = id.Count;
            if(!!id.slot || id.slot === 0){
                this.Slot = id.slot;
            }
        }
    }
}

var ItemRegister = {
	items: [],
	customItems: [],
    currentUID: 0,
	
	create: function(name, id, data, friendlyName, texture){
		this.items.push(new this.Item(name, id, data, friendlyName, texture));
	},
	
	Item: function(name, id, metaData, friendlyName, texture, mcItem){
		this.name = name; //eg minecraft:stone
		this.id = id; //eg 1
		this.friendlyName = friendlyName; //eg Stone
		this.metaData = metaData; //eg 0
		this.texture = texture; //eg stone
        this.UID = ItemRegister.currentUID++;
        if(mcItem === undefined){
        	this.mcItem = new MCItem.Item(id, metaData, 1);
        }else{
        	this.mcItem = mcItem;
        }
	},
    
    ItemByCopy: function(item){
    	return new ItemRegister.Item(item.name, item.id, item.metaData, item.friendlyName, item.texture, new MCItem.Item(item.mcItem));
    },
	
	add: function(item){
		this.customItems.push(item);
	},
    
    getHighestUID: function(itemList){
    	highest = 0;
        for(k in itemList){
        	highest = (highest < itemList[k] ? itemList[k] : highest);
        }
        return highest;
    },
	
	getById: function(id){
		for(k in ItemRegister.items){
			if(ItemRegister.items[k].id == id){
				return ItemRegister.items[k];
			}
		}
		
		return ItemRegister.UnknownItem;
	},
	
	init: function(){
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
    
    getAllItems: function(){
    	return this.items.concat(this.customItems);
    },
	
	makeItemContainer: function(itemList, multipleSelection){
		this.holder = $("<div/>", {
			"class": "itemDialogContainer"
		});
        
        this.searchBarTyped = function(event){
        	owner = $(this).data("owner");
            itemList = owner.itemList;
            search = $(this).val();
            reg = new RegExp(search, "gi");
            
            for(k in itemList){
            	item = itemList[k];
                itemObj = item.data("item");
            	if(itemObj.friendlyName.match(reg)){
                	item.removeClass("hidden");
                }else{
                	if(!item.hasClass("hidden")){
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
        
        this.itemSelectedCheck = function(){
        	owner = $(this).data("owner");
            owner.itemSelected(this);
        };
        
        this.itemSelected = function(obj){
        	if(!this.multipleSelection){
            	this.itemsContainer.children(".item").each(function(){
                	if($(this).data("item").UID != $(obj).data("item").UID){
                    	$(this).removeClass("selected");
                    }
                });
            }
            
            $(obj).toggleClass("selected");	
        }
        
        this.itemList = new Array();
        for(k in itemList){
        	newItem = $("<div/>", {
            	"class": "item"
            }).click(this.itemSelectedCheck).css("background-image", "url(images/icons/"+itemList[k].texture+".png)")
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
        
        this.getSelectedItems = function(){
        	itemList = new Array();
        	this.itemsContainer.children(".item.selected").each(function(){
            	itemList.push($(this).data("item"));
            });
            return itemList;
        };
		
		this.holder.append(this.searchBar).append(this.itemsContainer).disableSelection();
	}
};

var Enchantments = {
	list:[],
	
	enchantment: function(id, name) {
		this.id = id;
		this.name = name;
		Enchantments.list.push(this);
	},
	
	init: function(){
		this.protection = new Enchantments.enchantment(0, "Protection");
		this.fireProtection = new Enchantments.enchantment(1, "Fire protection");
		this.featherFalling = new Enchantments.enchantment(2, "Feather falling");
	},
    
    getById: function(id){
    	for(k in Enchantments.list){
        	if(Enchantments.list[k].id == k){
            	return Enchantments.list[k];
            }
        }
        return -1;
    },
	
	makeList: function(enchList, labelText, fieldId, fieldClass){
		valList = new Array();
		i = 0;
		for(k in enchList){
			valList[i++] = {
				name:enchList[k].name + " ("+enchList[k].id+")", 
				value:enchList[k].id
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
	
	BaseItemSelector: function(selected, options){
    	this.holder = $("<div/>", {
        	"class": "dialogItemSelector",
            "title": "Click to change"
        }).data("owner", this);
        this.options = options;
        this.selected = selected;
        
        this.itemSelected = function(object){
        	this.selected = object.getSelectedItems()[0];

            ItemEditor.setItemIcon(this.itemIcon, this.selected)
            ItemEditor.setItemDefaultName(this.itemName, this.selected);
        };
        
        this.itemIcon = ItemEditor.makeItemIcon(selected);
        this.itemName = ItemEditor.makeItemDefaultName(selected);
        this.holder.append(this.itemIcon)
        .append(this.itemName);
        
        this.holder.click(function(){
        	$(this).data("selector", showItemSelectDialog($(this).data("owner").options, false, $(this).data("owner"), "itemSelected"));
        }).tooltip({
            track: true,
        	show: false,
            hide: false
        });
        
        this.holder.disableSelection();
    },
    
    setItemIcon: function(object, item){
    	object.css("background-image", "url(images/icons/"+item.texture+".png)")
    },
    
    setItemDefaultName: function(object, item){
    	object.text(item.friendlyName);
    },
    
    makeItemIcon: function(item){
    	elem = $("<div/>", {
        	"class": "item"
        });
        ItemEditor.setItemIcon(elem, item);
    	return elem;
    },
    
    makeItemDefaultName: function(item){
    	elem = $("<div/>", {
        	"class": "itemName"
        });
        ItemEditor.setItemDefaultName(elem, item)
    	return elem;
    },
    
    makeLine: function(label, id, object, source) {
    	return $("<div/>"{
        	
        })
    },
    
	create: function(item){
    	this.holder = $("<div/>", {
			"class": "itemEditorDialogContainer"
		}).data("owner", this);
        
        this.nameInput = ItemEditor.makeLine("Custom name", "customName");
        this.baseItemSelector = new ItemEditor.BaseItemSelector(item, ItemRegister.getAllItems());
        
        this.holder.append(this.baseItemSelector.holder)
        .append(fields)
        .disableSelection();
    }
}

function ItemDialog(itemObject, callback){
	this.itemProp = itemObject;
	this.container = $("<div/>", {
		title: "Edit item"
	}).data("owner", this);
    
    this.container.append((new ItemEditor.create(itemObject)).holder);
    
    this.saveItem = function(){
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
			"Cancel": function(){
				$(this).dialog("close");
			}
		},
		close: function(){
			$(this).remove();
		}
	});
}

function showItemDialog(itemObject, callback){
	if(!itemObject){
		//create a new item
		itemObject = new ItemRegister.ItemByCopy(ItemRegister.getById(1));
	}
    
    new ItemDialog(itemObject);
}

function EnchantingDialog(ench, callback){
	this.container = $("<div/>", {
		title: "Add enchantment"
	});
    this.itemSelector = Enchantments.makeList(ench, "Enchantment", "enchDialogLevel", "dialogInput ui-widget-content ui-corner-all");
	this.container.append(this.itemSelector.holder);
	this.container.append(makeLabeledInput("Level", "enchDialogLevel", "dialogInput ui-widget-content ui-corner-all"));
	this.enchCallback = callback;
	
	this.diagCallback = function(){
		callback();
		$(this).dialog("close");
	};
	
	diag = this;
	
	this.container.dialog({
		modal: true,
		buttons: {
			"Apply": diag.diagCallback,
			"Cancel": function(){
				$(this).dialog("close");
			}
		},
		close: function(){
			$(this).remove();
		}
	});
}

function createEnchantingDialog(callback){
	return new EnchantingDialog(Enchantments.list, callback);
}

function ItemSelectDialog(itemList, multiple, caller, callback){
	this.itemList = itemList;
	this.container = $("<div/>", {
		title: "Select Item"
	}).data("owner", this);
    
    this.callback = callback;
    this.caller = caller;
    
    this.containerObject = new ItemRegister.makeItemContainer(itemList, multiple);
	this.container.append(this.containerObject.holder);
	
	this.diagCallback = function(){
		owner = $(this).data("owner");
        result = owner.caller[callback](owner);
        if(!result){
			$(this).dialog("close");
        }else{
        	showDialog(result);
        }
	};
    
    this.getSelectedItems = function(){
    	return this.containerObject.getSelectedItems();
    };
	
	diag = this;
	
	this.container.dialog({
		modal: true,
		minWidth: 840,
		resizable: false,
		buttons: {
			"Select": diag.diagCallback,
			"Cancel": function(){
				$(this).dialog("close");
			}
		},
		close: function(){
			$(this).remove();
		}
	});
}

function showItemSelectDialog(itemList, multiple, caller, callback){
	return new ItemSelectDialog(itemList, multiple, caller, callback);
}

$(document).ready(function(e) {
    $(".navButton").button().click(function(event){
		event.preventDefault();
        
        switch($(this).attr("id")){
        	case "openItemSelectDialog":
            	showItemSelectDialog(ItemRegister.items, true, function(obj){
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
	
	$(".loadingOverlay").hide();
});

function makeLabeledInput(labelText, fieldId, fieldClass){
	return $("<div/>").append($("<label/>", {
		"for": fieldId,
		text: labelText,
	})).append($("<input>", {
		type: "text",
		"class": fieldClass
	}));
}

function makeSelect(values, fieldId, fieldClass, defaultValue){
	container = $("<select/>", {id:fieldId, "class":fieldClass});	
	for(k in values){
		container.append($("<option/>",{
			text: values[k].name,
			value: values[k].value,
			selected: (!defaultValue) ? null : (defaultValue == values[k].value ? "selected" : null)
		}));
	}
	return container;
}