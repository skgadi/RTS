gsk_libs_functions_dotmultiply = {
	Name : "Multiply",
	Parameters : [{
			Name : "Type of multiplication",
			Type : "ScalarOptions",
			Value : [["Matrix multiplication"]],
			Options : ["Matrix multiplication", "Element wise multiplication"]
		}
	],
	Label : function () {
		switch (this.Parameters[0].Value[0][0]) {
		case "Matrix multiplication":
			return "Matrix";
		case "Element wise multiplication":
			return "Element wise";
		}
	},
	MaxInTerminals : MaxInTerminalsAllowedToUse,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/functions-figure1.png"
	},
	Init : function () {
		this.InputParams = [];
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		var OutMatrix = math.clone(this.InputParams[0]);
		switch (this.Parameters[0].Value[0][0]) {
		case "Matrix multiplication":
			for (var i = 1; i < this.InputParams.length; i++)
				OutMatrix = math.multiply(OutMatrix, this.InputParams[i]);
			break;
		case "Element wise multiplication":
			for (var i = 1; i < this.InputParams.length; i++)
				OutMatrix = math.dotMultiply(OutMatrix, this.InputParams[i]);
			break;
		}
		return OutMatrix;
	},
	Details : function () {
		var StrOut = "";
		switch (this.Parameters[0].Value[0][0]) {
		case "Matrix multiplication":
			StrOut = "$$Y=\\prod_{i=1}^{k}{U_i}$$"
				break;
		case "Element wise multiplication":
			StrOut = "$$Y=\\begin{bmatrix}\\prod_{i=1}^{k}{u_i(1,1)} & \\prod_{i=1}^{k}{u_i(1,2)} & \\prod_{i=1}^{k}{u_i(1,3)} & \\cdots & \\prod_{i=1}^{k}{u_i(1,n)} \\\\ \\prod_{i=1}^{k}{u_i(2,1)} & \\prod_{i=1}^{k}{u_i(2,2)} & \\prod_{i=1}^{k}{u_i(2,3)} & \\cdots & \\prod_{i=1}^{k}{u_i(2,n)} \\\\ \\prod_{i=1}^{k}{u_i(3,1)} & \\prod_{i=1}^{k}{u_i(3,2)} & \\prod_{i=1}^{k}{u_i(3,3)} & \\cdots & \\prod_{i=1}^{k}{u_i(3,n)} \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ \\prod_{i=1}^{k}{u_i(m,1)} & \\prod_{i=1}^{k}{u_i(m,2)} & \\prod_{i=1}^{k}{u_i(m,3)} & \\cdots & \\prod_{i=1}^{k}{u_i(m,n)} \\end{bmatrix}$$"
				break;
		}
		StrOut += "<br/>where $k$ is the number of matrices connected to this block and each matrix is of the order $m\\times n$."
		return StrOut;
	},
	ValidateParams : function () {
		return "OK";
	},
}
