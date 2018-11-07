gsk_libs_settings_timing = {
	Name: "Unit delay",
	Parameters: [{
			Name: "Simulation duration (s)",
			Type: "ScalarReal",
			Value: [[5]],
		}, {
			Name: "Sampling time (ms)",
			Type: "ScalarReal",
			Value: [[10]],
		},
	],
	Label: function () {
		return "Timing settings";
	},
	FirstInExecutionOrder: true,
	MaxInTerminals: 0,
	MaxOutTerminals: 0,
	Icon: function () {
		return "images/tex/settings-figure0.png"
	},
	Init: function () {
		RunSimulationForS = math.eval(this.Parameters[0].Value[0][0]);
		SamplingTimeMs = math.eval(this.Parameters[1].Value[0][0]);
	},
	End: function () {},
	Constructor: function (data) {},
	Destructor: function (data) {},
	RunTimeExec: function () {},
	Evaluate: function () {},
	Details: function () {
		var StrOut;
		if ((StrOut = this.ValidateParams()) === "OK") {
			StrOut = "Allows to update the timing settings.";
			if (math.eval(this.Parameters[0].Value[0][0]) < 1)
				StrOut += "<br/>Simulation duration: Infinite";
			else
				StrOut += "<br/>Simulation duration: " + math.eval(this.Parameters[0].Value[0][0]) + " seconds";
			StrOut += "<br/>Sampling time: " + math.eval(this.Parameters[1].Value[0][0]) + " milliseconds";
		}
		return StrOut;
	},
	ValidateParams: function () {
		if (math.eval(this.Parameters[1].Value[0][0]) <= 0)
			return "Sampling time should be positive";
		return "OK";
	},
}
