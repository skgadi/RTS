gsk_libs_functions_dotmultiply = {
	Name : "Dot multiply",
	Parameters : [],
	Label : function () {
		return "";
	},
	MaxInTerminals : MaxInTerminalsAllowedToUse,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure1.png"
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
				OutMatrix = math.multiply(OutMatrix, this.InputParams[i]);
		}
		return OutMatrix;
	},
	Details : function () {
		return "Adds each element.<br/>$$Y = \\prod_{i=1}^{n}{U_i}$$ <br/>where $\\prod$ performs element wise operation, $n$ is the number of inputs.<br/>Note: All inputs should be of same dimensions.";
	},
	ValidateParams : function () {
		return "OK";
	},
}
