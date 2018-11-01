var gsk_libs_sinks_linearlinear = {
	Name : "Linear vs Linear",
	Parameters : [{
			Name : "Scope type",
			Type : "ScalarOptions",
			Value : [["Time series"]],
			Options : ["Time series", "XY plot"],
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [["Scope"]]
		}, {
			Name : "X-scale",
			Type : "ScalarOptions",
			Value : [["Linear"]],
			Options : ["Linear", "Logarithmic"],
		}, {
			Name : "Y-scale",
			Type : "ScalarOptions",
			Value : [["Linear"]],
			Options : ["Linear", "Logarithmic"],
		}, {
			Name : "Title",
			Type : "ScalarText",
			Value : [["Title"]]
		}, {
			Name : "Signals legend",
			Type : "VectText",
			Value : [["Signal"]]
		}, {
			Name : "Legend colors",
			Type : "VectColor",
			Value : [["Blue"]]
		}, {
			Name : "Background color",
			Type : "ScalarColor",
			Value : [["Red"]]
		},
	],
	MaxOutTerminals : 0,
	MaxInTerminals : 1,
	DialogDiv : "Node_",
	ChartDiv : "Chart_",
	DialogID : "",
	ChartID : "",
	ChartData : "",
	InputParams : [0],
	PresentOut : [0],
	Icon : function () {
		try {
			var x = this.Parameters[2].Options.indexOf(this.Parameters[2].Value[0][0]);
			var y = this.Parameters[3].Options.indexOf(this.Parameters[3].Value[0][0]);
			return "images/tex/sinks-figure" + (x * 2 + y * 1) + ".png";
		} catch (err) {
			return;
		}
	},
	Constructor : function (data) {
		try {
			this.DialogDiv = "Node_" + data.id;
			$("#" + this.DialogDiv).remove();
			$("#GSK_HiddenForEverDIV").append("<div id='Node_" + data.id + "' style='padding: 0px;' title='" + this.Parameters[4].Value[0][0] + "'><div id='Chart_" + data.id + "'></div></div>");
		} catch (err) {
			console.log(err);
		}
	},
	Destructor : function (data) {
		$("#" + this.DialogDiv).remove();
	},
	Evaluate : function () {},
	Label : function () {
		return this.Parameters[1].Value[0][0];
	},
	Init : function () {
		this.DialogID = $("#" + this.DialogDiv).dialog({
				closeOnEscape : true,
				autoOpen : false,
				height : 350,
				width : 500,
				modal : false,
				resizable : true,
			}).dialog("open");
		//Chart Initialization
		var options = {
			legend : "none",
			chartArea : {
				height : ($("#" + this.DialogDiv).height() - 50),
				width : ($("#" + this.DialogDiv).width() - 100),
			},
			height : $("#" + this.DialogDiv).height() - 7,
			width : $("#" + this.DialogDiv).width(),
		};
		this.ChartID = new google.visualization.LineChart(document.getElementById(this.ChartDiv));
		this.ChartData = new google.visualization.DataTable();
		this.ChartData.addColumn('number', 'Time');
		this.ChartData.addColumn('number', this.Name);
		this.ChartID.draw(this.ChartData, options);
	},
	Eval : function () {
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
			legend : "none",
			chartArea : {
				height : ($("#" + this.DialogDiv).height() - 50),
				width : ($("#" + this.DialogDiv).width() - 100),
			},
			series : {
				0 : {
					lineDashStyle : LineStyle,
				}
			},
			colors : [this.SinksLineColor],
			vAxis : {
				scaleType : vAxis
			},
			hAxis : {
				scaleType : hAxis
			},
			height : $("#" + this.DialogDiv).height() - 7,
			width : $("#" + this.DialogDiv).width(),
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
	Details : function () {
		return "Port: $fff$";
	},
	ValidateParams : function () {
		return "OK";
	},
}
