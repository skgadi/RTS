var nodes = null;
var edges = null;
var network = null;
// randomly create some nodes and edges
var data; // = getScaleFreeNetwork(25);
var seed = 2;
var dialog;
var TempSourceNodeItem, TempFunctionNodeItem, TempOperatorNodeItem, TempTransferFunctionNodeItem, TempHardwareIONodeItem;
var CurrentTab = "Sources";
var OrderOfExecution = [];
var SimulationState="Loading";

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
			color : {
				border : '#000000',
				background : "#ffffff",
			},
			font : {
				color : '#000000',
			},
		},
		edges : {
			color : {
				color : '#000000',
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
			initiallyActive : true,
			addNode : function (data, callback) {
				// filling in the popup DOM elements
				dialog = $("#NodeEditor").dialog({
						closeOnEscape : false,
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
					});
					$(".ui-dialog-titlebar-close").css("display", "none");
					dialog.dialog("open");
			},
			editNode : function (data, callback) {
				if (data.gskExtra === 'undefined') {}
				else {
					$("#btn" + data.gskExtra.Tab)[0].click();
					if (data.gskExtra.Tab == "Sources" || data.gskExtra.Tab == "Functions" || data.gskExtra.Tab == "Operators" || data.gskExtra.Tab == "TransferFunctions" || data.gskExtra.Tab == "HardwareIOs") {
						var Elements = $("#" + data.gskExtra.Tab).find(".w3-input");
						$(Elements[0]).val($(Elements[0]).children().filter(function () {
								return $(this).html() == data.gskExtra.Name;
							}).val()).change();
						Elements = $("#" + data.gskExtra.Tab).find(".w3-input");
						for (var i = 1; i < Elements.length; i++)
							$(Elements[i]).val(data.gskExtra.Parameters[i - 1].Value).change();
					} else if (data.gskExtra.Tab == "Sinks") {
						$("#SinksLabel").val(data.label);
						$("#SinksPlotType").val(data.gskExtra.SinksPlotType);
						$("#SinksLineType").val(data.gskExtra.SinksLineType);
						$("#SinksXAxisType").val(data.gskExtra.SinksXAxisType);
						$("#SinksYAxisType").val(data.gskExtra.SinksYAxisType);
					}
				}
				dialog = $("#NodeEditor").dialog({
						closeOnEscape : false,
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
						close : function () {}
					});
					$(".ui-dialog-titlebar-close").css("display", "none");
					dialog.dialog("open");
			},
			addEdge : function (data, callback) {
				var NoOfOutputs = 0;
				var NoOfInputs = 0;
				for (var element in network.body.edges) {
					if (data.from == network.body.edges[element].fromId)
						NoOfOutputs++;
					if (data.to == network.body.edges[element].toId)
						NoOfInputs++;
				};
				if (
					(network.body.nodes[data.from].options.gskExtra.MaxOutputs > NoOfOutputs)
					 &&
					(network.body.nodes[data.to].options.gskExtra.MaxInputs > NoOfInputs))
					callback(data);
				else {
					$.notify("This connection is not allowed", "warn");
					callback(null);
				}
			},
			editEdge : function (data, callback) {
				var NoOfOutputs = 0;
				var NoOfInputs = 0;
				for (var element in network.body.edges) {
					if (network.body.edges[element].id != data.id) {
						if (data.from == network.body.edges[element].fromId)
							NoOfOutputs++;
						if (data.to == network.body.edges[element].toId)
							NoOfInputs++;
					}
				};
				if (
					(network.body.nodes[data.from].options.gskExtra.MaxOutputs > NoOfOutputs)
					 &&
					(network.body.nodes[data.to].options.gskExtra.MaxInputs > NoOfInputs))
					callback(data);
				else {
					$.notify("This connection is not allowed", "warn");
					callback(null);
				}
			}
		}
	};
	network = new vis.Network(container, data, options);
	network.on('doubleClick', function (properties) {
		//console.log(properties);
		network.editNode();
		network.editEdgeMode();
		if (SimulationState == "Running")
			if (properties.nodes.length == 1)
				if (network.body.nodes[properties.nodes[0]].options.gskExtra.Tab == "Sinks")
					network.body.nodes[properties.nodes[0]].options.gskExtra.Init();
	});
}

function clearPopUp() {
	dialog.dialog("close");
}

