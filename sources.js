var SourcesForNode = {
	"AllSources": [
	{
		Name: "Step",
		Parameters: [
		{
			"Name": "Amplitude",
			"LaTeX": "A",
			"Value": 1
		},
		{
			"Name": "Start at",
			"LaTeX": "T_0",
			"Value": 0
		},
		{
			"Name": "Offset",
			"LaTeX": "A_0",
			"Value": 0
		},
		],
		Eval: function (x) {
			return 1;
		},
		"String": function () {
			return this.Parameters[0].Value+"*u(t)";
		},
		"LaTeXString": function () {
			return this.Parameters[0].Value+"u(t)";
		},
	},
	{
		Name: "Sine",
		Parameters: [
		{
			"Name": "Amplitude",
			"LaTeX": "A",
			"Value": 1
		},
		{
			"Name": "Start at",
			"LaTeX": "T_0",
			"Value": 0
		},
		{
			"Name": "Offset",
			"LaTeX": "A_0",
			"Value": 0
		},
		{
			"Name": "Frequency",
			"LaTeX": "f",
			"Value": 1
		},
		],
		Eval: function (x) {
			return 1;
		},
		"String": function () {
			return this.Parameters[0].Value+"*u(t)";
		},
		"LaTeXString": function () {
			return this.Parameters[0].Value+"u(t)";
		},
	},
	{
		Name: "Triangular",
		Parameters: [
		{
			"Name": "Amplitude",
			"LaTeX": "A",
			"Value": 1
		},
		{
			"Name": "Start at",
			"LaTeX": "T_0",
			"Value": 0
		},
		{
			"Name": "Offset",
			"LaTeX": "A_0",
			"Value": 0
		},
		{
			"Name": "Frequency",
			"LaTeX": "f",
			"Value": 1
		},
		],
		Eval: function (x) {
			return 1;
		},
		"String": function () {
			return this.Parameters[0].Value+"*u(t)";
		},
		"LaTeXString": function () {
			return this.Parameters[0].Value+"u(t)";
		},
	},
	{
		Name: "Sawtooth",
		Parameters: [
		{
			"Name": "Amplitude",
			"LaTeX": "A",
			"Value": 1
		},
		{
			"Name": "Start at",
			"LaTeX": "T_0",
			"Value": 0
		},
		{
			"Name": "Offset",
			"LaTeX": "A_0",
			"Value": 0
		},
		{
			"Name": "Frequency",
			"LaTeX": "f",
			"Value": 1
		},
		],
		Eval: function (x) {
			return 1;
		},
		"String": function () {
			return this.Parameters[0].Value+"*u(t)";
		},
		"LaTeXString": function () {
			return this.Parameters[0].Value+"u(t)";
		},
	},
	{
		Name: "Rectangular",
		Parameters: [
		{
			"Name": "Amplitude",
			"LaTeX": "A",
			"Value": 1
		},
		{
			"Name": "Start at",
			"LaTeX": "T_0",
			"Value": 0
		},
		{
			"Name": "Offset",
			"LaTeX": "A_0",
			"Value": 0
		},
		{
			"Name": "Frequency",
			"LaTeX": "f",
			"Value": 1
		},
		{
			"Name": "Duty cycle",
			"LaTeX": "D",
			"Value": 0.5
		},
		],
		Eval: function (x) {
			return 1;
		},
		"String": function () {
			return this.Parameters[0].Value+"*u(t)";
		},
		"LaTeXString": function () {
			return this.Parameters[0].Value+"u(t)";
		},
	},
	]
};