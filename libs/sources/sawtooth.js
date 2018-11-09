gsk_libs_sources_sawtooth = {
	Name : "Sawtooth wave",
	Parameters : [{
			Name : "Amplitude $(A)$",
			Type : "MatComplex",
			Value : [[1]]
		}, {
			Name : "Frequency $(f)$",
			Type : "MatReal",
			Value : [[1]]
		}, {
			Name : "Time advancement $(t_0)$",
			Type : "MatReal",
			Value : [[0]]
		}, {
			Name : "Offset $(O)$",
			Type : "MatComplex",
			Value : [[0]]
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [["Sawtooth wave"]]
		},
	],
	Label : function () {
		return this.Parameters[4].Value[0][0];
	},
	MaxInTerminals : 0,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/sources-figure3.png"
	},
	Init : function () {
		var Compiled_T = []
		var Compiled_T_by_2 = [];
		var Compiled_Slope = [];
		var Compiled_A = [];
		var Compiled_f = [];
		var Compiled_t_0 = [];
		var Compiled_O = [];
		for (var i = 0; i < this.Parameters[0].Value.length; i++) {
			var Temp_A = [];
			var Temp_f = [];
			var Temp_t_0 = [];
			var Temp_O = [];
			for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
				Temp_A.push(math.eval(this.Parameters[0].Value[i][j]));
				Temp_f.push(math.eval(this.Parameters[1].Value[i][j]));
				Temp_t_0.push(math.eval(this.Parameters[2].Value[i][j]));
				Temp_O.push(math.eval(this.Parameters[3].Value[i][j]));
			}
			Compiled_A.push(Temp_A);
			Compiled_f.push(Temp_f);
			Compiled_t_0.push(Temp_t_0);
			Compiled_O.push(Temp_O);
		}
		Compiled_T = math.dotDivide(1, Compiled_f);
		Compiled_T_by_2 = math.dotDivide(Compiled_T, 2);
		Compiled_Slope = math.dotMultiply(2, Compiled_f);
		this.CompiledParams = [Compiled_A, Compiled_t_0, Compiled_O, Compiled_T_by_2, Compiled_T, Compiled_Slope];
		this.PresentOut = math.zeros(Compiled_A.length, Compiled_A[0].length)._data;
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		var A = this.CompiledParams[0];
		var t_0 = this.CompiledParams[1];
		var O = this.CompiledParams[2];
		var T_by_2 = this.CompiledParams[3];
		var T = this.CompiledParams[4];
		var Slope = this.CompiledParams[5];
		var TempMat = math.mod(math.add(math.subtract(SimulationTime, t_0), T_by_2), T);
		for (var i = 0; i < TempMat.length; i++) {
			for (var j = 0; j < TempMat[0].length; j++) {
				TempMat[i][j] = TempMat[i][j]*Slope[i][j] - 1;
			}
		}
		return math.add(math.dotMultiply(A, TempMat), O);
	},
	Details : function () {
		var A = 	this.Parameters[0].Value;
		var f = this.Parameters[1].Value;
		var t_0 = 	this.Parameters[2].Value;
		var O = 	this.Parameters[3].Value;
		var ValidateText = this.ValidateParams();
		if (ValidateText === 'OK') {
			var StrOut="";
			StrOut += "Sawtooth wave with";
			StrOut += "<br/>Amplitude: $" + MatrixToLatexString(A) + "$";
			StrOut += "<br/>Frequency: $" + MatrixToLatexString(f) + "$";
			StrOut += "<br/>Time advancement: $" + MatrixToLatexString(t_0) + "$";
			StrOut += "<br/>Offset: $" + MatrixToLatexString(O) + "$";
			StrOut += "<br/><img style='width: 100%;' src='images/tex/Illustrations-figure1.png' alt='triangular wave'/>";
			return StrOut;
		} else return 'Error:<br/>' + ValidateText;
	},
	ValidateParams : function () {
		var A = 	this.Parameters[0].Value;
		var f = this.Parameters[1].Value;
		var t_0 = 	this.Parameters[2].Value;
		var O = 	this.Parameters[3].Value;
		if ((A.length !== f.length) || (A[0].length !== f[0].length)) return "Dimentions of $A$ is different from $f$";
		if ((A.length !== t_0.length) || (A[0].length !== t_0[0].length)) return "Dimentions of $A$ is different from $t_0$";
		if ((A.length !== O.length) || (A[0].length !== O[0].length)) return "Dimentions of $A$ is different from $O$";
		return "OK";
	},
}
