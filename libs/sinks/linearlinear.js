var gsk_libs_sinks_linearlinear = {
	Name : "Linear vs Linear",
	Parameters : [{
			Name : "Scope type",
			Type : "ScalarOptions",
			Value : [["Time series"]],
			Options : ["Time series", "XY plot"],
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
			Name : "Label",
			Type : "ScalarText",
			Value : [["Scope"]]
		}, {
			Name : "Title",
			Type : "ScalarText",
			Value : [["Title"]]
		}, {
			Name : "Background color",
			Type : "ScalarColor",
			Value : [["White"]]
		}, {
			Name : "Legend titles",
			Type : "VectText",
			Value : [["Signal"]]
		}, {
			Name : "Legend colors",
			Type : "VectColor",
			Value : [["Blue"]]
		}, {
			Name : "Handling numbers",
			Type : "ScalarOptions",
			Value : [["Show real"]],
			Options : ["Show real", "Show imaginary", "Both"],
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
			var x = this.Parameters[1].Options.indexOf(this.Parameters[1].Value[0][0]);
			var y = this.Parameters[2].Options.indexOf(this.Parameters[2].Value[0][0]);
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
			$("#GSK_HiddenForEverDIV").append("<div id='Node_" + data.id + "' style='padding: 0px; background: " + this.Parameters[5].Value[0][0] + "' title='" + this.Parameters[4].Value[0][0] + "'><div id='Chart_" + data.id + "'></div></div>");
		} catch (err) {
			console.log(err);
		}
	},
	Destructor : function (data) {
		$("#" + this.DialogDiv).remove();
	},
	Label : function () {
		return this.Parameters[3].Value[0][0];
	},
	Init : function () {
		this.DialogID = $("#" + this.DialogDiv).dialog({
				closeOnEscape : true,
				autoOpen : false,
				height : 300,
				width : 800,
				modal : false,
				resizable : true,
			}).dialog("open");
		//Chart Initialization
		var TempXAxisType,
		TempYAxisType;
		(this.Parameters[1].Value[0][0] === "Linear") ? (TempXAxisType = "linear") : (TempXAxisType = "log");
		(this.Parameters[2].Value[0][0] === "Linear") ? (TempYAxisType = "linear") : (TempYAxisType = "log");
		var TempLineStyle;
		var TempSeries = [];
		this.ChartData = new google.visualization.DataTable();
		if (this.Parameters[0].Value[0][0] === "Time series")
			this.ChartData.addColumn('number', 'Time');
		for (var i = 0; i < this.Parameters[6].Value.length; i++) {
			this.ChartData.addColumn('number', this.Parameters[6].Value[i][0]);
			TempLineStyle = {
				lineDashStyle : [0],
				color : this.Parameters[7].Value[i][0],
			};
			TempSeries.push(TempLineStyle);
			if (this.Parameters[8].Value[0][0] == "Both") {
				this.ChartData.addColumn('number', "Re:" + this.Parameters[6].Value[i][0]);
				TempLineStyle = {
					lineDashStyle : [4, 4],
					color : this.Parameters[7].Value[i][0],
					visibleInLegend : false
				};
				TempSeries.push(TempLineStyle);
			}
		}
		this.ChartOptions = {
			legend : "in",
			chartArea : {
				right : 0,
				top : 10,
				left : 60,
				bottom : 20,
				height : ($("#" + this.DialogDiv).height() - 50),
				width : ($("#" + this.DialogDiv).width() - 200),
			},
			hAxis : {
				scaleType : TempXAxisType
			},
			vAxis : {
				scaleType : TempYAxisType,
				format : '0.0E0',
			},
			series : TempSeries,
			height : $("#" + this.DialogDiv).height() - 7,
			backgroundColor : {
				fill : 'transparent'
			},
		};
		this.ChartID = new google.visualization.LineChart(document.getElementById(this.ChartDiv));
		this.ChartID.draw(this.ChartData, this.ChartOptions);
	},
	End : function () {
		this.ChartID.draw(this.ChartData, this.ChartOptions);
		this.ChartID = null;
		this.ChartData = null;
	},
	Evaluate : function () {
		var TempRow = [];
		var TempIndex = 0;
		var TempInputParams = this.InputParams[0];
		if (this.Parameters[0].Value[0][0] == "Time series")
			TempRow.push(SimulationTime);
		for (var i = 0; i < TempInputParams.length; i++) {
			for (var j = 0; j < TempInputParams[0].length; j++) {
				switch (this.Parameters[8].Value[0][0]) {
				case "Both":
					TempRow.push(math.complex(TempInputParams[i][j]).re);
				case "Show imaginary":
					TempRow.push(math.complex(TempInputParams[i][j]).im);
					break;
				case "Show real":
					TempRow.push(math.complex(TempInputParams[i][j]).re);
					break;
				}
				TempIndex++;
				if (TempIndex === this.Parameters[6].Value.length) {
					i = TempInputParams.length;
					j = TempInputParams[0].length;
				}
			}
		}
		while (TempIndex !== this.Parameters[6].Value.length) {
			TempRow.push(NaN);
			if (this.Parameters[8].Value[0][0] === "Both")
				TempRow.push(NaN);
			TempIndex++;
		}
		this.ChartData.addRow(TempRow);
		if ((SimulationTime * 1000) % RefreshGraphsMS == 0)
			this.ChartID.draw(this.ChartData, this.ChartOptions);
		return [0];
	},
	Details : function () {
		var ValidateText = this.ValidateParams();
		var TempStr = "";
		for (var i = 0; i < this.Parameters.length; i++) {
			TempStr += "<b>" + this.Parameters[i].Name + ":</b> ";
			TempStr += this.Parameters[i].Value.toString();
			TempStr += ";";
		}
		TempStr += "<br/><br/><b>Status:</b> " + ValidateText + ";";
		return TempStr;
	},
	ValidateParams : function () {
		// if xy, should be minimum 2
		if (this.Parameters[6].Value.length !== this.Parameters[7].Value.length)
			return "The number legend titles and legend colors are not equal";
		if ((this.Parameters[0].Value[0][0] === "XY plot") && (this.Parameters[6].Value.length < 2))
			return "For a XY plot there should be a minimum of two inputs. Please update the legend titles and legend colors";
		return "OK";
	},
}
