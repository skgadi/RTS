{
	Name: "Triangular",
	Image: "images/tex/sources-figure2.png",
	Parameters: [{
			Name: "Amplitude",
			LaTeX: "A",
			Value: 1
		}, {
			Name: "Frequency",
			LaTeX: "f",
			Value: 1
		}, {
			Name: "Phase",
			LaTeX: "\\phi",
			Value: 0
		}, {
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		},
	],
	PresentOut: [0],
	InputParams: [0],
	Init: function () {
		this.InputParams = [0];
		this.PresentOut = [0];
	},
	Eval: function (x) {
		var A = parseFloat(this.Parameters[0].Value);
		var f = parseFloat(this.Parameters[1].Value);
		var Phi = parseFloat(this.Parameters[2].Value);
		var O = parseFloat(this.Parameters[3].Value);
		return [A * Math.asin(Math.sin(2 * Math.PI * f * SimulationTime)) * 2 / Math.PI + O];
	},
	String: function () {
		return "Triangular wave";
	},
	LaTeXString: function () {
		var A = 2 * this.Parameters[0].Value;
		var f = this.Parameters[1].Value * 2;
		var phi = this.Parameters[2].Value;
		var O = this.Parameters[3].Value;
		var StrOut;
		if (A != 0 && f > 0) {
			StrOut = "\\frac{" + A + "}{\\pi}\\sin^{-1}[\\sin(";
			StrOut += f + "\\pi t";
			if (phi > 0)
				StrOut += "+" + phi;
			if (phi < 0)
				StrOut += phi;
			StrOut += ")]";
			if (O > 0)
				StrOut += "+" + O;
			if (O < 0)
				StrOut += O;
		} else {
			StrOut = O;
		}
		return '$y(t)=' + StrOut + '$';
	},
}
