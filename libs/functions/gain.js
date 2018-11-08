gsk_libs_functions_gain = {
	Name : "Gain",
	Parameters : [{
			Name : "Gain $(g)$",
			Type : "MatComplex",
			Value : [[1]],
		}, {
			Name : "Type of gain",
			Type : "ScalarOptions",
			Value : [["Scalar multiplication"]],
			Options : ["Scalar multiplication", "Element wise multiplication", "Matrix multiplication (GU)", "Matrix multiplication (UG)"]
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [[""]]
		},
	],
	Label : function () {
		return this.Parameters[2].Value[0][0];
	},
	MaxInTerminals : 1,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure2.png"
	},
	Init : function () {
		var Compiled_G = [];
		for (var i = 0; i < this.Parameters[0].Value.length; i++) {
			var Temp_G = [];
			for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
				Temp_G.push(math.eval(this.Parameters[0].Value[i][j]));
			}
			Compiled_G.push(Temp_G);
		}
		this.CompiledParams = [Compiled_G];
		this.InputParams = [];
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		switch (this.Parameters[1].Value[0][0]) {
		case "Scalar multiplication":
			return math.multiply(this.CompiledParams[0][0][0], this.InputParams[0]);
			break;
		case "Element wise multiplication":
			return math.dotMultiply(this.CompiledParams[0], this.InputParams[0]);
			break;
		case "Matrix multiplication (GU)":
			return math.multiply(this.CompiledParams[0], this.InputParams[0]);
			break;
		case "Matrix multiplication (UG)":
			return math.multiply(this.InputParams[0], this.CompiledParams[0]);
			break;
		}
	},
	Details : function () {
		var ErrorName;
		var StrOut = "";
		if ((ErrorName = this.ValidateParams()) === "OK") {
			switch (this.Parameters[1].Value[0][0]) {
			case "Scalar multiplication":
				StrOut = "$Y=" + math.round(math.eval(this.Parameters[0].Value[0][0]), 3) + "U$";
				break;
			case "Element wise multiplication":
				StrOut = "$Y=\\begin{bmatrix}";
				for (var i = 0; i < this.Parameters[0].Value.length; i++) {
					for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
						if (j !== 0)
							StrOut += "&";
						StrOut += math.round(math.eval(this.Parameters[0].Value[i][j]), 3) + "u_{" + i + ", " + j + "}";
					}
					StrOut += "\\\\";
				}
				StrOut += "\\end{bmatrix}$";
				break;
			case "Matrix multiplication (GU)":
				StrOut = "$Y=\\begin{bmatrix}";
				for (var i = 0; i < this.Parameters[0].Value.length; i++) {
					for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
						if (j !== 0)
							StrOut += "&";
						StrOut += math.round(math.eval(this.Parameters[0].Value[i][j]), 3);
					}
					StrOut += "\\\\";
				}
				StrOut += "\\end{bmatrix}U$";
				break;
			case "Matrix multiplication (UG)":
				StrOut = "$Y=U\\begin{bmatrix}";
				for (var i = 0; i < this.Parameters[0].Value.length; i++) {
					for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
						if (j !== 0)
							StrOut += "&";
						StrOut += math.round(math.eval(this.Parameters[0].Value[i][j]), 3);
					}
					StrOut += "\\\\";
				}
				StrOut += "\\end{bmatrix}$";
				break;
			}
			return StrOut;
		} else
			return "Error: <br/>" + ErrorName;
	},
	ValidateParams : function () {
		return "OK";
	},
}