function cancelEdit(callback) {
	clearPopUp();
	$(".ui-dialog-titlebar-close").css("display", "inline-block");
	callback(null);
}

function saveDataAndCheckEdges(data, callback) {
	saveData(data, callback);
	var NoOfOutputs = 0;
	var NoOfInputs = 0;
	var RemoveElement = false;
	for (var element in network.body.edges) {
		RemoveElement = false;
		if (network.body.edges[element].fromId == data.id) {
			NoOfOutputs++;
			if (NoOfOutputs > data.gskExtra.MaxOutputs)
				RemoveElement = true;
		}
		if (network.body.edges[element].toId == data.id) {
			NoOfInputs++;
			if (NoOfInputs > data.gskExtra.MaxInputs)
				RemoveElement = true;
		}
		if (RemoveElement)
			network.body.data.edges.remove({
				id : element
			});
	};
}

function saveData(data, callback) {
	var d = new Date();
	var n = d.getTime();
	data.gskExtra = {};
	if (CurrentTab == "Sources") {
		data.label = TempSourceNodeItem.String();
		data.shape = "image";
		data.image = TempSourceNodeItem.Image;
		data.gskExtra = CopyJSONForNodes(TempSourceNodeItem);
		data.gskExtra.MaxInputs = 0;
		data.gskExtra.MaxOutputs = Infinity;
	} else if (CurrentTab == "Sinks") {
		$("#Node" + data.id).remove();
		$("#SinksDialogs").append("<div id='Node_" + data.id + "' style='padding: 0px;' title='" + $("#SinksLabel").val() + "'><div id='Chart_" + data.id + "'></div></div>");
		var TempImgId0,
		TempImgId1;
		if ($("#SinksXAxisType").val() == "LINEAR")
			TempImgId0 = 0;
		else
			TempImgId0 = 1;
		if ($("#SinksYAxisType").val() == "LINEAR")
			TempImgId1 = 0;
		else
			TempImgId1 = 1;
		data.gskExtra = {
			Name : $("#SinksLabel").val(),
			Image : "images/tex/sinks-figure" + (TempImgId0 * 2 + TempImgId1) + ".png",
			SinksPlotType : $("#SinksPlotType").val(),
			SinksLineType : $("#SinksLineType").val(),
			SinksXAxisType : $("#SinksXAxisType").val(),
			SinksYAxisType : $("#SinksYAxisType").val(),
			MaxOutputs : 0,
			DialogDiv : "Node_" + data.id,
			ChartDiv : "Chart_" + data.id,
			DialogID : "",
			ChartID : "",
			ChartData : "",
			String : function () {
				return SinksLabel;
			},
			Init : function () {
				this.DialogID = $("#" + this.DialogDiv).dialog({
						closeOnEscape : true,
						autoOpen : false,
						height : 350,
						width : 500,
						modal : false,
						resizable : false,
					}).dialog("open");
				//Chart Initialization
				var options = {
					legend : "none",
					chartArea : {
						height : ($("#" + this.DialogDiv).height()-50),
						width : ($("#" + this.DialogDiv).width()-100),
					},
					height : $("#" + this.DialogDiv).height()-7,
					width : $("#" + this.DialogDiv).width(),
				};
				this.ChartID = new google.visualization.LineChart(document.getElementById(this.ChartDiv));
				this.ChartData = new google.visualization.DataTable();
				this.ChartData.addColumn('number', 'Time');
				this.ChartData.addColumn('number', this.Name);
				this.ChartID.draw(this.ChartData, options);
			},
			Eval : function (x) {
				return 1;
			},
		};
		if ($("#SinksPlotType").val() == "XYGRAPH")
			data.gskExtra.MaxInputs = 2;
		else
			data.gskExtra.MaxInputs = 1;
		data.label = data.gskExtra.Name;
		data.shape = "image";
		data.image = data.gskExtra.Image;
	} else if (CurrentTab == "Functions") {
		data.label = TempFunctionNodeItem.String();
		data.shape = "image";
		data.image = TempFunctionNodeItem.Image;
		data.gskExtra = CopyJSONForNodes(TempFunctionNodeItem);
		data.gskExtra.MaxInputs = 1;
		data.gskExtra.MaxOutputs = Infinity;
	} else if (CurrentTab == "Operators") {
		data.label = TempOperatorNodeItem.String();
		data.shape = "image";
		data.image = TempOperatorNodeItem.Image;
		data.gskExtra = CopyJSONForNodes(TempOperatorNodeItem);
		data.gskExtra.MaxInputs = Infinity;
		data.gskExtra.MaxOutputs = Infinity;
	} else if (CurrentTab == "TransferFunctions") {
		data.label = TempTransferFunctionNodeItem.String();
		data.shape = "image";
		data.image = TempTransferFunctionNodeItem.Image;
		data.gskExtra = CopyJSONForNodes(TempTransferFunctionNodeItem);
		data.gskExtra.MaxInputs = 1;
		data.gskExtra.MaxOutputs = Infinity;
	} else if (CurrentTab == "HardwareIOs") {
		data.label = TempHardwareIONodeItem.String();
		data.shape = "image";
		data.image = TempHardwareIONodeItem.Image;
		data.gskExtra = CopyJSONForNodes(TempHardwareIONodeItem);
	} else {
		data.label = "Error: " + n;
		data.gskExtra = {
			MaxInputs : 1,
			MaxOutputs : Infinity,
		}
	}
	data.gskExtra.Tab = CurrentTab;
	data.gskExtra.id = n;
	clearPopUp();
	callback(data);
}

