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
	if(!mcitem.tag.SkullOwner){
		mcitem.tag.CustomPotionEffects = new Array();
	}
}

function makeItem(id, damage, count, slot){
	this.id = id;
	this.Damage = damage;
	this.Count = count;
	if(!!slot || slot === 0){
		this.Slot = slot;
	}
	
	return this;
}

var ItemRegister = {
	items: [],
	customItems: [],
    currentUID: 0,
	
	create: function(name, id, data, friendlyName, texture){
		this.items[this.items.length] = new this.Item(name, id, data, friendlyName, texture);
	},
	
	Item: function(name, id, metaData, friendlyName, texture){
		this.name = name; //eg minecraft:stone
		this.id = id; //eg 1
		this.friendlyName = friendlyName; //eg Stone
		this.metaData = metaData;
		this.texture = texture;
        this.UID = ItemRegister.currentUID++;
	},
	
	add: function(mcitem){
		this.customItems[this.customItems.length] = mcitem;
	},
	
	getById: function(id){
		for(k in items){
			if(items[k].id == id){
				return items[k];
			}
		}
		
		return this.UnknownItem;
	},
	
	init: function(){
		this.create("minecraft:stone", 1, 0, "Stone", "stone");
        this.create("minecraft:dirt", 2, 0, "Dirt", "dirt");
        this.create("minecraft:grass", 3, 0, "Grass", "grass_side");
		this.UnknownItem = new this.Item("Unknown Item", -1, 0, "unknown");
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
            console.log(owner);
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
		
		this.holder.append(this.searchBar).append(this.itemsContainer);
	}
};

var Enchantments = {
	list:[],
	
	enchantment: function(id, name) {
		this.id = id;
		this.name = name;
		Enchantments.list[Enchantments.list.length] = this;
	},
	
	init: function(){
		this.protection = new Enchantments.enchantment(0, "Protection");
		this.fireProtection = new Enchantments.enchantment(1, "Fire protection");
		this.featherFalling = new Enchantments.enchantment(2, "Feather falling");
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

function EnchantingDialog(ench, callback){
	this.container = $("<div/>", {
		title: "Add enchantment"
	});
	this.container.append(Enchantments.makeList(ench, "Enchantment", "enchDialogLevel", "dialogInput ui-widget-content ui-corner-all"));
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

function ItemDialog(itemObject){
	this.itemProp = ItemRegister.getById(itemObject.id);
	this.container = $("<div/>", {
		title: "Edit item"
	});
	
	this.container.dialog({
		modal: false,
		buttons: {
			"Save": diag.diagCallback,
			"Cancel": function(){
				$(this).dialog("close");
			}
		},
		close: function(){
			$(this).remove();
		}
	});
}

function showItemDialog(itemObject){
	if(!itemObject){
		//create a new item
		//TODO
	}
}

function ItemSelectDialog(itemList, multiple, callback){
	this.itemLIst = itemList;
	this.container = $("<div/>", {
		title: "Select Item"
	});
    
    this.containerObject = new ItemRegister.makeItemContainer(itemList, multiple);
    
	this.container.append(this.containerObject.holder);
	
	this.diagCallback = function(){
		callback();
		$(this).dialog("close");
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

function showItemSelectDialog(itemList, multiple, callback){
	return new ItemSelectDialog(itemList, multiple, callback);
}

$(document).ready(function(e) {
    $(".navButton").button().click(function(event){
		event.preventDefault();
        
        switch($(this).attr("id")){
        	case "openItemDialog":
            	showItemSelectDialog(ItemRegister.items, false, function(){});
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