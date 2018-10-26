{
	Name: "Product",
	Image: "images/tex/operators-figure1.png",
	PresentOut: [0],
	InputParams: [0],
	Init: function () {
		this.InputParams = [0];
		this.PresentOut = [0];
	},
	Eval: function () {
		var Prod = 1;
		this.InputParams.forEach(function (Param) {
			Prod = Prod * parseFloat(Param);
		});
		return [Prod];
	},
	String: function () {
		return '';
	},
	LaTeXString: function () {
		return '$$y=\\prod_{i=1}^{n}{\\left[u_i\\right]}$$';
	},
}