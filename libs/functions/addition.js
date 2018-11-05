gsk_libs_functions_addition = {
	Name : "Addition",
	Parameters : [],
	Label : function () {
		return "";
	},
	MaxInTerminals : MaxInTerminalsAllowedToUse,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure0.png"
	},
	Init : function () {},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		var OutMatrix = this.InputParams[0];
		if (this.InputParams.length > 1) {
			for (var i = 1; i < this.InputParams.length; i++)
				OutMatrix = math.add(OutMatrix, this.InputParams[i]);
		}
		return OutMatrix;
	},
	Details : function () {
		return "Adds each element.<br/>$$Y = \\sum_{i=1}^{n}{U_i}$$ <br/>where $n$ is the number of inputs.<br/>Note: All inputs should be of same dimensions.";
	},
	ValidateParams : function () {
		return "OK";
	},
}
