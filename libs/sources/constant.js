gsk_libs_sources_constant = {
	Name : "Constant",
	Parameters : [{
			Name : "Constant $(C)$",
			Type : "MatComplex",
			Value : [[1]]
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [["Constant"]]
		},
	],
	Label : function () {
		return this.Parameters[1].Value[0][0];
	},
	MaxInTerminals : 0,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/sources-figure5.png"
	},
	Init : function () {
		var Compiled_C = []
		for (var i = 0; i < this.Parameters[0].Value.length; i++) {
			var Temp_C = [];
			for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
				Temp_C.push(math.eval(this.Parameters[0].Value[i][j]));
			}
			Compiled_C.push(Temp_C);
		}
		this.CompiledParams = [Compiled_C];
		this.PresentOut = math.zeros(Compiled_C.length, Compiled_C[0].length)._data;
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		return this.CompiledParams[0];
	},
	Details : function () {
		var C = this.Parameters[0].Value;
		var ValidateText = this.ValidateParams();
		if (ValidateText === 'OK') {
			var StrOut;
			StrOut = "$Y(t) = \\begin{bmatrix}";
			for (var i=0; i<C.length; i++) {
				for (var j=0; j<C[0].length; j++) {
					if (j!==0) StrOut += "&";
					StrOut += math.round(math.eval(C[i][j]),3);
				}
				StrOut += "\\\\";
			}
			StrOut += "\\end{bmatrix}$";
			StrOut += "<br/>where $t$ is time.";
			return StrOut;
		} else return 'Error:<br/>' + ValidateText;
	},
	ValidateParams : function () {
		return "OK";
	},
}
