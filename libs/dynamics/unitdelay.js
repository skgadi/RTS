gsk_libs_dynamics_unitdelay = {
	Name : "Unit delay",
	Parameters : [{
			Name : "Initial conditions",
			Type : "MatComplex",
			Value : [[1]],
		}, {
			Name : "Label",
			Type : "ScalarText",
			Value : [[""]]
		},
	],
	Label : function () {
		return this.Parameters[1].Value[0][0];
	},
	FirstInExecutionOrder: true,
	MaxInTerminals : 1,
	MaxOutTerminals : MaxOutTerminalsAllowedToUse,
	Icon : function () {
		return "images/tex/dynamics-figure0.png"
	},
	Init : function () {
		var Compiled_InitVal = [];
		for (var i=0; i<this.Parameters[0].Value.length; i++) {
			var Temp_InitVal = [];
			for (var j=0; j<this.Parameters[0].Value[0].length; j++) {
				Temp_InitVal.push(math.eval(this.Parameters[0].Value[i][j]));
			}
			Compiled_InitVal.push(Temp_InitVal);
		}
		this.CompiledParams = [Compiled_InitVal];
		this.InputParams = [];
	},
	End : function () {},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Evaluate : function () {
		console.log(this.CompiledParams);
		console.log(this.InputParams);
		if ((this.InputParams.length>0) && (this.InputParams[0].length>0) && (this.InputParams[0][0].length>0)) this.CompiledParams.push(math.clone(this.InputParams[0]));
		console.log(this.CompiledParams);
		return this.CompiledParams.shift();
	},
	Details : function () {
		return "Gives a unit delay<br/>$$\\frac{Y(z)}{X(z)} = \\frac{1}{z}$$";
	},
	ValidateParams : function () {
		return "OK";
	},
}