function init() {
	draw();
	// set Sources Tab
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
		TempSourceNodeItem = new Object();
		TempSourceNodeItem = CopyJSONForNodes(SourcesForNode.AllSources[SourceInt]);
		for (var i = 0; i < TempSourceNodeItem.Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + TempSourceNodeItem.Parameters[i].Name + ', $' + TempSourceNodeItem.Parameters[i].LaTeX + '$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + TempSourceNodeItem.Parameters[i].Value + '" id="SourceSingnalParam' + i + '"/></div>';
			$("#SourceSingnalParams").append(TempString);
			$("#SourceSingnalParam" + i).on("change paste keyup", function () {
				TempSourceNodeItem.Parameters[parseInt(ExtractNumberAtEnd($(this)[0].id))].Value = $(this).val();
				$("#SourcesLaTeXRender").empty();
				var TempString = TempSourceNodeItem.LaTeXString();
				$("#SourcesLaTeXRender").append(TempString);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			});
		}
		$("#SourceSingnalParam0").change();
	}).change();
	// set Functions Tab
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
		TempFunctionNodeItem = new Object();
		TempFunctionNodeItem = CopyJSONForNodes(StaticMathFunctions.AllFunctions[FunctionInt]);
		for (var i = 0; i < TempFunctionNodeItem.Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + TempFunctionNodeItem.Parameters[i].Name + ', $' + TempFunctionNodeItem.Parameters[i].LaTeX + '$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + TempFunctionNodeItem.Parameters[i].Value + '" id="FunctionsParam' + i + '"/></div>';
			$("#StaticFunctionParams").append(TempString);
			$("#FunctionsParam" + i).on("change paste keyup", function () {
				TempFunctionNodeItem.Parameters[parseInt(ExtractNumberAtEnd($(this)[0].id))].Value = $(this).val();
				$("#FunctionsLaTeXRender").empty();
				var TempString = TempFunctionNodeItem.LaTeXString();
				$("#FunctionsLaTeXRender").append(TempString);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			});
		}
		$("#FunctionsParam0").change();
	}).change();
	// set Operators Tab
	var TempSelect = document.getElementById("OperatorsName");
	var TempIndex = 0;
	for (var i = 0; i < OperatorsForNode.AllOperators.length; i++) {
		TempSelect.options[TempSelect.options.length] = new Option(
				OperatorsForNode.AllOperators[i].Name, TempIndex);
		TempIndex++;
	}
	$("#OperatorsName").on("change paste keyup", function () {
		$("#OperatorParams").empty();
		var OperatorInt = parseInt($("#OperatorsName").val());
		TempOperatorNodeItem = new Object();
		TempOperatorNodeItem = CopyJSONForNodes(OperatorsForNode.AllOperators[OperatorInt]);
		var TempString = TempOperatorNodeItem.LaTeXString();
		$("#OperatorsLaTeXRender").empty();
		$("#OperatorsLaTeXRender").append(TempString);
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}).change();
	// set TransferFunctions Tab
	var TempSelect = document.getElementById("TransferFunctionsName");
	var TempIndex = 0;
	for (var i = 0; i < TransferFunctionsForNode.AllTransferFunctions.length; i++) {
		TempSelect.options[TempSelect.options.length] = new Option(
				TransferFunctionsForNode.AllTransferFunctions[i].Name, TempIndex);
		TempIndex++;
	}
	$("#TransferFunctionsName").on("change paste keyup", function () {
		$("#TransferFunctionsParams").empty();
		var TransferFunctionInt = parseInt($("#TransferFunctionsName").val());
		TempTransferFunctionNodeItem = new Object();
		TempTransferFunctionNodeItem = CopyJSONForNodes(TransferFunctionsForNode.AllTransferFunctions[TransferFunctionInt]);
		for (var i = 0; i < TempTransferFunctionNodeItem.Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + TempTransferFunctionNodeItem.Parameters[i].Name + ', $' + TempTransferFunctionNodeItem.Parameters[i].LaTeX + '$</b></label><input class="w3-input w3-border w3-border-theme" value="' + TempTransferFunctionNodeItem.Parameters[i].Value + '" id="TransferFunctionsParam' + i + '"/></div>';
			$("#TransferFunctionsParams").append(TempString);
			$("#TransferFunctionsParam" + i).on("change paste keyup", function () {
				TempTransferFunctionNodeItem.Parameters[parseInt(ExtractNumberAtEnd($(this)[0].id))].Value = $(this).val();
				$("#TransferFunctionsLaTeXRender").empty();
				var TempString = TempTransferFunctionNodeItem.LaTeXString();
				$("#TransferFunctionsLaTeXRender").append(TempString);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			});
		}
		$("#TransferFunctionsParam0").change();
	}).change();
	// set HardwareIOs Tab
	var TempSelect = document.getElementById("HardwareIOsName");
	var TempIndex = 0;
	for (var i = 0; i < HardwareIOsForNode.AllHardwareIOs.length; i++) {
		TempSelect.options[TempSelect.options.length] = new Option(
				HardwareIOsForNode.AllHardwareIOs[i].Name, TempIndex);
		TempIndex++;
	}
	$("#HardwareIOsName").on("change paste keyup", function () {
		$("#HardwareIOsParams").empty();
		var HardwareIOsInt = parseInt($("#HardwareIOsName").val());
		TempHardwareIONodeItem = new Object();
		TempHardwareIONodeItem = CopyJSONForNodes(HardwareIOsForNode.AllHardwareIOs[HardwareIOsInt]);
		for (var i = 0; i < TempHardwareIONodeItem.Parameters.length; i++) {
			var TempString = '<div class="w3-col s3 m3 l3"><label><b>' + TempHardwareIONodeItem.Parameters[i].Name + ', $' + TempHardwareIONodeItem.Parameters[i].LaTeX + '$</b></label><input class="w3-input w3-border w3-border-theme" type="number" value="' + TempHardwareIONodeItem.Parameters[i].Value + '" id="HardwareIOsParam' + i + '"/></div>';
			$("#HardwareIOsParams").append(TempString);
			$("#HardwareIOsParam" + i).on("change paste keyup", function () {
				TempHardwareIONodeItem.Parameters[parseInt(ExtractNumberAtEnd($(this)[0].id))].Value = $(this).val();
				$("#HardwareIOsNameLaTeXRender").empty();
				var TempString = TempHardwareIONodeItem.LaTeXString();
				$("#HardwareIOsNameLaTeXRender").append(TempString);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			});
		}
		$("#HardwareIOsParam0").change();
	}).change();
	google.charts.load('current', {
		'packages' : ['corechart']
	});
	//google.charts.setOnLoadCallback(drawChart);
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

