var OperatorsForNode = {
	"AllOperators": [
	{
		Name: "Sum",
		Image: "images/tex/operators-figure0.png",
		Eval: function (x) {
			return 1;
		},
		String: function () {
			return '';
		},
		LaTeXString: function () {
			return '$$y=\\sum_{i=1}^{n}{\\left[u_i\\right]}$$';
		},
	},
	{
		Name: "Product",
		Image: "images/tex/operators-figure1.png",
		Eval: function (x) {
			return 1;
		},
		String: function () {
			return '';
		},
		LaTeXString: function () {
			return '$$y=\\prod_{i=1}^{n}{\\left[u_i\\right]}$$';
		},
	},
	]
};