var network = null;
var NetworkOptions;
var container;
var dialog;
var LibraryDialog, ParametersEditorDialog;
var GSK_BtnsForParametersEditorDialog, GSK_BtnsForMatrixEditorForParamsDialog;
var GSK_MatrixEditor;
var GSK_Data, GSK_Callback, GSK_Data_ExtrasCopy;
var showInterval = false;
var SelectedLibraryBlock;
var TempSourceNodeItem, TempFunctionNodeItem, TempOperatorNodeItem, TempTransferFunctionNodeItem, TempHardwareIONodeItem;
var CurrentTab = "Sources";
var OrderOfExecution = [];
var SimulationState = "Loading";
var SimulateAtInterval;
var SimulationTime;
var SamplingTimeMs = 10;
var RefreshGraphsMS = 500;
var MaximumNoOfPointsToShow = 300;
var MaximumFileSize = 2 * 1024 * 1024;
var RunSimulationForS = 5;
var LoadByIgnoringCache;
var MaxInTerminalsAllowedToUse = 99999;
var MaxOutTerminalsAllowedToUse = 99999;
var ShowNodeFocusOptions = {
	scale: 5,
	offset: {
		x: 0,
		y: 0
	},
	animation: {
		duration: 1000,
		easingFunction: "easeInOutQuad"
	}
};
var ErrorReportingText = "<p>Check your internet connection and try again.</p><p>If you have tried everything, please report this at <a href='https://github.com/skgadi/RTS/issues'>github.com/skgadi/RTS/issues/</a>.</p>";
GSK_Colors = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro', 'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed ', 'Indigo ', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen',
]
var GSK_Parameter_Types = {
	"ScalarOptions": {
		"Size": "Scalar",
		"Type": "Options",
	},
	"VectOptions": {
		"Size": "Vector",
		"Type": "Options",
	},
	/*"MatOptions" : {
	"Size" : "Matrix",
	"Type" : "Options",
	},*/
	"ScalarInteger": {
		"Size": "Scalar",
		"Type": "Integer",
	},
	"VectInteger": {
		"Size": "Vector",
		"Type": "Integer",
	},
	"MatInteger": {
		"Size": "Matrix",
		"Type": "Integer",
	},
	"ScalarReal": {
		"Size": "Scalar",
		"Type": "Real",
	},
	"VectReal": {
		"Size": "Vector",
		"Type": "Real",
	},
	"MatReal": {
		"Size": "Matrix",
		"Type": "Real",
	},
	"ScalarComplex": {
		"Size": "Scalar",
		"Type": "Complex",
	},
	"VectComplex": {
		"Size": "Vector",
		"Type": "Complex",
	},
	"MatComplex": {
		"Size": "Matrix",
		"Type": "Complex",
	},
	"ScalarText": {
		"Size": "Scalar",
		"Type": "Text",
	},
	"VectText": {
		"Size": "Vector",
		"Type": "Text",
	},
	"MatText": {
		"Size": "Matrix",
		"Type": "Text",
	},
	"ScalarColor": {
		"Size": "Scalar",
		"Type": "Color",
	},
	"VectColor": {
		"Size": "Vector",
		"Type": "Color",
	},
	/*"MatColor" : {
	"Size" : "Matrix",
	"Type" : "Color",
	},*/
};
var GSK_Mandatory_Items = {
	"Constructor": "function",
	"Destructor": "function",
	"Details": "function",
	"End": "function",
	"Evaluate": "function",
	"Init": "function",
	"Label": "function",
	"MaxInTerminals": "number",
	"MaxOutTerminals": "number",
	"Name": "string",
	"Parameters": "object",
	"RunTimeExec": "function",
	"ValidateParams": "function",
};

