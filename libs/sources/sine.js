gsk_libs_sources_sine = {
	Name: "Sine",
	Icon: "images/tex/sources-figure1.png",
	Parameters: [{
			Name: "Amplitude $(A)$",
			Type: "Number",
			Value: 1
		}, {
			Name: "Frequency $(f)$",
			Type: "Number",
			Value: 1
		}, {
			Name: "Phase $(\\phi)$",
			Type: "Number",
			Value: 0
		}, {
			Name: "Offset $(O)$",
			Type: "Number",
			Value: 0
		},
	],
	MaxInTerminals: 1,
	MaxOutTerminals: Infinity,
	PresentOut: [0],
	InputParams: [0],
	Init: function () {
		this.InputParams = [0];
		this.PresentOut = [0];
	},
	Const: function () {
	},
	Eval: function () {
		var A = parseFloat(this.Parameters[0].Value);
		var f = parseFloat(this.Parameters[1].Value);
		var Phi = parseFloat(this.Parameters[2].Value);
		var O = parseFloat(this.Parameters[3].Value);
		return [Math.sin(2 * Math.PI * f * SimulationTime + Phi) + O];
	},
	Label: function () {
		var A = this.Parameters[0].Value;
		var f = Math.round(Math.PI * this.Parameters[1].Value * 2 * 1000) / 1000;
		var phi = this.Parameters[2].Value;
		var O = this.Parameters[3].Value;
		var StrOut;
		if (A != 0 && f > 0) {
			if (A == 1)
				StrOut = "sin(";
			else
				StrOut = A + "sin(";
			StrOut += f + "t";
			if (phi > 0)
				StrOut += "+" + phi;
			if (phi < 0)
				StrOut += phi;
			StrOut += ")";
			if (O > 0)
				StrOut += "+" + O;
			if (O < 0)
				StrOut += O;
		} else {
			StrOut = O;
		}
		return StrOut;
	},
	Details: function () {
		var A = this.Parameters[0].Value;
		var f = this.Parameters[1].Value * 2;
		var phi = this.Parameters[2].Value;
		var O = this.Parameters[3].Value;
		var StrOut;
		if (A != 0 && f > 0) {
			if (A == 1)
				StrOut = "\\sin(";
			else
				StrOut = A + "\\sin(";
			StrOut += f + "\\pi t";
			if (phi > 0)
				StrOut += "+" + phi;
			if (phi < 0)
				StrOut += phi;
			StrOut += ")";
			if (O > 0)
				StrOut += "+" + O;
			if (O < 0)
				StrOut += O;
		} else {
			StrOut = O;
		}
		return '$y(t)=' + StrOut + '$';
	},
}
