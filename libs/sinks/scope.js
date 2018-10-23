{
	Name: "Scope",
	Image: "images/tex/sinks-figure0.png",
	Parameters: [{
			Name: "X-Axis type",
			LaTeX: "",
			type: "Options",
			Options: { {
					Linear: "Linear"
				}, {
					Log: "Logarithmic"
				},
			},
		}, {
			Name: "Y-Axis type",
			LaTeX: "",
			type: "Options",
			Options: { {
					Linear: "Linear"
				}, {
					Log: "Logarithmic"
				},
			},
		},
	],
	MaxOutputs: 0,
	MaxInputs: 1,
	DialogDiv: "Node_",
	ChartDiv: "Chart_",
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
	LaTeXString: function () {
		return "Port: $fff$";
	},

}
