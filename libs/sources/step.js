{
	Name: "Step",
	Image: "images/tex/sources-figure0.png",
	Parameters: [{
			Name: "Amplitude",
			LaTeX: "$A$",
			type: "Number"
			Value: 1
		}, {
			Name: "Start at",
			LaTeX: "$t_0$",
			type: "Number"
			Value: 1
		}, {
			Name: "Offset",
			LaTeX: "$O$",
			type: "Number"
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
		var A = parseFloat(this.Parameters[0].Value);
		var t_0 = parseFloat(this.Parameters[1].Value);
		var O = parseFloat(this.Parameters[2].Value);
		if (SimulationTime >= t_0)
			return [A + O];
		else
			return [O];
	},
	String: function () {
		var A = this.Parameters[0].Value;
		var t_0 = -1 * this.Parameters[1].Value;
		var O = this.Parameters[2].Value;
		var StrOut;
		if (A != 0) {
			if (A == 1)
				StrOut = "H(";
			else
				StrOut = A + "H(";
			StrOut += "t";
			if (t_0 > 0)
				StrOut += "+" + t_0;
			if (t_0 < 0)
				StrOut += t_0;
			StrOut += ")";
			if (O > 0)
				StrOut += "+" + O;
			if (O < 0)
				StrOut += O;
			return StrOut;
		} else {
			return 'y(t)=' + O;
		}
	},
	LaTeXString: function () {
		var A = this.Parameters[0].Value;
		var t_0 = -1 * this.Parameters[1].Value;
		var O = this.Parameters[2].Value;
		var StrOut;
		if (A != 0) {
			if (A == 1)
				StrOut = "H(";
			else
				StrOut = A + "H(";
			StrOut += "t";
			if (t_0 > 0)
				StrOut += "+" + t_0;
			if (t_0 < 0)
				StrOut += t_0;
			StrOut += ")";
			if (O > 0)
				StrOut += "+" + O;
			if (O < 0)
				StrOut += O;
			return '$y(t)=' + StrOut + ',$<br/>' +
			'$H(t-t_0)=\\left\\{\\begin{matrix}\
			0 & \\mbox{if} & t \\lt t_0 \\\\ \
			1 & \\mbox{if} & t \\ge t_0 \\\\ \
			\\end{matrix} \\right.$';
		} else {
			return '$y(t)=' + O + '$';
		}
	},
}