function destroy() {
	if (network !== null) {
		for (TempBlockID in network.body.data.nodes._data)
			network.body.data.nodes._data[TempBlockID].gskExtra.Destructor();
		network.destroy();
		network = null;
	}
}
function ResetNetwork() {
	destroy();
	var data;
	draw(data);
}
function draw(data) {
	// create a network
	container = document.getElementById('mynetwork');
	NetworkOptions = {
		locale: "gsk",
		locales: {
			"gsk": {
				edit: 'Edit',
				del: 'Delete selected',
				back: 'Back',
				addNode: 'Add block',
				addEdge: 'New connection',
				editNode: 'Edit block',
				editEdge: 'Edit connection',
				addDescription: 'Click in an empty space to place a new block.',
				edgeDescription: 'Click on a block and drag the connection to another block to connect them.',
				editEdgeDescription: 'Click on the control points and drag them to a block to connect to it.',
				createEdgeError: 'Cannot connect to a cluster.',
				deleteClusterError: 'Clusters cannot be deleted.',
				editClusterError: 'Clusters cannot be edited.'
			}
		},
		interaction: {
			navigationButtons: true,
			keyboard: false,
		},
		nodes: {
			shape: 'box',
			color: {
				border: '#000000',
				background: "#ffffff",
			},
			font: {
				color: '#000000',
			},
		},
		edges: {
			color: {
				color: '#000000',
			},
			arrows: {
				to: {
					enabled: true,
					scaleFactor: 1,
					type: 'arrow'
				}
			},
		},
		physics: {
			enabled: true,
			solver: 'barnesHut',
			barnesHut: {
				centralGravity: 0,
				springLength: 0,
				avoidOverlap: 1,
				damping: 1,
				springConstant: 0.00,
				gravitationalConstant: -1,
			},
			forceAtlas2Based: {
				springLength: 50,
				springConstant: 0,
				avoidOverlap: 1,
				centralGravity: 0.00,
				gravitationalConstant: -1
			},
		},
		manipulation: {
			initiallyActive: true,
			addNode: function (data, callback) {
				GSK_Data = data;
				GSK_Callback = callback;
				LibraryDialog.dialog("open");
			},
			editNode: function (data, callback) {
				GSK_Data = data;
				GSK_Callback = callback;
				PrepareParamsEditor();
			},
			deleteNode: function (data, callback) {
				network.body.nodes[data.nodes[0]].options.gskExtra.Destructor(data);
				callback(data);
			},
			addEdge: function (data, callback) {
				var NoOfOutputs = 0;
				var NoOfInputs = 0;
				for (var element in network.body.edges) {
					if (data.from == network.body.edges[element].fromId)
						NoOfOutputs++;
					if (data.to == network.body.edges[element].toId)
						NoOfInputs++;
				};
				var TempIsValidNewEdge = true;
				var TempErrorMessage = "";
				if (NoOfOutputs >= network.body.nodes[data.from].options.gskExtra.MaxOutTerminals) {
					TempIsValidNewEdge = false;
					TempErrorMessage += "\nThe origin block cannot generate more output.";
				}
				if (NoOfInputs >= network.body.nodes[data.to].options.gskExtra.MaxInTerminals) {
					TempIsValidNewEdge = false;
					TempErrorMessage += "\nThe destination block cannot take more inputs.";
				}
				if (data.from === data.to) {
					TempIsValidNewEdge = false;
					TempErrorMessage += "\nYou cannot connect the same block to itself. Use an unit gain instead.";
				}
				data.label = "" + (NoOfInputs + 1);
				if (TempIsValidNewEdge)
					callback(data);
				else {
					$.notify("This connection is not allowed:" + TempErrorMessage, "error");
					callback(null);
				}
			},
			editEdge: function (data, callback) {
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
					(network.body.nodes[data.from].options.gskExtra.MaxOutTerminals > NoOfOutputs)
					 &&
					(network.body.nodes[data.to].options.gskExtra.MaxInTerminals > NoOfInputs))
					callback(data);
				else {
					$.notify("This connection is not allowed", "warn");
					callback(null);
				}
			}
		}
	};
	network = new vis.Network(container, data, NetworkOptions);
	network.on('doubleClick', function (properties) {
		if (SimulationState === "Design") {
			if (properties.nodes.length == 1)
				network.editNode();
			else if (properties.edges.length == 1)
				network.editEdgeMode();
			else
				network.addNodeMode();
		}
		if ((SimulationState === "Running") && (properties.nodes.length == 1))
			network.body.nodes[properties.nodes[0]].options.gskExtra.RunTimeExec();
	});
}

function init() {
	LoadByIgnoringCache = "?cache=" + (new Date()).UniqueMSNumber();
	$.getScript('libs/libs.js' + LoadByIgnoringCache)
	.done(function (script, textStatus, jqxhr) {
		try {
			for (var TempTabs in gsk_libs) {
				$("#GSK_Lib_Head").append("<button style='border: 2px black dashed; width:" + Math.round(100000 / Object.keys(gsk_libs).length) / 1000 + "%; padding: 0px;' class='w3-bar-item w3-button w3-hover-yellow LibraryTabLink' onclick=\"SelectLibraryTab(event,\'" + TempTabs + "\') \" title='" + gsk_libs[TempTabs].Name + "'> <img src='" + gsk_libs[TempTabs].Icon + "' style='height: 2em;'/></button>");
			}
			LibraryDialog = $("#GSK_Library").dialog({
					closeOnEscape: true,
					autoOpen: false,
					height: 400,
					width: 500,
					modal: true,
					resizable: false,
					open: function () {
						$(".ui-dialog").css("padding", "0px");
						$(".ui-dialog-buttonpane").css("padding", "0px").css("margin", "0px");
						SetGUIState("DisableLibraryAddButton");
					},
					close: function (event, ui) {
						GSK_Callback(null);
					}
				});
			ParametersEditorDialog = $("#GSK_Params_Editor").dialog({
					closeOnEscape: false,
					autoOpen: false,
					height: 400,
					width: 500,
					modal: true,
					resizable: false,
					open: function () {
						$(".ui-dialog").css("padding", "0px");
						$(".ui-dialog-buttonpane").css("padding", "0px").css("margin", "0px");
						SetGUIState("DisableLibraryAddButton");
					},
					close: function (event, ui) {
						GSK_Callback(null);
					}
				});
		} catch (err) {
			$("#GSKShowInitProgress").append("<p>Error in resolving <b><i>libs/libs.js</i></b>.</p>" + ErrorReportingText);
		}
	})
	.fail(function (jqxhr, settings, exception) {
		$("#GSKShowInitProgress").append("<p>Error in loading <b><i>libs/libs.js</i></b>.</p>" + ErrorReportingText);
		return;
	});
	ResetNetwork();
	google.charts.load('current', {
		'packages': ['corechart']
	});
	google.charts.setOnLoadCallback(SetViewAsLoaded);
}

