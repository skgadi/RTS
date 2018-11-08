gsk_libs_functions_concathorizontal = {
	Name: "Concatenate matrix (horizontal)",
	Parameters: [],
	Label: function () {
		return "";
	},
	MaxInTerminals: MaxInTerminalsAllowedToUse,
	MaxOutTerminals: MaxOutTerminalsAllowedToUse,
	Icon: function () {
		return "images/tex/functions-figure4.png"
	},
	Init: function () {
		this.InputParams = [];
	},
	End: function () {},
	Constructor: function (data) {},
	Destructor: function (data) {},
	RunTimeExec: function () {},
	Evaluate: function () {
		var TempMatrix = [];
		var MatrixOut = math.clone(this.InputParams[0]);
		for (var i = 1; i < this.InputParams.length; i++) {
			TempMatrix = [];
			for (var j =0; j < this.InputParams[0].length; j++) {
				if (this.InputParams[i][j] === undefined) throw "Dimension error";
				TempMatrix.push(MatrixOut[j].concat(this.InputParams[i][j]));
			}
			MatrixOut = TempMatrix;
		}
		return MatrixOut;
	},
	Details: function () {
		return "Concatenates all the matrices one besides other.";
	},
	ValidateParams: function () {
		return "OK";
	},
}
