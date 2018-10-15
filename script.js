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
						height : 350,
						width : 500,
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
	var TempSelect = document.getElementById("SourceSignalType");
	var TempIndex = 0;
	for (var i = 0; i < SourcesForNode.AllSources.length; i++) {
		TempSelect.options[TempSelect.options.length] = new Option(
				SourcesForNode.AllSources[i].Name, TempIndex);
		TempIndex++;
	}
	$("#SourceSignalType").on("change paste keyup", function () {
		$("#SourceSingnalParams").empty();
		var SourceInt = parseInt($("#SourceSignalType").val());
		for (var i = 0; i < SourcesForNode.AllSources[SourceInt].Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + SourcesForNode.AllSources[SourceInt].Parameters[i].Name + ', $'+ SourcesForNode.AllSources[SourceInt].Parameters[i].LaTeX +'$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + SourcesForNode.AllSources[SourceInt].Parameters[i].Value + '" id="SourceSingnalParam' + i + '"/></div>';
			$("#SourceSingnalParams").append(TempString);
			$("#SourceSingnalParam"+i).on("change paste keyup", function () {
				$("#SourcesLaTeXRender").empty();
				var TempString = SourcesForNode.AllSources[SourceInt].LaTeXString();
				$("#SourcesLaTeXRender").append("$"+TempString+"$");
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			});
		}
		$("#SourceSingnalParam0").change();
	});
	$("#SourceSignalType").change();
	var TempSelect = document.getElementById("FunctionsName");
	var TempIndex = 0;
	for (var i = 0; i < StaticMathFunctions.AllFunctions.length; i++) {
		TempSelect.options[TempSelect.options.length] = new Option(
				StaticMathFunctions.AllFunctions[i].Name, TempIndex);
		TempIndex++;
	}
	$("#FunctionsName").on("change paste keyup", function () {
		$("#StaticFunctionParams").empty();
		var FunctionInt = parseInt($("#FunctionsName").val());
		for (var i = 0; i < StaticMathFunctions.AllFunctions[FunctionInt].Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + StaticMathFunctions.AllFunctions[FunctionInt].Parameters[i].Name + ', $'+ StaticMathFunctions.AllFunctions[FunctionInt].Parameters[i].LaTeX +'$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + StaticMathFunctions.AllFunctions[FunctionInt].Parameters[i].Value + '" id="FunctionsParam' + i + '"/></div>';
			$("#StaticFunctionParams").append(TempString);
			$("#FunctionsParam"+i).on("change paste keyup", function () {
				$("#FunctionsLaTeXRender").empty();
				var TempString = StaticMathFunctions.AllFunctions[FunctionInt].LaTeXString();
				$("#FunctionsLaTeXRender").append("$"+TempString+"$");
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			});
		}
		$("#FunctionsParam0").change();
	});
	$("#FunctionsName").change();
}

$(document).ready(function () {
	MathJax.Hub.Config({
		extensions : ["tex2jax.js"],
		jax : ["input/TeX", "output/HTML-CSS"],
		tex2jax : {
			inlineMath : [["$", "$"], ["\\(", "\\)"]]
		}
	});
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
