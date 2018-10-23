{
	Name: "Sawtooth",
	Image: "images/tex/sources-figure3.png",
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
		return [(((SimulationTime) % (1 / f)) * 2 * A * f - A) + O];
	},
	String: function () {
		return "Sawtooth wave";
	},
	LaTeXString: function () {
		var A = this.Parameters[0].Value;
		var f = this.Parameters[1].Value;
		var phi = this.Parameters[2].Value;
		var O = this.Parameters[3].Value;
		return '$y(t)=$ Sawtooth wave';
	},
}
