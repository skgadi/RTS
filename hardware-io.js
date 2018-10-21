var HardwareIOsForNode = {
	"AllHardwareIOs": [
	{
		Name: "Arduino AI",
		Image: "images/tex/hardware-io-figure0.png",
		MaxInputs: 0,
		MaxOutputs: Infinity,
		Parameters: [
		{
			Name: "Port",
			LaTeX: "P",
			Value: "2"
		},
		],
		PresentOut: [0],
		Init: function () {
		},
		Eval: function (x) {
			return [1];
		},
		String: function () {
			return "Port: " + this.Parameters[0].Value;
		},
		LaTeXString: function () {
			return "Port: $"+ this.Parameters[0].Value +"$";
		},
	},
	{
		Name: "Arduino AO",
		Image: "images/tex/hardware-io-figure1.png",
		MaxInputs: 1,
		MaxOutputs: 0,
		Parameters: [
		{
			Name: "Port",
			LaTeX: "P",
			Value: "3"
		},
		],
		PresentOut: [0],
		Init: function () {
		},
		Eval: function (x) {
			return [1];
		},
		String: function () {
			return "Port: " + this.Parameters[0].Value;
		},
		LaTeXString: function () {
			return "Port: $"+ this.Parameters[0].Value +"$";
		},
	},
	{
		Name: "Arduino encoder",
		Image: "images/tex/hardware-io-figure2.png",
		MaxInputs: 0,
		MaxOutputs: Infinity,
		Parameters: [
		{
			Name: "Port",
			LaTeX: "P",
			Value: "5"
		},
		],
		PresentOut: [0],
		Init: function () {
		},
		Eval: function (x) {
			return [1];
		},
		String: function () {
			return "Port: " + this.Parameters[0].Value;
		},
		LaTeXString: function () {
			return "Port: $"+ this.Parameters[0].Value +"$";
		},
	},
	]
};