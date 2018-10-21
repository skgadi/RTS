var TransferFunctionsForNode = {
	"AllTransferFunctions": [
	{
		Name: "Laplace",
		Image: "images/tex/transfer-functions-figure0.png",
		Parameters: [
		{
			Name: "Numerator",
			LaTeX: "N",
			Value: "0, 1"
		},
		{
			Name: "Denominator",
			LaTeX: "D",
			Value: "1, 0"
		},
		{
			Name: "States",
			LaTeX: "X",
			Value: "0, 0"
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
		},
		String: function () {
			return "(" + this.Parameters[0].Value + ") / (" + this.Parameters[1].Value + ")";
		},
		LaTeXString: function () {
			var N = this.Parameters[0].Value;
			var D = this.Parameters[1].Value;
			var X = this.Parameters[2].Value;
			var Split_n = N.split(',');
			var NumOut = "";
			for (var i=0; i<Split_n.length; i++) {
				var TempFloat = parseFloat(Split_n[i]);
				if (TempFloat>0) {
					if (NumOut != "") NumOut += "+";
					if (TempFloat != 1 || (Split_n.length-i-1) == 0) NumOut += TempFloat;
				}
				if (TempFloat<0) NumOut += TempFloat;
				if ((Split_n.length-i-1) != 0 && TempFloat != 0) NumOut += "s";
				if ((Split_n.length-i-1) >= 2 && TempFloat != 0) NumOut += "^"+(Split_n.length-i-1);
			}
			Split_n = D.split(',');
			var DenOut = "";
			for (var i=0; i<Split_n.length; i++) {
				var TempFloat = parseFloat(Split_n[i]);
				if (TempFloat>0) {
					if (DenOut != "") DenOut += "+";
					if (TempFloat != 1 || (Split_n.length-i-1) == 0) DenOut += TempFloat;
				}
				if (TempFloat<0) DenOut += TempFloat;
				if ((Split_n.length-i-1) != 0 && TempFloat != 0) DenOut += "s";
				if ((Split_n.length-i-1) >= 2 && TempFloat != 0) DenOut += "^"+(Split_n.length-i-1);
			}
			return "$$\\frac{Y(s)}{U(s)}=\\frac{"+ NumOut +"}{"+ DenOut +"}$$";
		},
	},
	{
		Name: "Z-Transform",
		Image: "images/tex/transfer-functions-figure1.png",
		Parameters: [
		{
			Name: "Numerator",
			LaTeX: "N",
			Value: "0, 1"
		},
		{
			Name: "Denominator",
			LaTeX: "D",
			Value: "1, 0"
		},
		{
			Name: "States",
			LaTeX: "S",
			Value: "0, 0"
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
		},
		String: function () {
			return "(" + this.Parameters[0].Value + ") / (" + this.Parameters[1].Value + ")";
		},
		LaTeXString: function () {
			var N = this.Parameters[0].Value;
			var D = this.Parameters[1].Value;
			var X = this.Parameters[2].Value;
			var Split_n = N.split(',');
			var NumOut = "";
			for (var i=0; i<Split_n.length; i++) {
				var TempFloat = parseFloat(Split_n[i]);
				if (TempFloat>0) {
					if (NumOut != "") NumOut += "+";
					if (TempFloat != 1 || (Split_n.length-i-1) == 0) NumOut += TempFloat;
				}
				if (TempFloat<0) NumOut += TempFloat;
				if ((Split_n.length-i-1) != 0 && TempFloat != 0) NumOut += "z";
				if ((Split_n.length-i-1) >= 2 && TempFloat != 0) NumOut += "^"+(Split_n.length-i-1);
			}
			Split_n = D.split(',');
			var DenOut = "";
			for (var i=0; i<Split_n.length; i++) {
				var TempFloat = parseFloat(Split_n[i]);
				if (TempFloat>0) {
					if (DenOut != "") DenOut += "+";
					if (TempFloat != 1 || (Split_n.length-i-1) == 0) DenOut += TempFloat;
				}
				if (TempFloat<0) DenOut += TempFloat;
				if ((Split_n.length-i-1) != 0 && TempFloat != 0) DenOut += "z";
				if ((Split_n.length-i-1) >= 2 && TempFloat != 0) DenOut += "^"+(Split_n.length-i-1);
			}
			return "$$\\frac{Y(z)}{U(z)}=\\frac{"+ NumOut +"}{"+ DenOut +"}$$";
		},
	},
	]
};