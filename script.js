var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data; // = getScaleFreeNetwork(25);
var seed = 2;
var dialog;
function setDefaultLocale() {
	var defaultLocal = navigator.language;
	var select = document.getElementById('locale');
	select.selectedIndex = 0; // set fallback value
	for (var i = 0, j = select.options.length; i < j; ++i) {
		if (select.options[i].getAttribute('value') === defaultLocal) {
			select.selectedIndex = i;
			break;
		}
	}
}

function destroy() {
	if (network !== null) {
		network.destroy();
		network = null;
	}
}

function draw() {
	destroy();
	nodes = [];
	edges = [];

	// create a network
	var container = document.getElementById('mynetwork');
	var options = {
		nodes : {
			shape : 'box',
		},
		edges : {
			arrows : {
				middle : {
					enabled : true,
					scaleFactor : 1,
					type : 'arrow'
				}
			},
		},
		physics : {
			enabled : true,
			solver : 'forceAtlas2Based',
			forceAtlas2Based : {
				springLength : 50,
				springConstant : 0,
				avoidOverlap : 1,
				centralGravity : 0.00,
				gravitationalConstant : -1
			},
		},
		manipulation : {
			addNode : function (data, callback) {
				// filling in the popup DOM elements
				dialog = $("#NodeEditor").dialog({
						autoOpen : false,
						height : 340,
						width : 290,
						modal : true,
						resizable : false,
						buttons : {
							"Add node" : saveData.bind(this, data, callback),
							Cancel : function () {
								dialog.dialog("close");
							}
						},
						close : function () {}
					});
				dialog.dialog("open");
			},
			editNode : function (data, callback) {
				dialog = $("#NodeEditor").dialog({
						autoOpen : false,
						height : 350,
						width : 290,
						modal : true,
						resizable : false,
						buttons : {
							"Save node" : saveData.bind(this, data, callback),
							Cancel : function () {
								dialog.dialog("close");
							}
						},
						close : function () {}
					});
				dialog.dialog("open");
			},
			addEdge : function (data, callback) {
				if (data.from == data.to) {
					var r = confirm("Do you want to connect the node to itself?");
					if (r == true) {
						callback(data);
					}
				} else {
					callback(data);
				}
			}
		}
	};
	network = new vis.Network(container, data, options);
}

function clearPopUp() {
	dialog.dialog("close");
}

function cancelEdit(callback) {
	clearPopUp();
	callback(null);
}

function saveData(data, callback) {
	var d = new Date();
	var n = d.getTime();
	data.id = n;
	data.label = "Hey: " + n;
	clearPopUp();
	callback(data);
}

function init() {
	draw();
	$(".SourceFrequency").css("display", "none");
	$(".SourceDutyCycle").css("display", "none");
	$("#SourceSignalType").change(function () {
		switch($("#SourceSignalType").val()) {
			case "STEP":
				$(".SourceFrequency").css("display", "none");
				$(".SourceDutyCycle").css("display", "none");
				break;
			case "SINE":
				$(".SourceFrequency").css("display", "block");
				$(".SourceDutyCycle").css("display", "none");
				break;
			case "SAWTOOTH":
				$(".SourceFrequency").css("display", "block");
				$(".SourceDutyCycle").css("display", "none");
				break;
			case "TRIANGLE":
				$(".SourceFrequency").css("display", "block");
				$(".SourceDutyCycle").css("display", "none");
				break;
			case "RECTANGULAR":
				$(".SourceFrequency").css("display", "block");
				$(".SourceDutyCycle").css("display", "block");
				break;
		}
	});
	var TempSelect = document.getElementById("FunctionsName");
	var TempIndex = 0;
	for (var i=0; i<StaticMathFunctions.AllFunctions.length; i++) {
		for (var j=0; j<StaticMathFunctions.AllFunctions[i].Functions.length; j++) {
			TempSelect.options[TempSelect.options.length] = new Option(
			StaticMathFunctions.AllFunctions[i].Functions[j].Name
			, TempIndex);
			TempIndex++;
		}
	}
}

$(document).ready(function () {
	init();
});

function OpenSelectNodeType(evt, cityName) {
	var i,
	x,
	tablinks;
	x = document.getElementsByClassName("NodeType");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < x.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
	}
	document.getElementById(cityName).style.display = "block";
	evt.currentTarget.className += " w3-red";
}
