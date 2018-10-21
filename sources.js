var SourcesForNode = {
	"AllSources": [
	{
		Name: "Step",
		Image: "images/tex/sources-figure0.png",
		Parameters: [
		{
			Name: "Amplitude",
			LaTeX: "A",
			Value: 1
		},
		{
			Name: "Start at",
			LaTeX: "t_0",
			Value: 1
		},
		{
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
		},
		String: function () {
			var A = this.Parameters[0].Value;
			var t_0 = -1*this.Parameters[1].Value;
			var O = this.Parameters[2].Value;
			var StrOut;
			if (A!=0) {
				if (A==1)
					StrOut = "H(";
				else
					StrOut = A+"H(";
				StrOut += "t";
				if (t_0 > 0) StrOut += "+"+t_0;
				if (t_0 < 0) StrOut += t_0;
				StrOut += ")";
				if (O>0) StrOut += "+" + O;
				if (O<0) StrOut += O;
				return StrOut;
			} else {
				return 'y(t)='+O;
			}
		},
		LaTeXString: function () {
			var A = this.Parameters[0].Value;
			var t_0 = -1*this.Parameters[1].Value;
			var O = this.Parameters[2].Value;
			var StrOut;
			if (A!=0) {
				if (A==1)
					StrOut = "H(";
				else
					StrOut = A+"H(";
				StrOut += "t";
				if (t_0 > 0) StrOut += "+"+t_0;
				if (t_0 < 0) StrOut += t_0;
				StrOut += ")";
				if (O>0) StrOut += "+" + O;
				if (O<0) StrOut += O;
				return '$y(t)='+StrOut+',$<br/>'+
					'$H(t-t_0)=\\left\\{\\begin{matrix}\
					0 & \\mbox{if} & t \\lt t_0 \\\\ \
					1 & \\mbox{if} & t \\ge t_0 \\\\ \
					\\end{matrix} \\right.$';
			} else {
				return '$y(t)='+O+'$';
			}
		},
	},
	{
		Name: "Sine",
		Image: "images/tex/sources-figure1.png",
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
			Name: "Phase",
			LaTeX: "\\phi",
			Value: 0
		},
		{
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
		},
		String: function () {
			var A = this.Parameters[0].Value;
			var f = Math.round(Math.PI*this.Parameters[1].Value*2*1000)/1000;
			var phi = this.Parameters[2].Value;
			var O = this.Parameters[3].Value;
			var StrOut;
			if (A!=0 && f>0) {
				if (A==1)
					StrOut = "sin(";
				else
					StrOut = A+"sin(";
				StrOut += f + "t";
				if (phi > 0) StrOut += "+"+phi;
				if (phi < 0) StrOut += phi;
				StrOut += ")";
				if (O>0) StrOut += "+" + O;
				if (O<0) StrOut += O;
			} else {
				StrOut = O;
			}
			return StrOut;
		},
		LaTeXString: function () {
			var A = this.Parameters[0].Value;
			var f = this.Parameters[1].Value*2;
			var phi = this.Parameters[2].Value;
			var O = this.Parameters[3].Value;
			var StrOut;
			if (A!=0 && f>0) {
				if (A==1)
					StrOut = "\\sin(";
				else
					StrOut = A+"\\sin(";
				StrOut += f + "\\pi t";
				if (phi > 0) StrOut += "+"+phi;
				if (phi < 0) StrOut += phi;
				StrOut += ")";
				if (O>0) StrOut += "+" + O;
				if (O<0) StrOut += O;
			} else {
				StrOut = O;
			}
			return '$y(t)='+StrOut+'$';
		},
	},
	{
		Name: "Triangular",
		Image: "images/tex/sources-figure2.png",
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
			Name: "Phase",
			LaTeX: "\\phi",
			Value: 0
		},
		{
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
		},
		String: function () {
			return "Triangular wave";
		},
		LaTeXString: function () {
			var A = 2*this.Parameters[0].Value;
			var f = this.Parameters[1].Value*2;
			var phi = this.Parameters[2].Value;
			var O = this.Parameters[3].Value;
			var StrOut;
			if (A!=0 && f>0) {
				StrOut = "\\frac{"+A+"}{\\pi}\\sin^{-1}[\\sin(";
				StrOut += f + "\\pi t";
				if (phi > 0) StrOut += "+"+phi;
				if (phi < 0) StrOut += phi;
				StrOut += ")]";
				if (O>0) StrOut += "+" + O;
				if (O<0) StrOut += O;
			} else {
				StrOut = O;
			}
			return '$y(t)='+StrOut+'$';
		},
	},
	{
		Name: "Sawtooth",
		Image: "images/tex/sources-figure3.png",
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
			Name: "Phase",
			LaTeX: "\\phi",
			Value: 0
		},
		{
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
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
	},
	{
		Name: "Rectangular",
		Image: "images/tex/sources-figure4.png",
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
			Name: "Phase",
			LaTeX: "\\phi",
			Value: 0
		},
		{
			Name: "Offset",
			LaTeX: "O",
			Value: 0
		},
		{
			Name: "Duty cycle",
			LaTeX: "D",
			Value: 0.5
		},
		],
		Init: function () {
		},
		Eval: function (x) {
			return 1;
		},
		String: function () {
			return "Rectangular wave";
		},
		LaTeXString: function () {
			return "$y(t)=$ Rectangular wave";
		},
	},
	]
};