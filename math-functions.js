var StaticMathFunctions = {
	"AllFunctions": [
	{
		Name: "Gain",
		Parameters: [
		{
			Name: "Gain",
			LaTeX: "G",
			Value: 1
		},
		],
		Eval: function (x) {
			return this.Parameters[0].Value*x;
		},
		String: function () {
			return this.Parameters[0].Value+"*u(t)";
		},
		LaTeXString: function () {
			var G = this.Parameters[0].Value;
			var StrOut="";
			if (G!=0) {
				if (G!=1) StrOut = G;
				return "$y=" + StrOut +"u$";
			} else return "$y=0$";
		},
	},
	{
		Name: "Sine",
		Parameters: [
		{
			Name: "Amplitude",
			LaTeX: "A",
			Value: 1
		},
		{
			Name: "Frequency",
			LaTeX: "f",
			Value: 1
		},
		{
			Name: "Phase shift",
			LaTeX: "\\phi",
			Value: 0
		},
		],
		Eval: function (x) {
			var A = this.Parameters[0].Value;
			var f = this.Parameters[1].Value;
			var Phi = this.Parameters[2].Value;
			return A*Math.sin(2*f*x+Phi);
		},
		String: function () {
			var A = this.Parameters[0].Value;
			var f = this.Parameters[1].Value;
			var Phi = this.Parameters[2].Value;
			return A+"sin(" + Omega+"u(t) + " + Phase + ")";
		},
		LaTeXString: function () {
			var A = this.Parameters[0].Value;
			var f = 2*this.Parameters[1].Value;
			var Phi = this.Parameters[2].Value;
			var StrOut="";
			if (A!=0 && f!=0) {
				if (A!=1) StrOut = A;
				StrOut += "\\sin("+f+"\\pi u";
				if (Phi>0) StrOut += "+" + Phi;
				if (Phi<0) StrOut += + Phi;
				return "$y=" + StrOut +")$";
			} else return "$y=0$";
		},
	},
	{
		Name: "Cosine",
		Parameters: [
		{
			Name: "Amplitude",
			LaTeX: "A",
			Value: 1
		},
		{
			Name: "Frequency",
			LaTeX: "f",
			Value: 1
		},
		{
			Name: "Phase shift",
			LaTeX: "\\phi",
			Value: 0
		},
		],
		Eval: function (x) {
			var A = this.Parameters[0].Value;
			var f = this.Parameters[1].Value;
			var Phi = this.Parameters[2].Value;
			return A*Math.cos(2*f*x+Phi);
		},
		String: function () {
			var A = this.Parameters[0].Value;
			var f = this.Parameters[1].Value;
			var Phi = this.Parameters[2].Value;
			return A+"cos(" + Omega+"u(t) + " + Phase + ")";
		},
		LaTeXString: function () {
			var A = this.Parameters[0].Value;
			var f = 2*this.Parameters[1].Value;
			var Phi = this.Parameters[2].Value;
			var StrOut="";
			if (A!=0 && f!=0) {
				if (A!=1) StrOut = A;
				StrOut += "\\cos("+f+"\\pi u";
				if (Phi>0) StrOut += "+" + Phi;
				if (Phi<0) StrOut += + Phi;
				return "$y=" + StrOut +")$";
			} else return "$y=0$";
		},
	},
	]
};