$(document).ready(function () {
	//MathJax setup
	MathJax.Hub.Config({
		menuSettings: {
			inTabOrder: false
		},
		extensions: ["tex2jax.js"],
		jax: ["input/TeX", "output/HTML-CSS"],
		tex2jax: {
			inlineMath: [["$", "$"], ["\\(", "\\)"]]
		}
	});
	/*window.onbeforeunload = (function () {
	return true;
	});*/
	//Handsontable validator for complex number
	(function (Handsontable) {
		function GSK_Cell_ValidateInteger(query, callback) {
			try {
				((typeof math.eval(query) === 'number') && (math.eval(query) % 1 === 0)) ? callback(true) : callback(false);
			} catch (err) {
				callback(false);
			}
		}
		function GSK_Cell_ValidateReal(query, callback) {
			try {
				(typeof math.eval(query) === 'number') ? callback(true) : callback(false);
			} catch (err) {
				callback(false);
			}
		}
		function GSK_Cell_ValidateComplex(query, callback) {
			try {
				((math.eval(query).type === 'Complex') || (typeof math.eval(query) === 'number')) ? callback(true) : callback(false);
			} catch (err) {
				callback(false);
			}
		}
		function GSK_Cell_ValidateText(query, callback) {
			if (query === "" || query === null)
				callback(false);
			else
				callback(true);
		}
		function GSK_Cell_ValidateColor(query, callback) {
			if (query === "" || query === null)
				callback(false);
			else
				callback(true);
		}
		function GSK_Cell_ValidateOption(query, callback) {
			if (query === "" || query === null)
				callback(false);
			else
				callback(true);
		}

		Handsontable.validators.registerValidator('my.Integer', GSK_Cell_ValidateInteger);
		Handsontable.validators.registerValidator('my.Real', GSK_Cell_ValidateReal);
		Handsontable.validators.registerValidator('my.Complex', GSK_Cell_ValidateComplex);
		Handsontable.validators.registerValidator('my.Text', GSK_Cell_ValidateText);
		Handsontable.validators.registerValidator('my.Color', GSK_Cell_ValidateColor);
		Handsontable.validators.registerValidator('my.Options', GSK_Cell_ValidateOption);
	})(Handsontable);
	// Handle loading files to open
	$('form input').change(function (event) {
		$('form p').html("Loading the file<br/><b><i>" + this.files[0].name + "</i></b>.<br/>Please wait ...");
		if (this.files[0].size > MaximumFileSize)
			$('form p').html($('form p').html() + "<br/>This file is too big, select another file.");
		else {
			readFileContent(this.files[0]).then(content => {
				var TempData = Flatted.parse(content);
				var NewData = {
					nodes: getNodeData(TempData),
					edges: getEdgeData(TempData),
				};
				draw(NewData);
				PrepareNetworkAfterOpenAction();
				$("#OpenFileDialog").dialog("close");
			}).catch (error => $('form p').html($('form p').html() + "<br/>Unable to load the selected file."));
		}
		$('form input').val("");
	});
	$("#ToolbarDragging").draggable({
		handle: ".ToolbarDraggingHandle",
		snap: "body",
		containment: "body"
	});
	init();
});
function getNodeData(data) {
	var networkNodes = [];
	data.forEach(function (elem, index, array) {
		if (typeof elem.image === "undefined") {
			networkNodes.push({
				id: elem.id,
				label: elem.label,
				x: elem.x,
				y: elem.y,
				gskExtra: elem.gskExtra
			});
		} else {
			networkNodes.push({
				id: elem.id,
				label: elem.label,
				x: elem.x,
				y: elem.y,
				shape: "image",
				image: elem.image,
				gskExtra: elem.gskExtra
			});
		}
	});

	return new vis.DataSet(networkNodes);
}
function getNodeById(data, id) {
	for (var n = 0; n < data.length; n++) {
		if (data[n].id == id) { // double equals since id can be numeric or string
			return data[n];
		}
	};

	throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
	var networkEdges = [];
	data.forEach(function (node) {
		// add the connection
		node.connections.forEach(function (connId, cIndex, conns) {
			networkEdges.push({
				from: node.id,
				to: connId
			});
			let cNode = getNodeById(data, connId);

			var elementConnections = cNode.connections;

			// remove the connection from the other node to prevent duplicate connections
			var duplicateIndex = elementConnections.findIndex(function (connection) {
					return connection == node.id; // double equals since id can be numeric or string
				});

			if (duplicateIndex != -1) {
				elementConnections.splice(duplicateIndex, 1);
			};
		});
	});
	return new vis.DataSet(networkEdges);
}
function objectToArray(obj) {
	return Object.keys(obj).map(function (key) {
		obj[key].id = key;
		return obj[key];
	});
}

function addConnections(elem, index) {
	// need to replace this with a tree of the network, then get child direct children of the element
	elem.connections = network.getConnectedNodes(elem.id);
}

function addGSKExtras(elem, index) {
	elem.label = network.body.data.nodes._data[elem.id].label;
	if (typeof network.body.data.nodes._data[elem.id].image !== "undefined")
		elem.image = network.body.data.nodes._data[elem.id].image;
	elem.gskExtra = network.body.data.nodes._data[elem.id].gskExtra;
}

function CreateNewFile() {
	$("#ConfirmRemoveNetwork").dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		buttons: {
			"Delete this network": function () {
				ResetNetwork();
				$(this).dialog("close");
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		}
	}).dialog("open");
}
function ConfirmOpenFile() {
	$("#ConfirmRemoveNetwork").dialog({
		resizable: false,
		height: "auto",
		width: 400,
		modal: true,
		buttons: {
			"Delete this network": function () {
				ResetNetwork();
				$(this).dialog("close");
				OpenAFile();
			},
			Cancel: function () {
				$(this).dialog("close");
			}
		}
	}).dialog("open");
}

