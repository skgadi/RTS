gsk_libs_functions_inverse = {
	Name : "Inverse",
	Parameters : [],
	Label : function () {
		return "";
	},
	MaxInTerminals : 1,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure6.png"
	},
	Init : function () {
		this.InputParams = [];
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		try {
			return math.inv(this.InputParams[0]);
		} catch (err) {
			$.notify("Error: " + err, "error");
			throw err;
		}
	},
	Details : function () {
		return "$$Y = U^{-1}$$";
	},
	ValidateParams : function () {
		return "OK";
	},
}
