var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data; // = getScaleFreeNetwork(25);
var seed = 2;
var dialog;
var TempSourceNodeItem, TempFunctionNodeItem;
var CurrentTab = "Sources";

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
			color :{
				border: '#000000',
				background: "#ffffff",
			},
			font: {
				color: '#000000',
			},
		},
		edges : {
			color: {
				color: '#000000',
			},
			arrows : {
				to : {
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
			initiallyActive: true,
			addNode : function (data, callback) {
				// filling in the popup DOM elements
				dialog = $("#NodeEditor").dialog({
						closeOnEscape: false,
						autoOpen : false,
						height : 350,
						width : 500,
						modal : true,
						resizable : false,
						buttons : {
							"Add node" : saveData.bind(this, data, callback),
							Cancel : function () {
								cancelEdit(callback);
							}
						},
						close : function () {}
					}).dialog("open");
			},
			editNode : function (data, callback) {
				if (data.gskExtra === 'undefined') {
				} else {
					$("#btn"+data.gskExtra.Tab)[0].click();
					if (data.gskExtra.Tab == "Sources" || data.gskExtra.Tab == "Functions") {
						var Elements = $("#"+data.gskExtra.Tab).find(".w3-input");
						$(Elements[0]).val( $(Elements[0]).children().filter(function () { return $(this).html() == data.gskExtra.Name; }).val()).change();
						Elements = $("#"+data.gskExtra.Tab).find(".w3-input");
						for (var i=1; i<Elements.length; i++) {
							$(Elements[i]).val(data.gskExtra.Parameters[i-1].Value);
						}
					} else if (data.gskExtra.Tab == "Sinks") {
						$("#SinksPlotType").val(data.gskExtra.SinksPlotType);
						$("#SinksLineType").val(data.gskExtra.SinksLineType);
						$("#SinksXAxisType").val(data.gskExtra.SinksXAxisType);
						$("#SinksYAxisType").val(data.gskExtra.SinksYAxisType);
					}
				}
				dialog = $("#NodeEditor").dialog({
						closeOnEscape: false,
						autoOpen : false,
						height : 350,
						width : 500,
						modal : true,
						resizable : false,
						buttons : {
							"Save node" : saveDataAndCheckEdges.bind(this, data, callback),
							Cancel : function () {
								cancelEdit(callback);
							}
						},
						//close : function () {}
					}).dialog("open");
			},
			addEdge : function (data, callback) {
				var NoOfOutputs=0;
				var NoOfInputs=0;
				for(var element in network.body.edges) {
					if (data.from == network.body.edges[element].fromId) NoOfOutputs++;
					if (data.to == network.body.edges[element].toId) NoOfInputs++;
				};
				if (
				(network.body.nodes[data.from].options.gskExtra.MaxOutputs>NoOfOutputs)
				&&
				(network.body.nodes[data.to].options.gskExtra.MaxInputs>NoOfInputs)
				) callback(data);
				else {
					$.notify("This connection is not allowed", "warn");
					callback(null);
				}
			},
			editEdge : function (data, callback) {
				var NoOfOutputs=0;
				var NoOfInputs=0;
				for(var element in network.body.edges) {
					if (network.body.edges[element].id != data.id) {
						if (data.from == network.body.edges[element].fromId) NoOfOutputs++;
						if (data.to == network.body.edges[element].toId) NoOfInputs++;
					}
				};
				if (
				(network.body.nodes[data.from].options.gskExtra.MaxOutputs>NoOfOutputs)
				&&
				(network.body.nodes[data.to].options.gskExtra.MaxInputs>NoOfInputs)
				) callback(data);
				else {
					$.notify("This connection is not allowed", "warn");
					callback(null);
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

function saveDataAndCheckEdges(data, callback) {
	saveData(data, callback);
	var NoOfOutputs=0;
	var NoOfInputs=0;
	for(var element in network.body.edges) {
		if (network.body.edges[element].fromId == data.id) {
			NoOfOutputs++;
			if (NoOfOutputs>data.gskExtra.MaxOutputs)
				network.body.data.edges.remove ({id: element});
		}
		if (network.body.edges[element].toId == data.id) {
			NoOfInputs++;
			if (NoOfInputs>data.gskExtra.MaxInputs)
				network.body.data.edges.remove ({id: element});
		}
	};	
}

function saveData(data, callback) {
	var d = new Date();
	var n = d.getTime();
	data.gskExtra = null;
	if (CurrentTab == "Sources") {
		data.label = TempSourceNodeItem.String();
		data.shape = "image";
		data.image = TempSourceNodeItem.Image;
		data.gskExtra = TempSourceNodeItem;
		data.gskExtra.MaxInputs = 0;
		data.gskExtra.MaxOutputs = Infinity;
	} else if (CurrentTab == "Sinks") {
		data.label = "Output";
		data.shape = "image";
		data.image = "images/oscilloscope.png";
		data.gskExtra = {
			SinksPlotType: $("#SinksPlotType").val(),
			SinksLineType: $("#SinksLineType").val(),
			SinksXAxisType: $("#SinksXAxisType").val(),
			SinksYAxisType: $("#SinksYAxisType").val(),
			MaxOutputs: 0,
		};
		if ($("#SinksPlotType").val() == "XYGRAPH") data.gskExtra.MaxInputs = 2;
		else data.gskExtra.MaxInputs = 1;
	} else if (CurrentTab == "Functions") {
		data.label = TempFunctionNodeItem.String();
		data.shape = "image";
		data.image = TempFunctionNodeItem.Image;
		data.gskExtra = TempFunctionNodeItem;
		data.gskExtra.MaxInputs = 1;
		data.gskExtra.MaxOutputs = Infinity;
	} else {
		data.label = "Hey: " + n;
		data.gskExtra = {
			MaxInputs: 1,
			MaxOutputs: Infinity,			
		}
	}
	data.gskExtra.Tab = CurrentTab;
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
		TempSourceNodeItem = SourcesForNode.AllSources[SourceInt];
		for (var i = 0; i < TempSourceNodeItem.Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + TempSourceNodeItem.Parameters[i].Name + ', $'+ TempSourceNodeItem.Parameters[i].LaTeX +'$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + TempSourceNodeItem.Parameters[i].Value + '" id="SourceSingnalParam' + i + '"/></div>';
			$("#SourceSingnalParams").append(TempString);
			$("#SourceSingnalParam"+i).on("change paste keyup", function () {
				TempSourceNodeItem.Parameters[parseInt(ExtractNumberAtEnd($(this)[0].id))].Value = $(this).val();
				$("#SourcesLaTeXRender").empty();
				var TempString = TempSourceNodeItem.LaTeXString();
				$("#SourcesLaTeXRender").append(TempString);
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
		TempFunctionNodeItem = StaticMathFunctions.AllFunctions[FunctionInt];
		for (var i = 0; i < TempFunctionNodeItem.Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + TempFunctionNodeItem.Parameters[i].Name + ', $'+ TempFunctionNodeItem.Parameters[i].LaTeX +'$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + TempFunctionNodeItem.Parameters[i].Value + '" id="FunctionsParam' + i + '"/></div>';
			$("#StaticFunctionParams").append(TempString);
			$("#FunctionsParam"+i).on("change paste keyup", function () {
				TempFunctionNodeItem.Parameters[parseInt(ExtractNumberAtEnd($(this)[0].id))].Value = $(this).val();
				$("#FunctionsLaTeXRender").empty();
				var TempString = TempFunctionNodeItem.LaTeXString();
				$("#FunctionsLaTeXRender").append(TempString);
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

function OpenSelectNodeType(evt, TabId) {
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
	document.getElementById(TabId).style.display = "block";
	evt.currentTarget.className += " w3-red";
	CurrentTab = TabId;
}

function ExtractNumberAtEnd (Str) {
    var matches = Str.match(/\d+$/);
	if (matches) return matches[0];
	else return 0;
}

//$(".vis-manipulation").css("display", "none")
//$(".vis-edit-mode").css("display", "none")