function OpenAFile() {
	$("#OpenFileDialog").dialog({
		height: "auto",
		height: 300,
		width: 400,
		modal: true,
		/*buttons : {
		"Open selected" : function () {

		$(this).dialog("close");
		},
		Cancel : function () {
		$(this).dialog("close");
		}
		}*/
	}).dialog("open");
	$('form p').text("Drag your file here or click in this area.");
}

function SimulateTheNetwork() {
	if (SimulationState == "Running") {
		if (SimulateAtInterval != undefined) {
			clearInterval(SimulateAtInterval);
		}
		if (OrderOfExecution.length > 0) {
			for (var i = 0; i < OrderOfExecution.length; i++) {
				network.body.nodes[OrderOfExecution[i]].options.gskExtra.End();
			}
		}
		SetViewAsLoaded();
	} else if (SimulationState == "Design") {
		SetViewAsSimulating();
		RunSimulation();
	}
}

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

function SetViewAsLoading() {
	SimulationState = "Loading";
	SetGUIState("LoadingSimulationState");
}

function SetViewAsLoaded() {
	SimulationState = "Design";
	SetGUIState("DesignSimulationState");
}

function SetViewAsSimulating() {
	SimulationState = "Running";
	SetGUIState("RunningSimulationState");
}

function SetGUIState(State) {
	switch (State) {
	case "ShowingExectionOrder":
		$("#BtnExecOrderDisplay").html("<i class='far fa-eye-slash'></i>");
		break;
	case "NotShowingExectionOrder":
		$("#BtnExecOrderDisplay").html("<i class='far fa-eye'></i>");
		break;
	case "LoadingSimulationState":
		$(".GSKShowWhenLoading").css("display", "block");
		$(".GSKShowWhenLoaded").css("display", "none");
		break;
	case "DesignSimulationState":
		$(".GSKShowWhenLoading").css("display", "none");
		$(".GSKShowWhenLoaded").css("display", "block");
		$("#Simulate").html("<i class='fas fa-play'></i>");
		network.enableEditMode()
		$(".vis-edit-mode").css("display", "block");
		$(".NetworkManuplation").css("display", "block");
		break;
	case "RunningSimulationState":
		$(".GSKShowWhenLoading").css("display", "none");
		$(".GSKShowWhenLoaded").css("display", "block");
		$("#Simulate").html("<i class='fas fa-stop'></i>");
		network.disableEditMode();
		$(".vis-edit-mode").css("display", "none");
		$(".NetworkManuplation").css("display", "none");
		break;
	case "DisableLibraryAddButton":
		$(".ui-dialog-buttonpane button:contains('Add block')").button("disable");
		$(".ui-dialog-buttonpane button:contains('Modify block')").button("disable");
		break;
	case "EnableLibraryAddButton":
		$(".ui-dialog-buttonpane button:contains('Add block')").button("enable");
		$(".ui-dialog-buttonpane button:contains('Modify block')").button("enable");
		break;
	case "SuspendGUIDialog":
		$(".ui-dialog *").attr("disabled", true);
		$(".LoadingAnimation").css('height', "2px");
		break;
	case "ResumeGUIDialog":
		$(".ui-dialog *").attr("disabled", false);
		$(".LoadingAnimation").css('height', "0px");
		break;
	case "SetMatrixEditorForParamsDialog":
		$("#GSK_Params_Mtx_Editor").css("display", "block");
		$("#GSK_Params_Items").css("display", "none");
		$("#GSK_Params_Edt_Details").css("display", "none");
		ParametersEditorDialog.dialog('option', 'buttons', GSK_BtnsForMatrixEditorForParamsDialog);
		break;
	case "RemoveMatrixEditorForParamsDialog":
		$("#GSK_Params_Mtx_Editor").css("display", "none");
		$("#GSK_Params_Items").css("display", "block");
		$("#GSK_Params_Edt_Details").css("display", "block");
		ParametersEditorDialog.dialog('option', 'buttons', GSK_BtnsForParametersEditorDialog);
		ParametersEditorDialog.dialog('widget').find('.ui-dialog-title').html(((typeof GSK_Data_ExtrasCopy.Icon !== 'undefined') ? ("<img style='height: 2em;' src='" + GSK_Data_ExtrasCopy.Icon() + "'/> ") : ("")) + GSK_Data_ExtrasCopy.Label());
		$("#GSK_Params_Edt_Details").empty();
		$("#GSK_Params_Edt_Details").append("<label><b>Details</b></label>");
		$("#GSK_Params_Edt_Details").append("<div>" + GSK_Data_ExtrasCopy.Details() + "</div>");
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		break;
	}
}

function SelectLibraryTab(evt, TabId) {
	//Set GUI state
	SetGUIState("DisableLibraryAddButton");
	//TabColoring and opening
	var LibTabLinks;
	x = document.getElementsByClassName("LibraryTab");
	LibTabLinks = document.getElementsByClassName("LibraryTabLink");
	for (var i = 0; i < LibTabLinks.length; i++) {
		LibTabLinks[i].className = LibTabLinks[i].className.replace(" w3-red", "");
	}
	evt.currentTarget.className += " w3-red";
	//Generating parameters
	$("#GSK_Lib_Functions").empty();
	if (gsk_libs[TabId].Loaded != true) {
		SetGUIState("SuspendGUIDialog");
		$.getScript('libs/' + TabId + '/' + TabId + '.js' + LoadByIgnoringCache)
		.done(function (script, textStatus, jqxhr, TempTabId = TabId) {
			try {
				gsk_libs[TempTabId].Loaded = true;
				AddLibraryTabMainSelect(TempTabId);
				SetGUIState("ResumeGUIDialog");
			} catch (err) {
				$("#LibraryContent").append("<p>Error in resolving <b><i>libs/" + TempTabId + "/" + TempTabId + ".js</i></b>.</p>" + ErrorReportingText);
				SetGUIState("ResumeGUIDialog");
			}
		})
		.fail(function (jqxhr, settings, exception, TempTabId = TabId) {
			$("#LibraryContent").append("<p>Error in loading <b><i>libs/" + TempTabId + "/" + TempTabId + ".js</i></b>.</p>" + ErrorReportingText);
			SetGUIState("ResumeGUIDialog");
			return;
		});
	} else
		AddLibraryTabMainSelect(TabId);
}

