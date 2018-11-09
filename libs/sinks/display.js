gsk_libs_sinks_display = {
	Name: "Display",
	Parameters: [{
			Name: "Update display (s)",
			Type: "ScalarReal",
			Value: [[1]],
		}, {
			Name : "Round to digits",
			Type : "MatInteger",
			Value : [[3]]
		},
	],
	Label: function () {
		return "/\\/\\/\\/\\";
	},
	MaxInTerminals: 1,
	MaxOutTerminals: 0,
	/*Icon : function () {
	return "images/tex/functions-figure2.png"
	},*/
	Init: function () {
		this.InputParams = [];
		this.CompiledParams[1] = math.eval(this.Parameters[0].Value[0][0]);
		this.CompiledParams[2] = 0;
		this.CompiledParams[3] = math.eval(this.Parameters[1].Value[0][0]);
		network.manipulation.body.data.nodes.getDataSet().update({
				id: this.CompiledParams[0],
				label: this.Label(),
			});
	},
	End: function () {},
	Constructor: function (data) {
		this.CompiledParams = [data.id, 0, 0, 0];
	},
	Destructor: function (data) {},
	RunTimeExec: function () {},
	Evaluate: function () {
		//console.log(this.InputParams);
		if (PauseTheSimulation || RealTime===0 || (RealTime >= (this.CompiledParams[1] + this.CompiledParams[2]))) {
			var StrToDisp = "";
			for (var i = 0; i < this.InputParams[0].length; i++) {
				for (var j = 0; j < this.InputParams[0][0].length; j++) {
					if (j>0) StrToDisp += ", \t";
					StrToDisp += (math.round(this.InputParams[0][i][j], this.CompiledParams[3])).toString();
				}
				if (j>0) StrToDisp += "\n";
			}
			network.manipulation.body.data.nodes.getDataSet().update({
				id: this.CompiledParams[0],
				label: StrToDisp,
			});
			if ( (!PauseTheSimulation) && (RealTime!==0)) this.CompiledParams[2] += this.CompiledParams[1];
		}
		return;
	},
	Details: function () {
		return "Displays the signal at every $" + math.eval(this.Parameters[0].Value[0][0]) + "$ seconds. <br> Each number is rounded to " + math.eval(this.Parameters[1].Value[0][0]) + " decimal places";
	},
	ValidateParams: function () {
		return "OK";
	},
}
