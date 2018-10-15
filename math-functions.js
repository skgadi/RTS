var StaticMathFunctions = {
	"AllFunctions": [
		{
			"Type": "General",
			"Functions": [
				{
					"Name": "Gain",
					"Parameters": [
						{
							"Name": "Gain",
							"LaTeX": "G",
							"Value": 1
						},
					],
					"Eval": function (x) {
						return this.Parameters[0].Value*x;
					},
					"String": function () {
						return this.Parameters[0].Value+"*u(t)";
					},
					"LaTeXString": function () {
						return this.Parameters[0].Value+"u(t)";
					},
				},
			],
		},
		{
			"Type": "Trignometric",
			"Functions": [
				{
					"Name": "Sine",
					"Parameters": [
						{
							"Name": "Amplitude",
							"LaTeX": "A",
							"Value": 1
						},
						{
							"Name": "Omega",
							"LaTeX": "\omega",
							"Value": 1
						},
						{
							"Name": "Phase shift",
							"LaTeX": "\phi",
							"Value": 0
						},
					],
					"Eval": function (x) {
						var A = this.Parameters[0].Value;
						var Omega = this.Parameters[1].Value;
						var Phase = this.Parameters[2].Value;
						return A*Math.sin(Omega*x+Phase);
					},
					"String": function () {
						var A = this.Parameters[0].Value;
						var Omega = this.Parameters[1].Value;
						var Phase = this.Parameters[2].Value;
						return A+"sin(" + Omega+"u(t) + " + Phase + ")";
					},
					"LaTeXString": function () {
						var A = this.Parameters[0].Value;
						var Omega = this.Parameters[1].Value;
						var Phase = this.Parameters[2].Value;
						return A+"\sin(" + Omega+"u(t) + " + Phase + ")";
					},
				},
				{
					"Name": "Cosine",
					"Parameters": [
						{
							"Name": "Amplitude",
							"LaTeX": "G",
							"Value": 1
						},
						{
							"Name": "Omega",
							"LaTeX": "\omega",
							"Value": 1
						},
						{
							"Name": "Phase shift",
							"LaTeX": "\phi",
							"Value": 0
						},
					],
					"Eval": function (x) {
						var A = this.Parameters[0].Value;
						var Omega = this.Parameters[1].Value;
						var Phase = this.Parameters[2].Value;
						return A*Math.cos(Omega*x+Phase);
					},
					"String": function () {
						var A = this.Parameters[0].Value;
						var Omega = this.Parameters[1].Value;
						var Phase = this.Parameters[2].Value;
						return A+"cos(" + Omega+"u(t) + " + Phase + ")";
					},
					"LaTeXString": function () {
						var A = this.Parameters[0].Value;
						var Omega = this.Parameters[1].Value;
						var Phase = this.Parameters[2].Value;
						return A+"\cos(" + Omega+"u(t) + " + Phase + ")";
					},
				},
			],
		},
		{
			"Type": "Logarithmic",
			"Functions": [
			]
		}
	]
};