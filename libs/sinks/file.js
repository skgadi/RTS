var gsk_libs_sinks_file = {
	Name : "File",
	Parameters : [{
			Name : "Label",
			Type : "ScalarText",
			Value : [["File"]]
		}, {
			Name : "File type",
			Type : "ScalarOptions",
			Value : [["CSV"]],
			Options : ["CSV", "JSON"]
		},
	],
	MaxOutTerminals : 0,
	MaxInTerminals : 1,
	DialogDiv : null,
	ChartDiv : null,
	DialogID : null,
	ChartID : null,
	ChartData : null,
	InputParams : null,
	PresentOut : null,
	Icon : function () {
		return "images/tex/sinks-figure5.png";
	},
	Constructor : function (data) {},
	Destructor : function (data) {},
	RunTimeExec : function () {},
	Label : function () {
		return this.Parameters[0].Value[0][0];
	},
	Init : function () {
		this.CompiledParams = [];
		this.InputParams = [];
	},
	End : function () {
		var blob;
		var Filename = this.Parameters[0].Value[0][0]+"_"+(new Date()).UniqueMSNumber();
		switch (this.Parameters[1].Value[0][0]) {
		case "CSV":
			blob = new Blob([this.CompiledParams.join('\n')], {
					type : "application/csv"
				});
			Filename += ".csv";
			break;
		case "JSON":
			blob = new Blob([JSON.stringify(this.CompiledParams)], {
					type : "application/json"
				});
			Filename +=  ".json";
			break;
		}
		saveAs(blob, Filename);
	},
	Evaluate : function () {
		switch (this.Parameters[1].Value[0][0]) {
		case "CSV":
			this.CompiledParams.push(SimulationTime + "," + this.InputParams[0].join());
			break;
		case "JSON":
			this.CompiledParams.push({
				"time" : SimulationTime,
				"Signal" : this.InputParams[0]
			});
			break;
		}
	},
	Details : function () {
		return "Generates a file in the " + this.Parameters[1].Value[0][0] + " format.";
	},
	ValidateParams : function () {
		return "OK";
	},
}
