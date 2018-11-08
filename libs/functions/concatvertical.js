gsk_libs_functions_concatvertical = {
	Name: "Concatenate matrix (vertical)",
	Parameters: [],
	Label: function () {
		return "";
	},
	MaxInTerminals: MaxInTerminalsAllowedToUse,
	MaxOutTerminals: MaxOutTerminalsAllowedToUse,
	Icon: function () {
		return "images/tex/functions-figure3.png"
	},
	Init: function () {
		this.InputParams = [];
	},
	End: function () {},
	Constructor: function (data) {},
	Destructor: function (data) {},
	RunTimeExec: function () {},
	Evaluate: function () {
		var MatrixOut = math.clone(this.InputParams[0]);
		for (var i = 1; i < this.InputParams.length; i++) {
			for (var j = 0; j < this.InputParams[i].length; j++) {
					if (MatrixOut[0].length !== this.InputParams[i][j].length) throw "Dimension error";
				MatrixOut.push(this.InputParams[i][j]);
			}
		}
		return MatrixOut;
	},
	Details: function () {
		return "Concatenates all the matrices one below other.";
	},
	ValidateParams: function () {
		return "OK";
	},
}
