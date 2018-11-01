gsk_libs_sources_sine = {
	Name : "Sine",
	Parameters : [{
			Name : "Amplitude $(A)$",
			Type : "MatComplex",
			Value : [[1]]
		}, {
			Name : "Angular velocity $(\\omega)$",
			Type : "MatComplex",
			Value : [[1]]
		}, {
			Name : "Phase $(\\phi)$",
			Type : "MatComplex",
			Value : [[1]]
		}, {
			Name : "Offset $(O)$",
			Type : "MatComplex",
			Value : [[0]]
		},
	],
	MaxInTerminals : 1,
	MaxOutTerminals : Infinity,
	PresentOut : null,
	InputParams : null,
	Icon : function () {
		return "images/tex/sources-figure1.png"
	},
	Init : function () {
		var Compiled_A=[[]];
		var Compiled_omega=[[]];
		var Compiled_phi=[[]];
		var Compiled_O=[[]];
		for (var i=0; i<this.Parameters[0].Value.length; i++) {
			for (var j=0; j<this.Parameters[0].Value[0].length; j++) {
				Compiled_A[i][j] 	= math.eval(this.Parameters[0].Value[i][j]);
				Compiled_omega[i][j]= math.eval(this.Parameters[1].Value[i][j]);
				Compiled_phi[i][j] 	= math.eval(this.Parameters[2].Value[i][j]);
				Compiled_O[i][j] 	= math.eval(this.Parameters[3].Value[i][j]);
			}
		}
		this.CompiledParams = [Compiled_A, Compiled_omega, Compiled_phi, Compiled_O];
		this.InputParams 	= math.zeros(this.Parameters[0].Value.length, this.Parameters[0].Value[0].length);
		this.PresentOut 	= math.zeros(this.Parameters[0].Value.length, this.Parameters[0].Value[0].length);
	},
	Constructor : function (data) {},
	Destructor : function (data) {},
	Evaluate : function () {
		var A = this.CompiledParams[0];
		var omega = this.CompiledParams[1];
		var phi = this.CompiledParams[2];
		var O = this.CompiledParams[3];
		return math.add(math.dotMultiply(A, math.sin(math.add(math.dotMultiply(SimulationTime, omega), phi))),O);
	},
	Label : function () {
		return "Sine wave";
	},
	Details : function () {
		var A = 	this.Parameters[0].Value;
		var omega = this.Parameters[1].Value;
		var phi = 	this.Parameters[2].Value;
		var O = 	this.Parameters[3].Value;
		var ValidateText = this.ValidateParams();
		if (ValidateText === 'OK') {
			var StrOut;
			StrOut = "$y(t) = \\begin{bmatrix}";
			for (var i=0; i<A.length; i++) {
				for (var j=0; j<A[0].length; j++) {
					if (j!==0) StrOut += "&";
					StrOut += "(" + math.round(math.eval(A[i][j]),3) + ") \\sin{\\left[(" + math.round(math.eval(omega[i][j]), 3) + ")t + " + math.round(math.eval(phi[i][j]), 3) + "\\right]} + " + math.round(math.eval(O[i][j]), 3);
				}
				StrOut += "\\\\";
			}
			StrOut += "\\end{bmatrix}$";
			return StrOut;
		} else return 'Error:<br/>' + ValidateText;
	},
	ValidateParams : function () {
		var A = 	this.Parameters[0].Value;
		var omega = this.Parameters[1].Value;
		var phi = 	this.Parameters[2].Value;
		var O = 	this.Parameters[3].Value;
		if ((A.length !== omega.length) || (A[0].length !== omega[0].length)) return "Dimentions of A is different from ω";
		if ((A.length !== phi.length) || (A[0].length !== phi[0].length)) return "Dimentions of A is different from ϕ";
		if ((A.length !== O.length) || (A[0].length !== O[0].length)) return "Dimentions of A is different from O";
		return "OK";
	},
}