function AddLibraryTabMainSelect(TabId) {
	for (var TempBlock in eval("gsk_libs_" + TabId)) {
		$("#GSK_Lib_Functions").append("<div class='w3-col s2 m2 l2 w3-padding w3-button' title='" + eval("gsk_libs_" + TabId)[TempBlock].Name + "' GSK_File = 'libs/" + TabId + "/" + TempBlock + ".js' GSK_Var = 'gsk_libs_" + TabId + "_" + TempBlock + "' onclick = 'PrepareAndAddBlock(this)'><img src='" + eval("gsk_libs_" + TabId)[TempBlock].Icon + "' style='width:100%'></div>");
	}
	LibraryDialog.dialog('option', 'title', "Library > " + gsk_libs[TabId].Name);
}

function PrepareAndAddBlock(Block) {
	if (eval("typeof " + $(Block).attr('GSK_Var')) === 'undefined') {
		$.getScript($(Block).attr('GSK_File') + LoadByIgnoringCache)
		.done(function (script, textStatus, jqxhr, TempBlock = Block) {
			ValidateAndAddBlock(TempBlock);
		})
		.fail(function (jqxhr, settings, exception, TempFileToLoad = $(Block).attr('GSK_File')) {
			$.notify("Error in loading " + TempFileToLoad + ".", "error");
		});
	} else
		ValidateAndAddBlock(Block);

}

function ValidateAndAddBlock(Block) {
	try {
		var IsValid = true;
		for (TempBlockItem in GSK_Mandatory_Items) {
			if (typeof eval($(Block).attr('GSK_Var'))[TempBlockItem] !== GSK_Mandatory_Items[TempBlockItem]) {
				IsValid = false;
				console.log("Unable to load the mandatory " + GSK_Mandatory_Items[TempBlockItem] + " from the member " + TempBlockItem);
			}
		}
		if (IsValid)
			AddABlockToNetwork(Block);
		else {
			$.notify("Error in validating " + $(Block).attr('GSK_Var') + ".", "error");
		}
	} catch (err) {
		console.log(err);
		$.notify("Error in processing " + $(Block).attr('GSK_Var') + ".", "error");
	}
}

function AddABlockToNetwork(Block) {
	GSK_Data.gskExtra = CopyJSONForBlocks(eval($(Block).attr('GSK_Var')));
	GSK_Data.gskExtra.FileName = $(Block).attr('GSK_File');
	GSK_Data.gskExtra.VarName = $(Block).attr('GSK_Var');
	GSK_Data.gskExtra.InputParams = [];
	GSK_Data.gskExtra.PresentOut = [];
	GSK_Data.label = GSK_Data.gskExtra.Label();
	if (typeof GSK_Data.gskExtra.Icon !== 'undefined') {
		if (typeof GSK_Data.gskExtra.Icon() === 'string') {
			GSK_Data.image = GSK_Data.gskExtra.Icon();
			GSK_Data.shape = "image";
		}
	}
	GSK_Data.gskExtra.Constructor(GSK_Data);
	GSK_Callback(GSK_Data);
	LibraryDialog.dialog("close");

}

function PrepareParamsEditor() {
	try {
		GSK_BtnsForParametersEditorDialog = {
			"Update block": function () {
				GSK_ParamsValidationText = GSK_Data_ExtrasCopy.ValidateParams();
				if (GSK_ParamsValidationText === "OK") {
					GSK_Data.gskExtra.Parameters = GSK_Data_ExtrasCopy.Parameters;
					GSK_Data.label = GSK_Data.gskExtra.Label();
					if (typeof GSK_Data.gskExtra.Icon !== 'undefined') {
						if (typeof GSK_Data.gskExtra.Icon() === 'string') {
							GSK_Data.image = GSK_Data.gskExtra.Icon();
							GSK_Data.shape = "image";
						}
					} else if (typeof GSK_Data.shape !== 'undefined')
						delete GSK_Data.shape;
					GSK_Data.gskExtra.Constructor(GSK_Data);
					GSK_Callback(GSK_Data);
					ParametersEditorDialog.dialog("close");
				} else
					$.notify("Unable to validate the parameters.\nPlease correct the parameters.\nDetails:\n" + GSK_ParamsValidationText, "error");
			},
			Cancel: function () {
				ParametersEditorDialog.dialog("close");
			}
		};
		GSK_Data_ExtrasCopy = CopyJSONForBlocks(GSK_Data.gskExtra);
		$("#GSK_Params_Items").empty();
		$("#GSK_Params_Edt_Details").empty();
		$("#GSK_Params_Mtx_Editor").empty();
		for (var i = 0; i < GSK_Data_ExtrasCopy.Parameters.length; i++) {
			if (i % 3 === 0)
				$("#GSK_Params_Items").append("<div class='w3-row'>");
			$("#GSK_Params_Items").append("<div class=' w3-col s4 m4 l4'><button class='w3-left-align w3-button w3-block w3-white w3-border w3-border-theme w3-ripple' style='padding: 0.25em;' GSKParamType='" + GSK_Data_ExtrasCopy.Parameters[i].Type + "' GSKValid=' true ' GSKParamNum='" + i + "' onclick='PrepareMatrixToEditAParam(this)'>" + GSK_Data_ExtrasCopy.Parameters[i].Name + "<i class='fas fa-pencil-alt w3-right' style='font-size: 0.5em'></i></button></div>");
			if (i % 3 === 0)
				$("#GSK_Params_Items").append("</div>");
		}
		SetGUIState("RemoveMatrixEditorForParamsDialog");
		ParametersEditorDialog.dialog("open");
	} catch (err) {
		$.notify("Unable to prepare this block for editing.\n Recommendation: Delete this block and report author(s) of this block.", "error");
		console.log(err);
		GSK_Callback(null);
	}
}

