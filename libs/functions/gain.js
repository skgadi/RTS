gsk_libs_functions_gain = {
	Name : "Gain",
	Parameters : [{
			Name : "Gain",
			Type : "ScalarComplex",
			Value : [[1]],
		},
	],
	Label : function () {
		return this.Parameters[0].Value[0][0];
	},
	MaxInTerminals : 1,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure2.png"
	},
	Init : function () {
		var Compiled_G = math.eval(this.Parameters[0].Value[0][0]);
		this.CompiledParams = [Compiled_G];
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		console.log(this.CompiledParams[0]);
		return math.dotMultiply(this.InputParams[0], this.CompiledParams[0]);
	},
	Details : function () {
		return "Adds each element.<br/>$$Y = \\prod_{i=1}^{n}{U_i}$$ <br/>where $\\prod$ performs element wise operation, $n$ is the number of inputs.<br/>Note: All inputs should be of same dimensions.";
	},
	ValidateParams : function () {
		return "OK";
	},
}
