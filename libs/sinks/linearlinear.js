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
	DialogDiv : null,
	ChartDiv : null,
	DialogID : null,
	ChartID : null,
	ChartData : null,
	InputParams : null,
	PresentOut : null,
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
			this.ChartDiv = "Chart_" + data.id;
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
		var TempXAxisType,
		TempYAxisType;
		(this.Parameters[2].Value[0][0] === "Linear") ? (TempXAxisType = "linear") : (TempXAxisType = "log");
		(this.Parameters[3].Value[0][0] === "Linear") ? (TempYAxisType = "linear") : (TempYAxisType = "log");
		var TempLineStyle;
		var TempColors = [];
		var TempSeries = [];
		this.ChartData = new google.visualization.DataTable();
		if (this.Parameters[0].Value[0][0] === "Time series") this.ChartData.addColumn('number', 'Time');
		for (var i=0; i < this.Parameters[5].Value.length; i++) {
			TempColors.push(this.Parameters[6].Value[i][0]);
			TempColors.push(this.Parameters[6].Value[i][0]);
			this.ChartData.addColumn('number', "Re: " + this.Parameters[5].Value[i][0]);
			this.ChartData.addColumn('number', "Img: " + this.Parameters[5].Value[i][0]);
			TempLineStyle = {
				lineDashStyle : [0],
			};
			TempSeries[2*i] = TempLineStyle;
			TempLineStyle = {
				lineDashStyle : [4, 4],
			};
			TempSeries[2*i+1] = TempLineStyle;
		}
		var options = {
			legend : "right",
			chartArea : {
				height : ($("#" + this.DialogDiv).height() - 50),
			},
			colors : TempColors,
			hAxis : {
				scaleType : TempXAxisType
			},
			vAxis : {
				scaleType : TempYAxisType
			},
			series: TempSeries,

			height : $("#" + this.DialogDiv).height() - 7,
			width : $("#" + this.DialogDiv).width(),
		};
		this.ChartID = new google.visualization.LineChart(document.getElementById(this.ChartDiv));
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
		// if xy, should be minimum 2
		return "OK";
	},
}
