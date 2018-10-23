{
	Name: "Gain",
	Image: "images/tex/functions-figure0.png",
	Parameters: [{
			Name: "Gain",
			LaTeX: "G",
			Type: "Number",
			Value: 1
		},
	],
	PresentOut: [0],
	InputParams: [0],
	Init: function () {
		this.InputParams = [0];
		this.PresentOut = [0];
	},
	Eval: function () {
		return [this.Parameters[0].Value * this.InputParams[0]];
	},
	String: function () {
		return this.Parameters[0].Value + "u";
	},
	LaTeXString: function () {
		var G = this.Parameters[0].Value;
		var StrOut = "";
		if (G != 0) {
			if (G != 1)
				StrOut = G;
			return "$y=" + StrOut + "u$";
		} else
			return "$y=0$";
	},
}
