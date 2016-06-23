var configGui = new function() {
	var draggingSourceId = null;
	var draggingTargetId = null;
	function getCssRule(target) {
		var ss = document.styleSheets[0];
		var rules = ss.cssRules || ss.rules;
		var fooRule = null;
		for (var i = 0; i < rules.length; i++)
		{
			var rule = rules[i];
			if(rule.selectorText==target){
				return rule;
			}
		}
	};
	function pauseEvent(e){
	    if(e.stopPropagation) e.stopPropagation();
	    if(e.preventDefault) e.preventDefault();
	    e.cancelBubble=true;
	    e.returnValue=false;
	    return false;
	};
	function _clearDragging() {
		draggingSourceId = null;
		draggingTargetId = null;
		$("*").removeClass("dragSource");
		$("*").removeClass("dragTarget");
	};
	function getCoordsFromId(id) {
		var coords = {};
		coords.x = id.split("y")[0].split("x")[1];
		coords.y = id.split("y")[1];
		//console.log(JSON.stringify(coords));
		return coords;
	};
	function reject(target) {
		var oldBack = $(target).css("background-color");
		$(target).css("background-color","red");
		setTimeout(function() {
			$(target).css("background-color",oldBack);
		},100);
	}
	return {
		eraseAll:function() {
			config.eraseAll();
		},
		shiftX:function(adjust) {
			if(!config.shiftX(adjust)) {
				reject($('table'));
			}
		},
		shiftY:function(adjust) {
			if(!config.shiftY(adjust)) {
				reject($('table'));
			}
		},
		width:function(adjust) {
			if(!config.width(adjust)) {
				reject($('table'));
			}
		},
		height:function(adjust) {
			if(!config.height(adjust)) {
				reject($('table'));
			}
		},
		drop:function() {
			if(draggingSourceId!=null&&draggingTargetId!=null) {
				// do drop
			} else {
				_clearDragging();
			}
		},
		clearDragging : _clearDragging(),
		init:function() {
			$("body").on("mouseup",function(target){
				// for the dropping part of drag/drop
				if(draggingSourceId!=null){
					draggingSourceId = null;
					console.log("you dropped on the last known cell");
					configGui.drop();
				} else {
					// no dragging in this case
				}
			})
		},
		zoom:function(factor) {
			var r = getCssRule("td div");
			var newPix = Math.floor(parseInt(r.style.width)*factor);
			if(newPix<15||newPix>150) {
				return;
			}
			r.style.width = newPix+"px";
			r.style.height = newPix+"px";
		},
		setTable:function(xSize,ySize){
			$("table td").off("click");
			$("table td").off("mousedown");
			$("table td").off("mouseup");
			$("table td").off("mouseover");
			$("table td").off("blur");
			var html = "";
			for(var i=ySize;i>=1;i--) {
				html += "<tr>";
				for(var j=1;j<=xSize;j++) {
					html += "<td id='x"+j+"y"+i+"'><div></div></td>";
				}
				html += "</tr>";
			}
			$("table").html(html);
			$("table td div").on("click",function(event) {
				// add counter to model (if there are counters still available and nothing in this space!)
				var dragId = $(event.target).parent().attr("id");
				if($(event.target).parent().hasClass("counter")||$(event.target).parent().hasClass("start")){
					reject($(event.target).parent());
					return;
				}
				var coords = getCoordsFromId(dragId);
				var o = config.addThing(coords.x,coords.y,constant.THING_COUNTER_CASHCARD);
				if(!o) {
					reject($(event.target).parent());
				}
			});
			$("table td div").on("mousedown",function(event) {
				// stop selection when dragging
				// http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
				event=event||window.event;
				pauseEvent(event);
				// detect if there is something in this cell, turn dragging if so
				if(!($(event.target).parent().hasClass("counter")||$(event.target).parent().hasClass("start"))){
					return;
				}
				var dragId = $(event.target).parent().attr("id");
				draggingSourceId = dragId;
				//console.log("dragging: "+draggingSourceId);
				$(event.target).addClass("dragSource");
			});
			$("table td div").on("mouseover",function(event) {
				// if already occupied then no dropping
				// drop candidate?
				var dropId = $(event.target).parent().attr("id");

				if(	typeof dropId=="undefined"||
					draggingSourceId==null||
					dropId==draggingSourceId||
					$(event.target).parent().hasClass("counter")||$(event.target).parent().hasClass("start")
					) {
					draggingTargetId = null;
					$("*").removeClass("dragTarget");
					return;
				}
				draggingTargetId = dropId;
				//console.log("can drop here! "+draggingTargetId);
				$("table td div").removeClass("dragTarget");
				$(event.target).addClass("dragTarget");
			});
			$("table td div").on("blur",function(event) {
				console.log("clearing drop target "+draggingTargetId);
				draggingTargetId = null;
			});
			$("table td div").on("mouseup",function(event) {
				// stop bubbling up of event
				pauseEvent(event);
				// must drop onto clear space
				if($(event.target).hasClass("dragTarget")) {
					// where dropped?
					var dragId = $(event.target).parent().attr("id");
					var coordsTarget = getCoordsFromId(dragId);
					var coordsSource = getCoordsFromId(draggingSourceId);
					// add counter to model (if there are counters still available!)
					config.moveThing(coordsSource.x,coordsSource.y,coordsTarget.x,coordsTarget.y);
				}
				$("*").removeClass("dragSource");
				$("*").removeClass("dragTarget");
				_clearDragging();
			});
		},
		drawThing:function(thing) {
			var c = null;
			if(thing.thingType.substring(0,1)=="C"){c="counter";} // XXX refactor 'is one of these' into config.js
			if(thing.thingType.substring(0,1)=="E"){c="start";} // XXX ditto
			var id = "#x"+thing.x+"y"+thing.y;
			$(id).addClass(c);
			if("counterId" in thing) {
				$(id).find("div").html("<span class='noSelect'>"+thing.counterId+"</span>");
			}
		}
	};
};
