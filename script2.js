var network = null;
var options;
var container;
var dialog;
var LibraryDialog;
var GSK_Data, GSK_Callback;
var SelectedLibraryBlock;
var TempSourceNodeItem, TempFunctionNodeItem, TempOperatorNodeItem, TempTransferFunctionNodeItem, TempHardwareIONodeItem;
var CurrentTab = "Sources";
var OrderOfExecution = [];
var SimulationState = "Loading";
var SimulateAtInterval;
var SimulationTime;
var SamplingTimeMs = 10;
var RefreshGraphsMS = 1000;
var MaximumNoOfPointsToShow = 300;
var MaximumFileSize = 2 * 1024 * 1024;
var ErrorReportingText = "<p>Check your internet connection and try again.</p><p>If you have tried everything, please report this at <a href='https://github.com/skgadi/RTS/issues'>github.com/skgadi/RTS/issues/</a>.</p>";

var GSK_Mandatory_Items = {
	"Name": "string",
	"Icon": "string",
	"MaxInTerminals": "number",
	"MaxOutTerminals": "number",
	"Const": "function",
	"Init": "function",
	"Eval": "function",
	"Label": "function",
	"Details": "function",
};
/*function setDefaultLocale() {
var defaultLocal = navigator.language;
var select = document.getElementById('locale');
select.selectedIndex = 0; // set fallback value
for (var i = 0, j = select.options.length; i < j; ++i) {
if (select.options[i].getAttribute('value') === defaultLocal) {
select.selectedIndex = i;
break;
}
}
}*/

