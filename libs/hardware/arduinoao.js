{
	Name: "Arduino AO",
	Image: "images/tex/hardware-io-figure1.png",
	MaxInputs: 1,
	MaxOutputs: 0,
	Parameters: [{
			Name: "Port",
			LaTeX: "P",
			Type: "Number",
			Value: "3"
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
