gsk_libs_vOperators_multiply = {
	Name: "Multiply (Matricial)",
	Parameters: [],
	Label: function () {
		return "";
	},
	MaxInTerminals: MaxInTerminalsAllowedToUse,
	MaxOutTerminals: MaxOutTerminalsAllowedToUse,
	Icon: function () {
		return "images/tex/vOperators-figure2.png"
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
			MatrixOut = math.multiply(MatrixOut, this.InputParams[i]);
		}
		return MatrixOut;
	},
	Details: function () {
		return "Multiplies all the matricies in the order of they were connected.";
	},
	ValidateParams: function () {
		return "OK";
	},
}
