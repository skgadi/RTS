gsk_libs_dynamics_integral = {
	Name : "Integral",
	Parameters : [{
			Name : "Initial conditions",
			Type : "MatComplex",
			Value : [[0]],
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
		return "images/tex/dynamics-figure1.png"
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
		if ((this.InputParams.length>0) && (this.InputParams[0].length>0) && (this.InputParams[0][0].length>0))
			this.CompiledParams[0] = math.add( this.CompiledParams[0], math.dotMultiply( SamplingTimeMs/1000, math.clone(this.InputParams[0])));
		return this.CompiledParams[0];
	},
	Details : function () {
		return "Integrates the input signal over time";
	},
	ValidateParams : function () {
		return "OK";
	},
}