function destroy() {
	if (network !== null) {
		for (var TempNode in network.body.data.nodes._data) {
			if (network.body.data.nodes._data[TempNode].gskExtra.Tab == "Sinks")
				$("#Node_" + TempNode).remove();
		}
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
	options = {
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
						$("#SinksLineColor").val(data.gskExtra.SinksLineColor);
						$("#SinksLineType").val(data.gskExtra.SinksLineType);
						$("#SinksXAxisType").val(data.gskExtra.SinksXAxisType);
						$("#SinksYAxisType").val(data.gskExtra.SinksYAxisType);
					}
				}
				dialog = $("#NodeEditor").dialog({
						dialogClass: 'noTitleStuff',
						closeOnEscape: false,
						autoOpen: false,
						height: 350,
						width: 500,
						modal: true,
						resizable: false,
						buttons: {
							"Save node": saveDataAndCheckEdges.bind(this, data, callback),
							Cancel: function () {
								cancelEdit(callback);
							}
						},
						close: function () {}
					}).dialog("open");
			},
			deleteNode: function (data, callback) {
				if (network.body.nodes[data.nodes[0]].options.gskExtra.Tab == "Sinks")
					$("#Node_" + data.nodes[0]).remove();
				//console.log(data.nodes[0]);
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
				if (
					(network.body.nodes[data.from].options.gskExtra.MaxOutputs > NoOfOutputs)
					 &&
					(network.body.nodes[data.to].options.gskExtra.MaxInputs > NoOfInputs)
					 &&
					data.from != data.to)
					callback(data);
				else {
					$.notify("This connection is not allowed", "warn");
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
		if (SimulationState == "Design") {
			if (properties.nodes.length == 1)
				network.editNode();
			else if (properties.edges.length == 1)
				network.editEdgeMode();
			else
				network.addNodeMode();
		}
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
				id: element
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
		$("#Node_" + data.id).remove();
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
			Name: $("#SinksLabel").val(),
			Image: "images/tex/sinks-figure" + (TempImgId0 * 2 + TempImgId1) + ".png",
			SinksPlotType: $("#SinksPlotType").val(),
			SinksLineColor: $("#SinksLineColor").val(),
			SinksLineType: $("#SinksLineType").val(),
			SinksXAxisType: $("#SinksXAxisType").val(),
			SinksYAxisType: $("#SinksYAxisType").val(),
			MaxOutputs: 0,
			DialogDiv: "Node_" + data.id,
			ChartDiv: "Chart_" + data.id,
			DialogID: "",
			ChartID: "",
			ChartData: "",
			InputParams: [0],
			PresentOut: [0],
			String: function () {
				return SinksLabel;
			},
			Init: function () {
				this.DialogID = $("#" + this.DialogDiv).dialog({
						closeOnEscape: true,
						autoOpen: false,
						height: 350,
						width: 500,
						modal: false,
						resizable: true,
					}).dialog("open");
				//Chart Initialization
				var options = {
					legend: "none",
					chartArea: {
						height: ($("#" + this.DialogDiv).height() - 50),
						width: ($("#" + this.DialogDiv).width() - 100),
					},
					height: $("#" + this.DialogDiv).height() - 7,
					width: $("#" + this.DialogDiv).width(),
				};
				this.ChartID = new google.visualization.LineChart(document.getElementById(this.ChartDiv));
				this.ChartData = new google.visualization.DataTable();
				this.ChartData.addColumn('number', 'Time');
				this.ChartData.addColumn('number', this.Name);
				this.ChartID.draw(this.ChartData, options);
			},
			Eval: function () {
				var hAxis,
				vAxis;
				var LineStyle = [];
				if (this.SinksXAxisType == "LOGARITHMIC")
					hAxis = 'log';
				else
					hAxis = 'linear';
				if (this.SinksYAxisType == "LOGARITHMIC")
					vAxis = 'log';
				else
					vAxis = 'linear';
				if (this.SinksLineType == "DASHED")
					LineStyle = [10, 2];
				else if (this.SinksLineType == "DOTTED")
					LineStyle = [4, 4];
				else
					LineStyle = [0];
				var options = {
					legend: "none",
					chartArea: {
						height: ($("#" + this.DialogDiv).height() - 50),
						width: ($("#" + this.DialogDiv).width() - 100),
					},
					series: {
						0: {
							lineDashStyle: LineStyle,
						}
					},
					colors: [this.SinksLineColor],
					vAxis: {
						scaleType: vAxis
					},
					hAxis: {
						scaleType: hAxis
					},
					height: $("#" + this.DialogDiv).height() - 7,
					width: $("#" + this.DialogDiv).width(),
				};
				//console.log(this.InputParams);
				if (this.ChartData.getNumberOfRows() >= MaximumNoOfPointsToShow)
					this.ChartData.removeRow(0);
				if (this.SinksPlotType == "XYGRAPH")
					this.ChartData.addRow([this.InputParams[0], this.InputParams[1]]);
				else
					this.ChartData.addRow([SimulationTime, this.InputParams[0]]);
				if ((SimulationTime * 1000) % RefreshGraphsMS == 0)
					this.ChartID.draw(this.ChartData, options);
				return [0];
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
			MaxInputs: 1,
			MaxOutputs: Infinity,
		}
	}
	data.gskExtra.Tab = CurrentTab;
	data.gskExtra.id = n;
	clearPopUp();
	callback(data);
}
var TempValue;
function init() {
	$.getScript('libs/libs.js')
	.done(function (script, textStatus, jqxhr) {
		try {
			for (var TempTabs in gsk_libs) {
				$("#GSK_Lib_Head").append("<button style='width:" + Math.round(100000 / Object.keys(gsk_libs).length) / 1000 + "%; padding: 0px;' class='w3-bar-item w3-button w3-hover-yellow LibraryTabLink' onclick=\"SelectLibraryTab(event,\'" + TempTabs + "\') \" title='" + gsk_libs[TempTabs].Name + "'> <img src='" + gsk_libs[TempTabs].Icon + "' style='width: 100%;'/></button>");
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

	// Handle loading files to open
	$('form input').change(function (event) {
		$('form p').html("Loading the file<br/><b><i>" + this.files[0].name + "</i></b>.<br/>Please wait ...");
		if (this.files[0].size > MaximumFileSize)
			$('form p').html($('form p').html() + "<br/>This file is too big, select another file.");
		else {
			readFileContent(this.files[0]).then(content => {
				var TempData = JSON.parse2(content);
				var TempNodes = [];
				var TempEdges = [];
				for (var TempNode in TempData.nodes._data)
					TempNodes[TempNodes.length] = JSON.parse2(JSON.stringify2(TempData.nodes._data[TempNode]));
				for (var TempEdge in TempData.edges._data)
					TempEdges[TempEdges.length] = JSON.parse2(JSON.stringify2(TempData.edges._data[TempEdge]));
				console.log(TempNodes);
				console.log(TempEdges);
				var NewData = {
					nodes: new vis.DataSet(TempNodes),
					edges: new vis.DataSet(TempEdges),
				};
				console.log(NewData);
				draw(NewData);
				$("#OpenFileDialog").dialog("close");
			}).catch (error => $('form p').html($('form p').html() + "<br/>Unable to load the file."))
		}
		$('form input').val("");
	});
	init();
});

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
		if (SimulateAtInterval != undefined)
			clearInterval(SimulateAtInterval);
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

function SetGUIState(State) {
	switch (State) {
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
		$.getScript('libs/' + TabId + '/' + TabId + '.js')
		.done(function (script, textStatus, jqxhr) {
			try {
				gsk_libs[TabId].Loaded = true;
				AddLibraryTabMainSelect(TabId);
				SetGUIState("ResumeGUIDialog");
			} catch (err) {
				$("#LibraryContent").append("<p>Error in resolving <b><i>libs/" + TabId + "/" + TabId + ".js</i></b>.</p>" + ErrorReportingText);
				SetGUIState("ResumeGUIDialog");
			}
		})
		.fail(function (jqxhr, settings, exception, TempTabId = TabId) {
			$("#LibraryContent").append("<p>Error in loading <b><i>libs/" + TabId + "/" + TabId + ".js</i></b>.</p>" + ErrorReportingText);
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
}

function PrepareAndAddBlock(Block) {
	if (eval("typeof " + $(Block).attr('GSK_Var')) === 'undefined') {
		$.getScript($(Block).attr('GSK_File'))
		.done(function (script, textStatus, jqxhr, TempFileToLoad = $(Block).attr('GSK_File'), TempLoadedVar = $(Block).attr('GSK_Var')) {
			try {
				ValidateAndAddBlock(TempLoadedVar);
			} catch (err) {
				$.notify("Error in processing " + TempFileToLoad + ".", "error");
			}
		})
		.fail(function (jqxhr, settings, exception, TempFileToLoad = $(Block).attr('GSK_File')) {
			$.notify("Error in loading " + TempFileToLoad + ".", "error");
		});
	} else
		ValidateAndAddBlock($(Block).attr('GSK_Var'));

}

function ValidateAndAddBlock(BlockInfo) {
	var IsValid = true;
	for (TempBlockItem in GSK_Mandatory_Items) {
		console.log();
		if (typeof eval(BlockInfo)[TempBlockItem] !== GSK_Mandatory_Items[TempBlockItem]) {
			console.log('Unable to find ' + TempBlockItem + ' as a ' + GSK_Mandatory_Items[TempBlockItem] + ' in ' + BlockInfo + '.');
			IsValid = false;
		}
	}
	if (IsValid)
		AddABlockToNetwork(BlockInfo);
	else
		$.notify("Error in validating " + BlockInfo + ".", "error");
}

function AddABlockToNetwork(BlockInfo) {
	GSK_Data.gskExtra = CopyJSONForBlocks(eval(BlockInfo));
	GSK_Data.label = GSK_Data.gskExtra.Label();
	GSK_Data.shape = "image";
	GSK_Data.image = GSK_Data.gskExtra.Icon;
	GSK_Callback(GSK_Data);
	LibraryDialog.dialog("close");

}

function PrepareLibBlockParams() {
	/*try {
	var TempLibPath = $("#TypeOfFunctions option:selected").val().split("_");
	SelectedLibraryBlock = CopyJSONForBlocks(eval("gsk_libs_" + TempLibPath[0] + "_" + TempLibPath[1]));
	$("#TypeOfFunctionsIcon").append("<label><b>Icon</b></label><img src=' " + SelectedLibraryBlock.Icon + " ' alt=' " + SelectedLibraryBlock.Name + " ' style=' max - height: 37px;
	max - width: 100 % ;
	'>");
	for (var i = 0; i < SelectedLibraryBlock.Parameters.length; i++) {
	if (SelectedLibraryBlock.Parameters[i].Type === "Number") {
	$("#LibraryBlockParams").append("<div class=' w3 - col s4 m4 l4 '> <label><b>" + SelectedLibraryBlock.Parameters[i].Name + "</b></label> <input class=' w3 - input w3 - border w3 - border - theme ' GSKParamType=' " + SelectedLibraryBlock.Parameters[i].Type + " ' GSKValid=' true ' GSKParamNum=' " + i + " ' value=' " + SelectedLibraryBlock.Parameters[i].Value + " ' id=' gsk_ " + TempLibPath[0] + " _ " + TempLibPath[1] + " _ " + i + " ' onchange=' ValidateInputFor(this)'/></div>");
	}
	}
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	} catch (err) {
	var TempLibPath = $("#TypeOfFunctions option:selected").val().split("_");
	$("#LibraryBlockMoreInformation").append("<p>Error in resolving <b><i>libs/" + TempLibPath[0] + "/" + TempLibPath[1] + ".js</i></b>.</p>" + ErrorReportingText);
	SetGUIState("ResumeGUIDialog");
	console.log(err);
	}*/
}

function ValidateInputFor(InputItem) {
	InputItem = $(InputItem);
	var TempValid = "false";
	switch (InputItem.attr("GSKParamType")) {
	case "Number":
		if (!isNaN(InputItem.val())) {
			TempValid = "true";
			InputItem.addClass("w3-border-theme").removeClass("w3-border-red");
		} else
			InputItem.addClass("w3-border-red").removeClass("w3-border-theme");
		break;
	}
	InputItem.attr("GSKValid", TempValid);
}

function ExtractNumberAtEnd(Str) {
	var matches = Str.match(/\d+$/);
	if (matches)
		return matches[0];
	else
		return 0;
}

function GenJSONFuncsForNodes(TabName, ItemName) {
	/*switch(TabName) {
	case "Sources":{}
	}
	Source.Init = */
}
function CopyJSONForBlocks(Source) {
	var target;
	target = JSON.parse2(JSON.stringify2(Source));
	for (var TempObject in Source) {
		if (typeof Source[TempObject] === "function") {
			target[TempObject] = Source[TempObject];
		}
	}
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
	/*OrderOfExecution.forEach(function (TempNode) {
	console.log(network.body.nodes[TempNode].options.label);
	});*/
}

function SetProperView() {
	if (SimulationState == "Loading") {
		$(".GSKShowWhenLoading").css("display", "block");
		$(".GSKShowWhenLoaded").css("display", "none");
	}
	if (SimulationState == "Design") {
		$(".GSKShowWhenLoading").css("display", "none");
		$(".GSKShowWhenLoaded").css("display", "block");
		$("#Simulate").html("<i class=' fas fa - play '></i>");
		network.enableEditMode()
		$(".vis-edit-mode").css("display", "block");
		$(".FileHandling").css("display", "block");
	}
	if (SimulationState == "Running") {
		$(".GSKShowWhenLoading").css("display", "none");
		$(".GSKShowWhenLoaded").css("display", "block");
		$("#Simulate").html("<i class=' fas fa - stop '></i>");
		network.disableEditMode();
		$(".vis-edit-mode").css("display", "none");
		$(".FileHandling").css("display", "none");

	}
}

function SetViewAsLoaded() {
	SimulationState = "Design";
	SetProperView();
}

function SetViewAsSimulating() {
	SimulationState = "Running";
	SetProperView();
}

function RunSimulation() {
	GetOrderOfExecution();
	if (OrderOfExecution.length > 0) {
		for (var i = 0; i < OrderOfExecution.length; i++) {
			//console.log(network.body.nodes[OrderOfExecution[i]]);
			network.body.nodes[OrderOfExecution[i]].options.gskExtra.Init();
		}
		SimulationTime = 0;
		SimulateAtInterval = setInterval(ExecuteFunctions, SamplingTimeMs);
	} else {
		$.notify("There is nothing to simulate", "warn");
		SetViewAsLoaded();
	}
}

function ExecuteFunctions() {
	for (var i = 0; i < OrderOfExecution.length; i++) {
		var TempArrayIndex = 0;
		network.body.nodes[OrderOfExecution[i]].edges.forEach(function (TempEdge) {
			if (TempEdge.toId == OrderOfExecution[i]) {
				network.body.nodes[OrderOfExecution[i]].options.gskExtra.InputParams[TempArrayIndex] = network.body.nodes[TempEdge.fromId].options.gskExtra.PresentOut;
				TempArrayIndex++;
			}
		});
		network.body.nodes[OrderOfExecution[i]].options.gskExtra.PresentOut = parseFloat(network.body.nodes[OrderOfExecution[i]].options.gskExtra.Eval());
	}
	SimulationTime = parseFloat((SimulationTime + SamplingTimeMs / 1000).toFixed(3))
}

function PrepareNetworkToDownload() {
	var blob = new Blob([JSON.stringify2(network.body.data)], {
			type: "application/json"
		});
	saveAs(blob, "hello world.JSON");
}

function readFileContent(file) {
	const reader = new FileReader()
		return new Promise((resolve, reject) => {
			reader.onload = event => resolve(event.target.result)
				reader.onerror = error => reject(error)
				reader.readAsText(file)
		})
}
