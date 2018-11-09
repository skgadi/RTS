gsk_libs_sources_step = {
	Name : "Step",
	Parameters : [{
			Name : "Amplitude $(A)$",
			Type : "MatComplex",
			Value : [[1]]
		}, {
			Name : "Start at $(t_0)$",
			Type : "MatReal",
			Value : [[1]]
		}, {
			Name : "Offset $(O)$",
			Type : "MatComplex",
			Value : [[0]]
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [["Step"]]
		},
	],
	Label : function () {
		return this.Parameters[3].Value[0][0];
	},
	MaxInTerminals : 0,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/sources-figure0.png"
	},
	Init : function () {
		var Compiled_A = [];
		var Compiled_t_0 = [];
		var Compiled_O = [];
		for (var i = 0; i < this.Parameters[0].Value.length; i++) {
			var Temp_A = [];
			var Temp_t_0 = [];
			var Temp_O = [];
			for (var j = 0; j < this.Parameters[0].Value[0].length; j++) {
				Temp_A.push(math.eval(this.Parameters[0].Value[i][j]));
				Temp_t_0.push(math.eval(this.Parameters[1].Value[i][j]));
				Temp_O.push(math.eval(this.Parameters[2].Value[i][j]));
			}
			Compiled_A.push(Temp_A);
			Compiled_t_0.push(Temp_t_0);
			Compiled_O.push(Temp_O);
		}
		this.CompiledParams = [Compiled_A, Compiled_t_0, Compiled_O];
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
		var TempMat = math.sign(math.subtract(SimulationTime, t_0));
		for (var i = 0; i < TempMat.length; i++) {
			for (var j = 0; j < TempMat[0].length; j++) {
				switch (TempMat[i][j]) {
				case 0:
					TempMat[i][j] = 1
						break;
				case -1:
					TempMat[i][j] = 0
						break;
				}
			}
		}
		return math.add(math.dotMultiply(A,TempMat), O);
	},
	Details : function () {
		var A = 	this.Parameters[0].Value;
		var t_0 = this.Parameters[1].Value;
		var O = 	this.Parameters[2].Value;
		var ValidateText = this.ValidateParams();
		if (ValidateText === 'OK') {
			var StrOut;
			StrOut = "$Y(t) = \\begin{bmatrix}";
			for (var i=0; i<A.length; i++) {
				for (var j=0; j<A[0].length; j++) {
					if (j!==0) StrOut += "&";
					StrOut += "(" + math.round(math.eval(A[i][j]),3) + ") H{\\left[t - (" + math.round(math.eval(t_0[i][j]), 3) + ")\\right]} + " + math.round(math.eval(O[i][j]), 3);
				}
				StrOut += "\\\\";
			}
			StrOut += "\\end{bmatrix}$";
			StrOut += "<br/>";
			StrOut += "$$H(t-t_0)=\\left\\{\\begin{matrix}0 & \\mbox{if} & t \\lt t_0 \\\\ 1 & \\mbox{if} & t \\ge t_0 \\\\ \\end{matrix} \\right.$$";
			StrOut += "<br/>where $t$ is time.";
			return StrOut;
		} else return 'Error:<br/>' + ValidateText;
	},
	ValidateParams : function () {
		var A = 	this.Parameters[0].Value;
		var t_0 = this.Parameters[1].Value;
		var O = 	this.Parameters[2].Value;
		if ((A.length !== t_0.length) || (A[0].length !== t_0[0].length)) return "Dimentions of $A$ is different from $t_0$";
		if ((A.length !== O.length) || (A[0].length !== O[0].length)) return "Dimentions of $A$ is different from $O$";
		return "OK";
	},
}