function ExtractNumberAtEnd(Str) {
	var matches = Str.match(/\d+$/);
	if (matches)
		return matches[0];
	else
		return 0;
}

function CopyJSONForNodes(Source) {
	var target;
	target = JSON.parse2(JSON.stringify2(Source));
	target.Eval = Source.Eval;
	target.String = Source.String;
	target.LaTeXString = Source.LaTeXString;
	return target;
}

// Taken from https://gist.github.com/kaustubh-karkare/6065251
JSON.stringify2 = function (obj, replacer) {
	if (typeof(reviver) !== "function")
		replacer = undefined;
	var reference = [],
	replace = {};
	(function (obj) {
		if (typeof(obj) === "function" || obj === undefined)
			return;
		var i;
		// if this element is already in the reference array, return the index
		if ((i = reference.indexOf(obj)) !== -1)
			return i;
		// or else, push this element, and save the index, to be returned later
		else
			i = reference.push(obj) - 1;
		// if this is an object (exceptions: RegExp & null)
		if (obj && typeof(obj) === "object" && !(obj instanceof RegExp)) {
			var obj2 = Array.isArray(obj) ? new Array(obj.length) : {};
			// recursively process this object
			for (var key in obj)
				if (typeof(obj[key]) !== "function" && obj[key] !== undefined)
					obj2[key] = arguments.callee(obj[key]);
			// mark the original object for replacement later
			replace[i] = obj2;
		}
		return i;
	})(obj);
	// replace the original objects in the reference array
	for (var i in replace)
		reference[i] = replace[i];
	return JSON.stringify(reference, function (key, value) {
		value = (replacer ? replacer(key, value) : value);
		if (typeof(value) === "string")
			return "S" + value;
		else if (value !== value)
			return "N"; // NaN
		else if (value === Infinity)
			return "I";
		else if (value === -Infinity)
			return "i";
		else if (value instanceof RegExp)
			return "R" + value.lastIndex + "/" + (value.ignoreCase ? "i" : "") +
			(value.global ? "g" : "") + (value.multiline ? "m" : "") + "/" + value.source;
		else
			return value;
	});
};

