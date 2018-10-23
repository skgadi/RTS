{
	Name: "Rectangular",
	Image: "images/tex/sources-figure4.png",
	Parameters: [{
			Name: "Amplitude",
			LaTeX: "A",
			Value: 1
		}, {
			Name: "Frequency",
			LaTeX: "f",
			Value: 1
		}, {
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		}, {
			Name: "Duty cycle",
			LaTeX: "D",
			Value: 0.5
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
		var f = parseFloat(this.Parameters[1].Value);
		var O = parseFloat(this.Parameters[2].Value);
		var D = parseFloat(this.Parameters[3].Value);
		if (((SimulationTime) % (1 / f)) < (1 / f) * (D))
			return [A + O];
		else
			return [-A + O];
	},
	String: function () {
		return "Rectangular wave";
	},
	LaTeXString: function () {
		return "$y(t)=$ Rectangular wave";
	},
}
