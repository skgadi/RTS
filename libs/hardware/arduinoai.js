{
	Name: "Arduino AI",
	Image: "images/tex/hardware-io-figure0.png",
	MaxInputs: 0,
	MaxOutputs: Infinity,
	Parameters: [{
			Name: "Port",
			LaTeX: "P",
			Type: "Number",
			Value: "2"
		},
	],
	PresentOut: [0],
	InputParams: [0],
	Init: function () {
		this.InputParams = [0];
		this.PresentOut = [0];
	},
	Eval: function () {
		return [1];
	},
	String: function () {
		return "Port: " + this.Parameters[0].Value;
	},
	LaTeXString: function () {
		return "Port: $" + this.Parameters[0].Value + "$";
	},
}
