{
	Name: "Cosine",
	Image: "images/tex/functions-figure2.png",
	Parameters: [{
			Name: "Amplitude",
			LaTeX: "A",
			Type: "Number",
			Value: 1
		}, {
			Name: "Frequency",
			LaTeX: "f",
			Type: "Number",
			Value: 1
		}, {
			Name: "Phase shift",
			LaTeX: "\\phi",
			Type: "Number",
			Value: 0
		},
	],
	PresentOut: [0],
	InputParams: [0],
	Init: function () {
		this.InputParams = [0];
		this.PresentOut = [0];
	},
	Eval: function () {
		var A = this.Parameters[0].Value;
		var f = this.Parameters[1].Value;
		var Phi = this.Parameters[2].Value;
		return [A * Math.cos(2 * f * this.InputParams[0] + Phi)];
	},
	String: function () {
		var A = this.Parameters[0].Value;
		var f = Math.round(Math.PI * 2 * this.Parameters[1].Value * 1000) / 1000;
		var Phi = this.Parameters[2].Value;
		var StrOut = "";
		if (A != 0 && f != 0) {
			if (A != 1)
				StrOut = A;
			StrOut += "cos(" + f + "u";
			if (Phi > 0)
				StrOut += "+" + Phi;
			if (Phi < 0)
				StrOut +=  + Phi;
			return StrOut + ")";
		} else
			return "0";
	},
	LaTeXString: function () {
		var A = this.Parameters[0].Value;
		var f = 2 * this.Parameters[1].Value;
		var Phi = this.Parameters[2].Value;
		var StrOut = "";
		if (A != 0 && f != 0) {
			if (A != 1)
				StrOut = A;
			StrOut += "\\cos(" + f + "\\pi u";
			if (Phi > 0)
				StrOut += "+" + Phi;
			if (Phi < 0)
				StrOut +=  + Phi;
			return "$y=" + StrOut + ")$";
		} else
			return "$y=0$";
	},
}
