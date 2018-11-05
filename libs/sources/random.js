gsk_libs_sources_random = {
	Name : "Random",
	Parameters : [{
			Name : "No of rows",
			Type : "ScalarInteger",
			Value : [[1]]
		}, {
			Name : "No of columns",
			Type : "ScalarInteger",
			Value : [[1]]
		}, {
			Name : "Min value",
			Type : "ScalarReal",
			Value : [[0]]
		}, {
			Name : "Max value",
			Type : "ScalarReal",
			Value : [[1]]
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [["Random"]]
		},
	],
	Label : function () {
		return this.Parameters[4].Value[0][0];
	},
	MaxInTerminals : 0,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/sources-figure6.png"
	},
	Init : function () {
		var Compiled_R = math.eval(this.Parameters[0].Value[0][0]);
		var Compiled_C = math.eval(this.Parameters[1].Value[0][0]);
		var Compiled_Min = math.eval(this.Parameters[2].Value[0][0]);
		var Compiled_Max = math.eval(this.Parameters[3].Value[0][0]);
		this.CompiledParams = [Compiled_R, Compiled_C, Compiled_Min, Compiled_Max];
		this.PresentOut = math.zeros(Compiled_R, Compiled_C)._data;
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		return math.random([this.CompiledParams[0], this.CompiledParams[1]], this.CompiledParams[2], this.CompiledParams[3]);
	},
	Details : function () {
		var ValidateText = this.ValidateParams();
		if (ValidateText === 'OK') {
			return "Displays random number of order $" + math.eval(this.Parameters[0].Value[0][0]) + " \\times " + math.eval(this.Parameters[1].Value[0][0]) + "$ in the range of (" + math.eval(this.Parameters[2].Value[0][0]) + ", " + math.eval(this.Parameters[3].Value[0][0]) + ")";
		} else return 'Error:<br/>' + ValidateText;
	},
	ValidateParams : function () {
		if (math.eval(this.Parameters[0].Value[0][0]) < 1) return "Number of rows cannot be less than 1";
		if (math.eval(this.Parameters[1].Value[0][0]) < 1) return "Number of columns cannot be less than 1";
		if (math.eval(this.Parameters[2].Value[0][0]) >= math.eval(this.Parameters[3].Value[0][0])) return "Minimum value and maximum values are not apropriate.";
		return "OK";
	},
}
