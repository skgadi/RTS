gsk_libs_functions_gain = {
	Name : "Gain",
	Parameters : [{
			Name : "Gain $(g)$",
			Type : "ScalarComplex",
			Value : [[1]],
		},
	],
	Label : function () {
		return ""+this.Parameters[0].Value[0][0];
	},
	MaxInTerminals : 1,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure2.png"
	},
	Init : function () {
		var Compiled_G = math.eval(this.Parameters[0].Value[0][0]);
		this.CompiledParams = [Compiled_G];
		this.InputParams = [];
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		return math.dotMultiply(this.InputParams[0], this.CompiledParams[0]);
	},
	Details : function () {
		return "$$Y=gU$$";
	},
	ValidateParams : function () {
		return "OK";
	},
}