JSON.parse2 = function (obj_str, reviver) {
	if (typeof(reviver) !== "function")
		reviver = undefined;
	var replace = {};
	var reference = JSON.parse(obj_str, function (key, value) {
			var result;
			if (typeof(value) !== "string")
				result = value;
			else if (value[0] === "R") {
				var i = value.indexOf("/"),
				j = value.indexOf("/", i + 1);
				k = new RegExp(value.substr(j + 1), value.substr(i + 1, j - i - 1));
				k.lastIndex = parseInt(value.substr(1, i - 1));
				result = k;
			} else if (value[0] === "i")
				result = -Infinity;
			else if (value[0] === "I")
				result = Infinity;
			else if (value[0] === "N")
				result = NaN;
			else if (value[0] === "S")
				result = value.substr(1);
			else
				throw new Error("Invalid Item");
			return (reviver ? reviver(key, result) : result);
		});
	return (function (obj) {
		// if the item is not an object or an array, return immediately
		if (!obj || typeof(obj) !== "object" || obj instanceof RegExp)
			return obj;
		var obj2 = Array.isArray(obj) ? new Array(obj.length) : {};
		// save a reference to new object corresponding to the index of the old one
		replace[reference.indexOf(obj)] = obj2;
		// if the item has not already been encountered, recursively process its components
		for (var key in obj)
			obj2[key] = replace[obj[key]] || arguments.callee(reference[obj[key]]);
		return obj2;
	})(reference[0]);
};

//$(".vis-manipulation").css("display", "none")
//$(".vis-edit-mode").css("display", "none")

function GetOrderOfExecution() {
	if (network != null) {
		OrderOfExecution = [];
		for (var TempEdge in network.body.edges) {
			if (
				(OrderOfExecution.indexOf(network.body.edges[TempEdge].toId) < 0) &&
				(network.body.nodes[network.body.edges[TempEdge].toId].options.gskExtra.MaxOutputs == 0))
				OrderOfExecution.push(network.body.edges[TempEdge].toId);
		}
		var TempIndex = 0;
		if (OrderOfExecution.length > 0) {
			while (true) {
				for (var TempEdge in network.body.edges) {
					if (
						(OrderOfExecution.indexOf(network.body.edges[TempEdge].fromId) < 0) &&
						(network.body.edges[TempEdge].toId == OrderOfExecution[TempIndex]))
						OrderOfExecution.push(network.body.edges[TempEdge].fromId);
				}
				TempIndex++;
				if (TempIndex >= OrderOfExecution.length)
					break;
			}
		}
	}
	OrderOfExecution.reverse();
	OrderOfExecution.forEach(function (TempNode) {
		console.log(network.body.nodes[TempNode].options.label);
	});
}
