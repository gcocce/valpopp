

/* This module is used to register application parameters
 * 
 * The first thing to do is to load this script and set the chosen parameters
 * 
 * To set a parameters it is necessary to call one of the set method like this:
 * 
 * configModule.setParameterName(value);
 * 
 */

var configModule = {
		lang:"en",
		user: "basic", // must be one of {"basic", "advance", "editor"}
		defScenario:"scenarios/scenario_complete_demo.json",
		defSchema:"js/model/schema/scenario_schema.json",
		langFile:"strings/language.csv",
		imgpath:"img/",
		scenarioPath: "scenarios/",
		scenarioImgPath:"scenarios/img/",
		spaceBetweenMessages: 0,
		initialSimulationTime: 10,
		simulationLoop:200,  //Each Simulation Cicle take place every LOOP_UPDATE_TIME (computer miliseconds)
		simulationTimeAdvance: 4, //Every Simulation Cicle the Simulation Time advance SIMULATION_TIME value (miliseconds) 
		mandatoryMCQ: true,
		continueAfterMCQ:true,
		showMCQAnswers:true,
		
		getSimulationLoopTime:function(){
			return this.simulationLoop;
		},
		
		setSimulationLoopTime:function (time){
			if (!isNaN(parseFloat(time)) && isFinite(time) && time >= 10){
				this.simulationLoop=time;
			}else{
				if (console && debug){
					console.error("ConfigModule: SimulationLoopTime should be a number greater or equal than 10.");
				}				
			}			
		},
		
		getSimulationTimeAdvance:function (){
			return this.simulationTimeAdvance;
		},
		
		setSimulationTimeAdvance:function(time){
			if (!isNaN(parseFloat(time)) && isFinite(time) && time > 0){
				this.simulationTimeAdvance=time;
			}else{
				if (console && debug){
					console.error("ConfigModule: SimulationTimeAdvance should be a number greater than 0.");
				}				
			}				
		},
		
		getLanguageFile:function(){
			return this.langFile;
		},

		setShowMCQAnswers:function (value){
			if (value==true || value==false){
				this.showMCQAnswers=value;
			}else{
				if (console && debug){
					console.error("ConfigModule: ShowMCQAnswer should be whether \"true\" or \"false\".");
				}	
			}
		},
		
		getShowMCQAnswers:function (){
			return this.showMCQAnswers;
		},
		
		setContinueAfterMCQ:function (value){
			if (value==true || value==false){
				this.continueAfterMCQ=value;
			}else{
				if (console && debug){
					console.error("ConfigModule: ContinueAfterMCQ should be whether \"true\" or \"false\".");
				}	
			}
		},
		
		getContinueAfterMCQ:function (){
			return this.continueAfterMCQ;
		},
		
		setMandatoryMCQ:function (value){
			if (value==true || value==false){
				this.mandatoryMCQ=value;
			}else{
				if (console && debug){
					console.error("ConfigModule: MandatoryMCQ should be whether \"true\" or \"false\".");
				}	
			}			
			
		},
		
		getMandatoryMCQ:function (){
			return this.mandatoryMCQ;
		},
		
		setInitialSimulationTime:function (time){
			if (!isNaN(parseFloat(space)) && isFinite(space) && space >= 0){
				this.initialSimulationTime=time;
			}else{
				if (console && debug){
					console.error("ConfigModule: InitialSimulationTime should be a number greater or equal than zero.");
				}				
			}			
		},
		
		getInitialSimulationTime:function (){
			return this.initialSimulationTime;
		},
		
		setSpaceBetweenMessages:function (space){
			if (!isNaN(parseFloat(space)) && isFinite(space) && space >= 0){
				this.spaceBetweenMessages=space;
			}else{
				if (console && debug){
					console.error("ConfigModule: SpaceBetweenMessages should be a number greater or equal than zero.");
				}				
			}
		},
		
		getSpaceBetweenMessages:function (){
			return this.spaceBetweenMessages;
		},
		
		setScenarioPath: function (path){
			this.scenarioPath=path;
		},
		
		getScenarioPath: function (){
			return this.scenarioPath;
		},		
		
		setScenarioImgPath: function (path){
			this.scenarioImgPath=path;
		},
		
		getScenarioImgPath: function (){
			return this.scenarioImgPath;
		},

		getLang: function () {
			return this.lang;
		},
		
		setLang: function (lang){
			this.lang=lang;	  
		},		
		
		getDefaultScenario:function (){
			return this.defScenario;
		},
		
		setDefaultScenario:function (scen){
			this.defScenario=scen;
		},

		getUserMode: function(  ) {
			return this.user;
		 },
		 
		setUserMode: function(user) {
			if (user.localeCompare("basic")==0 || user.localeCompare("advance")==0 || user.localeCompare("editor")==0){
				this.user=user;	
			}else{
				if (console && debug){
					console.error("ConfigModule: User parameter is not accepted.");
				}
			}
		 },
		 
		 getAppImgPath:function(){
			 return this.imgpath;
		 },
		 
		 setAppImgPath:function (path){
			 this.imgpath=path;
		 },
		 
		 getDefaultSchema:function(){
			 return this.defSchema;
		 },
		 
		 setDefaultSchema:function (schema){
			 this.defSchema=schema;
		 }		 
		 
};
