gsk_libs_settings_graphs = {
	Name: "Unit delay",
	Parameters: [{
			Name: "Number of points to display",
			Type: "ScalarInteger",
			Value: [[300]],
		}, {
			Name: "Refresh graphs interval (ms)",
			Type: "ScalarInteger",
			Value: [[500]],
		},
	],
	Label: function () {
		return "Graph settings";
	},
	FirstInExecutionOrder: true,
	MaxInTerminals: 0,
	MaxOutTerminals: 0,
	Icon: function () {
		return "images/tex/settings-figure1.png"
	},
	Init: function () {
		MaximumNoOfPointsToShow = math.eval(this.Parameters[0].Value[0][0]);
		RefreshGraphsMS = math.eval(this.Parameters[1].Value[0][0]);
	},
	End: function () {},
	Constructor: function (data) {},
	Destructor: function (data) {},
	RunTimeExec: function () {},
	Evaluate: function () {},
	Details: function () {
		var StrOut;
		if ((StrOut = this.ValidateParams()) === "OK") {
			StrOut = "Allows to update the graph settings.";
			StrOut += "<br/>Display graph up to data length: " + math.eval(this.Parameters[0].Value[0][0]) + " points.";
			StrOut += "<br/>Refresh the graph for every " + math.eval(this.Parameters[1].Value[0][0]) + " milliseconds";
		}
		return StrOut;
	},
	ValidateParams: function () {
		if (math.eval(this.Parameters[0].Value[0][0]) <= 0) return "Number of points to display in a graph should be a positive integer.";
		if (math.eval(this.Parameters[1].Value[0][0]) <= 0) return "Refresh graph interval should be a positive integer.";
		return "OK";
	},
}
