var config = new function() {

	var numberOfCounters = null;
	var xSize = null;
	var ySize = null;
	var things = null;
	var messages = null;
	var orient = null;

	function thing(x,y,thingType) {
		this.x = x;
		this.y = y;
		this.thingType = thingType;
	}

	function getThing(oldx,oldy) {
		for(var i=0;i<things.length;i++){
			var thing = things[i];
			if(thing.x==oldx&&thing.y==oldy) {
				return thing;
			}
		}
		return null;
	}

	return {
		eraseAll:function() {
			// delete all counters - there should only be one start point
			for(var j=0;j<(numberOfCounters+1);j++) {
				for(var i=0;i<things.length;i++){
					var thing = things[i];
					if(thing.thingType.substring(0,1)=="C"){
						things.splice(i,1);
						break;
					}
				}
			}
			config.render();
		},
		shiftX:function(adjust) {
			// if shifting left or right puts it over the edge... reject
			for(var i=0;i<things.length;i++){
				var thing = things[i];
				if((thing.x==1&&adjust<0)||(thing.x==xSize&&adjust>0)) {
					return false; // deny
				}
			}
			// go ahead and adjust
			for(var i=0;i<things.length;i++){
				var thing = things[i];
				thing.x = +thing.x +adjust;
			}
			config.render();
			return true;
		},
		shiftY:function(adjust) {
			// if shifting up or down puts it over the edge... reject
			for(var i=0;i<things.length;i++){
				var thing = things[i];
				if((thing.y==1&&adjust<0)||(thing.y==ySize&&adjust>0)) {
					return false; // deny
				}
			}
			// go ahead and adjust
			for(var i=0;i<things.length;i++){
				var thing = things[i];
				thing.y = +thing.y +adjust;
			}
			config.render();
			return true;
		},
		height:function(adjust) {
			// if reducing and anything is on top edge, reject
			var go = function(){ySize+=adjust;config.render();};
			if(adjust>0) {
				go();
				return true;
			}
			if(ySize==1) {
				return false; // deny
			}
			for(var i=0;i<things.length;i++){
				var thing = things[i];
				if(thing.y==ySize) {
					return false; // deny
				}
			}
			go();
			return true;
		},
		width:function(adjust) {
			// if reducing and anything is on top edge, reject
			var go = function(){xSize+=adjust;config.render();};
			if(adjust>0) {
				go();
				return true;
			}
			if(xSize==1) {
				return false; // deny
			}
			for(var i=0;i<things.length;i++){
				var thing = things[i];
				if(thing.x==xSize) {
					return false; // deny
				}
			}
			go();
			return true;
		},
		addThing:function(x,y,thingType) {
			if(things.length<=numberOfCounters){
				things.push({x:x,y:y,thingType:thingType,counterId:things.length});
				config.render();
				return true;
			} else {
				return false;
			}
		},
		moveThing:function(oldx,oldy,newx,newy) {
			var thingAtPosition = getThing(oldx,oldy);
			if(thingAtPosition==null) {
				// nothing found!
			} else {
				thingAtPosition.x=newx;
				thingAtPosition.y=newy;
				config.render();
			}
		},
		load:function() {
			if(TEST) {
				alert("running in test mode");
				numberOfCounters = 15;
				xSize = 10;
				ySize = 8;
				// note that array position equates to counter number
				// 1,1 is bottom left
				things = [
					{x:5,y:5,thingType:constant.THING_COUNTER_CASH,counterId:1},
					{x:3,y:5,thingType:constant.THING_COUNTER_CASH,counterId:2},
					{x:1,y:5,thingType:constant.THING_COUNTER_CASHCARD,counterId:3},
					{x:1,y:1,thingType:constant.THING_COUNTER_CASHCARD,counterId:4},
					{x:3,y:1,thingType:constant.THING_COUNTER_CASHCARD,counterId:5},
					{x:5,y:1,thingType:constant.THING_COUNTER_CASHCARD,counterId:6},
					{x:7,y:1,thingType:constant.THING_COUNTER_CASHCARD,counterId:7},
					{x:9,y:1,thingType:constant.THING_COUNTER_CASHCARD,counterId:8},
					{x:9,y:5,thingType:constant.THING_COUNTER_CASHCARD,counterId:9},
					{x:7,y:5,thingType:constant.THING_COUNTER_CASHCARD,counterId:10},
					{x:6,y:6,thingType:constant.THING_ENTRY_UP}
				];
				messages = [
					{uiLabel:"Tills are available",msgId:1,msgText:"Please take Tills are available"},
					{uiLabel:"No tills are available",msgId:2,msgText:"Please Wait For a Available"},
					{uiLabel:"Card only",msgId:3,msgText:"Card payment only"},
					{uiLabel:"Cash and card",msgId:4,msgText:"Cash/Card payment"}
				];
				orient = constant.ORIENT_LANDSCAPE;
				this.render();
			} else {
				// pull data from server
				alert("pull data from server not implemented yet");
				// note - there should always be one entry point defined
				// if one is not found then add one, remove a counter if necessary
			}
		},
		render:function() {
			// draw grid where id of each cell has id of form xNyN where N are coordinates
			configGui.setTable(xSize,ySize);
			// populate grid with things
			for(var i=0;i<things.length;i++) {
				var e = things[i];
				configGui.drawThing(e);
			}
		},
		save: function() {
			// write to server
			alert("save data to server not implemented yet");
		}
	};
};