var OpenOperationLoadingFilesIndex = 0;
function PrepareNetworkAfterOpenAction() {
	Object.keys(network.body.data.nodes._data);
	if (OpenOperationLoadingFilesIndex === Object.keys(network.body.data.nodes._data).length) {
		OpenOperationLoadingFilesIndex = 0;
		SetViewAsLoaded();
		network.fit();
	} else {
		SetViewAsLoading();
		GSK_Data = network.body.data.nodes._data[Object.keys(network.body.data.nodes._data)[OpenOperationLoadingFilesIndex]];
		if (eval("typeof " + GSK_Data.gskExtra.VarName + " === 'undefined'")) {
			$.getScript(GSK_Data.gskExtra.FileName + LoadByIgnoringCache)
			.done(function (script, textStatus, jqxhr) {
				LoadABlockFromOpenFileContext();
			})
			.fail(function (jqxhr, settings, exception) {
				$.notify("Error in loading " + GSK_Data.gskExtra.FileName + ".", "error");
			});
		} else {
			LoadABlockFromOpenFileContext();
		}
	}
}

function LoadABlockFromOpenFileContext() {
	CopyFuncsToBlock(eval(GSK_Data.gskExtra.VarName), GSK_Data.gskExtra);
	GSK_Data.gskExtra.Constructor(GSK_Data);
	network.manipulation.body.data.nodes.getDataSet().update(GSK_Data);
	OpenOperationLoadingFilesIndex++;
	PrepareNetworkAfterOpenAction();
}

function PrepareMatrixToEditAParam(InputItem) {
	InputItem = $(InputItem);
	$('#GSK_Params_Mtx_Editor').empty();

	var TempParamItem = GSK_Data_ExtrasCopy.Parameters[parseInt(InputItem.attr("GSKParamNum"))];
	var TempSpreadSheetSettings = {
		data: Flatted.parse(Flatted.stringify(TempParamItem.Value)),
		rowHeaders: true,
		colHeaders: function (col) {
			return (col + 1);
		},
		manualRowMove: true,
		manualColumnMove: true,
		manualRowResize: true,
		manualColumnResize: true,
		contextMenu: true,
		"allowInvalid": false,
		"allowEmpty": false,
	};
	var TempValidatorText = "my." + GSK_Parameter_Types[TempParamItem.Type].Type;
	switch (GSK_Parameter_Types[TempParamItem.Type].Size) {
	case "Scalar":
		TempSpreadSheetSettings.maxRows = 1;
		TempSpreadSheetSettings.maxCols = 1;
		TempSpreadSheetSettings.colWidths = [400];
		break;
	case "Vector":
		TempSpreadSheetSettings.maxCols = 1;
		TempSpreadSheetSettings.colWidths = [400];
		break;
	}
	switch (GSK_Parameter_Types[TempParamItem.Type].Type) {
	case "Color":
		TempSpreadSheetSettings.columns = [{
				type: 'dropdown',
				source: GSK_Colors,
			}
		];
		break;
	case "Options":
		TempSpreadSheetSettings.columns = [{
				type: 'dropdown',
				source: TempParamItem.Options,
			}
		];
		break;
	}
	GSK_MatrixEditor = new Handsontable(document.getElementById('GSK_Params_Mtx_Editor'), TempSpreadSheetSettings);

	GSK_BtnsForMatrixEditorForParamsDialog = {
		"Row +": function () {
			GSK_MatrixEditor.alter('insert_row');
		},
		"Row -": function () {
			if (GSK_MatrixEditor.countRows() > 1)
				GSK_MatrixEditor.alter('remove_row');
		},
		"Column +": function () {
			GSK_MatrixEditor.alter('insert_col');
		},
		"Column -": function () {
			if (GSK_MatrixEditor.countCols() > 1)
				GSK_MatrixEditor.alter('remove_col');
		},
		"Update variable": function () {
			var TempTableData = GSK_MatrixEditor.getData();
			for (var i = 0; i < TempTableData.length; i++) {
				for (var j = 0; j < TempTableData[0].length; j++) {
					GSK_MatrixEditor.setCellMeta(i, j, 'validator', TempValidatorText);
				}
			}
			GSK_MatrixEditor.validateCells(function () {
				var TempIsValid = true;
				for (var i = 0; i < TempTableData.length; i++) {
					for (var j = 0; j < TempTableData[0].length; j++) {
						if (!GSK_MatrixEditor.getCellMeta(i, j).valid) {
							TempIsValid = false;
							break;
						}
					}
				}
				if (TempIsValid) {
					TempParamItem.Value = Flatted.parse(Flatted.stringify(GSK_MatrixEditor.getData()));
					SetGUIState("RemoveMatrixEditorForParamsDialog");
				} else
					$.notify("Error in validating user input. Please correct the red cells.", "error");
			});
		},
		"Back": function () {
			SetGUIState("RemoveMatrixEditorForParamsDialog");
		}
	};
	SetGUIState("SetMatrixEditorForParamsDialog");
	ParametersEditorDialog.dialog('widget').find('.ui-dialog-title').html(((typeof GSK_Data_ExtrasCopy.Icon !== 'undefined') ? ("<img style='height: 2em;' src='" + GSK_Data_ExtrasCopy.Icon() + "'/> ") : ("")) + GSK_Data_ExtrasCopy.Label() + " > " + TempParamItem.Name + " | <i style='border: 1pt black solid; background: yellow'>&lt;" + GSK_Parameter_Types[TempParamItem.Type].Type + ", " + GSK_Parameter_Types[TempParamItem.Type].Size + "&gt;</i>");
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function CopyFuncsToBlock(FromBlock, ToBlock) {
	for (var TempObject in FromBlock) {
		if (typeof FromBlock[TempObject] === "function") {
			ToBlock[TempObject] = FromBlock[TempObject];
		}
	}
}

function CopyJSONForBlocks(Source) {
	var target;
	target = Flatted.parse(Flatted.stringify(Source));
	CopyFuncsToBlock(Source, target);
	return target;
}

function GetOrderOfExecution() {
	if (network != null) {
		var TempOrderOfExecution = [];
		for (var TempEdge in network.body.edges) {
			if (
				(TempOrderOfExecution.indexOf(network.body.edges[TempEdge].toId) < 0) &&
				(network.body.nodes[network.body.edges[TempEdge].toId].options.gskExtra.MaxOutTerminals === 0))
				TempOrderOfExecution.push(network.body.edges[TempEdge].toId);
		}
		var TempIndex = 0;
		if (TempOrderOfExecution.length > 0) {
			while (true) {
				for (var TempEdge in network.body.edges) {
					if (
						(TempOrderOfExecution.indexOf(network.body.edges[TempEdge].fromId) < 0) &&
						(network.body.edges[TempEdge].toId == TempOrderOfExecution[TempIndex]))
						TempOrderOfExecution.push(network.body.edges[TempEdge].fromId);
				}
				TempIndex++;
				if (TempIndex >= TempOrderOfExecution.length)
					break;
			}
		}
	}
	//Finding all the sources.
	OrderOfExecution = [];
	for (var i = 0; i < TempOrderOfExecution.length; i++) {
		if (network.body.nodes[TempOrderOfExecution[i]].options.gskExtra.MaxInTerminals === 0) {
			OrderOfExecution.push(TempOrderOfExecution[i]);
		}
	}
	//Removing sources from the TempOrderOfExecution
	for (var i = 0; i < OrderOfExecution.length; i++) {
		var TempIndexOfFoundItem;
		if ((TempIndexOfFoundItem = TempOrderOfExecution.indexOf(OrderOfExecution[i])) >= 0)
			TempOrderOfExecution.splice(TempIndexOfFoundItem, 1);
	}
	//Add forward path blocks
	var TempFeedBackBlocks = [];
	var CursorOfSearch = 0;
	while (true) {
		network.body.nodes[OrderOfExecution[CursorOfSearch]].edges.forEach(function (TempEdgeOfItem) {
			var TempIndexOfFoundItem;
			if (
				(TempEdgeOfItem.to.id !== OrderOfExecution[CursorOfSearch])
				 && ((TempIndexOfFoundItem = TempOrderOfExecution.indexOf(TempEdgeOfItem.to.id)) >= 0)) {
				var IsForwardBlock = true;
				network.body.nodes[TempEdgeOfItem.to.id].edges.forEach(function (TempEdgeToTest) {
					if (OrderOfExecution.indexOf(TempEdgeToTest.to.id) >= 0)
						IsForwardBlock = false;
				});
				if (IsForwardBlock) {
					OrderOfExecution.push(TempEdgeOfItem.to.id);
					TempOrderOfExecution.splice(TempIndexOfFoundItem, 1);
				} else {
					TempFeedBackBlocks.push(TempEdgeOfItem.to.id);
					TempOrderOfExecution.splice(TempIndexOfFoundItem, 1);
				}
			}
		});
		if (TempOrderOfExecution.length === 0)
			break;
		CursorOfSearch++;
	}
	//Add feedback blocks
	CursorOfSearch = 0;
	while (true) {
		network.body.nodes[OrderOfExecution[CursorOfSearch]].edges.forEach(function (TempEdgeOfItem) {
			var TempIndexOfFoundItem;
			if (
				(TempEdgeOfItem.to.id !== OrderOfExecution[CursorOfSearch])
				 && ((TempIndexOfFoundItem = TempFeedBackBlocks.indexOf(TempEdgeOfItem.to.id)) >= 0)) {
				OrderOfExecution.push(TempEdgeOfItem.to.id);
				TempFeedBackBlocks.splice(TempIndexOfFoundItem, 1);
			}
		});
		if (TempFeedBackBlocks.length === 0)
			break;
		CursorOfSearch++;
	}
}

function RunSimulation() {
	GetOrderOfExecution();
	if (OrderOfExecution.length > 0) {
		var i;
		try {
			for (i = 0; i < OrderOfExecution.length; i++) {
				network.body.nodes[OrderOfExecution[i]].options.gskExtra.Init();
				if (network.body.nodes[OrderOfExecution[i]].options.gskExtra.PresentOut.length === 0) {}
			}
			SimulationTime = 0;
			SimulateAtInterval = setInterval(ExecuteFunctions, SamplingTimeMs);
		} catch (err) {
			network.focus(OrderOfExecution[i], ShowNodeFocusOptions);
			$.notify("Error in simulating this network.", "error");
			console.log(err);
			SimulateTheNetwork();
		}
	} else {
		$.notify("There is nothing to simulate", "warn");
		SetViewAsLoaded();
	}
}

function ExecuteFunctions() {
	var i;
	try {
		for (i = 0; i < OrderOfExecution.length; i++) {
			network.body.nodes[OrderOfExecution[i]].options.gskExtra.InputParams = [];
			network.body.nodes[OrderOfExecution[i]].edges.forEach(function (TempEdge) {
				if (TempEdge.toId == OrderOfExecution[i]) {
					/*console.log(network.body.nodes[OrderOfExecution[i]].options.gskExtra.Name+" ... is receiving ...")
					console.log(network.body.nodes[TempEdge.fromId].options.gskExtra.Name);
					console.log(network.body.nodes[TempEdge.fromId].options.gskExtra.PresentOut);*/
					network.body.nodes[OrderOfExecution[i]].options.gskExtra.InputParams.push(network.body.nodes[TempEdge.fromId].options.gskExtra.PresentOut);
				}
			});
			network.body.nodes[OrderOfExecution[i]].options.gskExtra.PresentOut = network.body.nodes[OrderOfExecution[i]].options.gskExtra.Evaluate();
			//network.body.nodes[OrderOfExecution[i]].options.gskExtra.PresentOut = math.clone(network.body.nodes[OrderOfExecution[i]].options.gskExtra.Evaluate());
			console.log("Evaluated :" + network.body.nodes[OrderOfExecution[i]].options.gskExtra.Name);
			for (var j = 0; j < OrderOfExecution.length; j++) {
				console.log("Name: " + network.body.nodes[OrderOfExecution[j]].options.gskExtra.Name);
				console.log("Name: " + network.body.nodes[OrderOfExecution[j]].options.gskExtra.PresentOut);
			}
			console.log("------------------"); /**/
		}
		if ((RunSimulationForS > 0) && (SimulationTime >= RunSimulationForS))
			SimulateTheNetwork();
		SimulationTime = math.round(SimulationTime + SamplingTimeMs / 1000, 3);
	} catch (err) {
		network.focus(OrderOfExecution[i], ShowNodeFocusOptions);
		$.notify("Error in simulating this network.", "error");
		console.log(err);
		SimulateTheNetwork();
	}
}

Date.prototype.FileFormat = function () {
	return "GSK_" + this.getFullYear() + this.getMonth() + this.getDay() + this.getHours() + this.getMinutes() + this.getSeconds() + this.getMilliseconds() + ".rts";
}

Date.prototype.UniqueMSNumber = function () {
	return "" + this.getFullYear() + this.getMonth() + this.getDay() + this.getHours() + this.getMinutes() + this.getSeconds() + this.getMilliseconds();
}

function PrepareNetworkToDownload() {
	var TempFileToSave = objectToArray(network.getPositions());
	TempFileToSave.forEach(addConnections);
	TempFileToSave.forEach(addGSKExtras);
	var blob = new Blob([Flatted.stringify(TempFileToSave)], {
			type: "application/json"
		});
	saveAs(blob, (new Date()).FileFormat());
}

function readFileContent(file) {
	const reader = new FileReader()
		return new Promise((resolve, reject) => {
			reader.onload = event => resolve(event.target.result)
				reader.onerror = error => reject(error)
				reader.readAsText(file)
		})
}

var FocusAllTheNodesIndex = 0;
var FocusAllTheNodesInterval;
var IsShowingTheNodes = false;
function FocusAllNodes() {
	if (IsShowingTheNodes === false) {
		SetGUIState("ShowingExectionOrder");
		GetOrderOfExecution();
		if (OrderOfExecution.length !== 0) {
			network.fit({
				animation: {
					duration: 1000,
					easingFunction: "easeInOutQuad",
				}
			});
			setTimeout(function () {
				network.fit({
					nodes: OrderOfExecution,
					animation: {
						duration: 1000,
						easingFunction: "easeInOutQuad",
					}
				});
			}, 1000);
			FocusAllTheNodesInterval = setInterval(FocusANode, 3000);
			IsShowingTheNodes = true;
		} else {
			FocusAllTheNodesIndex = 0;
			$.notify("There are no connections to simulate.", "error");
		}
	} else {
		clearInterval(FocusAllTheNodesInterval);
		FocusAllTheNodesIndex = 0;
		IsShowingTheNodes = false;
		SetGUIState("NotShowingExectionOrder");
	}
}

function FocusANode() {
	if (FocusAllTheNodesIndex === OrderOfExecution.length) {
		FocusAllTheNodesIndex = 0;
		FocusAllNodes();
		network.fit({
			animation: {
				duration: 1000,
				easingFunction: "easeInOutQuad",
			}
		});
	} else {
		nodeId = OrderOfExecution[FocusAllTheNodesIndex];
		network.focus(nodeId, ShowNodeFocusOptions);
		setTimeout(function () {
			network.fit({
				nodes: OrderOfExecution,
				animation: {
					duration: 1000,
					easingFunction: "easeInOutQuad",
				}
			});
		}, 1000);
		FocusAllTheNodesIndex++;
	}
}
