
/* This module is used to register application parameters
 * 
 * The first thing to do is to load this script and set the chosen parameters
 * 
 * To set a parameters it is necessary to call one of the set method like this:
 * 
 * configModule.setParameterName(value);
 * 
 */

// This line is necessary for windows IE
if (!window.console) console = false;

// This is to enable console messages
var debug=false;


var configModule = {
		studentLastName:"Unknown",
		studentName:"Unknown",
		deflang:"en", // must be in the header of the language.csv file
		lang:"en",  // must be in the header of the language.csv file
		user: "basic", // must be one of {"basic", "advanced", "editor"}
		defScenario:"scenarios/scenario_complete_demo.json",
		defSchema:"js/model/schema/scenario_schema.json",
		langFile:"strings/language.csv",
		examplesList:"scenarios/list.csv",
		imgpath:"img/",
		scenarioPath: "scenarios/",
		scenarioImgPath:"scenarios/img/",
		// Space between the arrow of the preceding messages and the start point of the next one
		spaceBetweenMessages: 0,
		// Space between the top of the simulation area and the start point of the first message
		initialSimulationTime: 10,
		//Each Simulation Cicle take place every LOOP_UPDATE_TIME (computer miliseconds)
		simulationLoop:200,  
		 //Every Simulation Cicle the Simulation Time advance SIMULATION_TIME value (miliseconds) 
		simulationTimeAdvance: 4,
		// Establish if it is mandatory to answer every MCQ
		testModeMCQ: false,
		// Establish if the user can see the answers
		showMCQAnswers:true,
		// Establish if it continues inmidiatly after a MCQ or the user has to press Continue button
		continueAfterMCQ:true,
		// Open MCQ dialgo automatically
		automaticOpenMCQ:false,
		// Web service URL (must be in the same domain that the valpo application or the browser security will not allow it)
		webServiceURL:null,
		// Web service method
		webServiceMethod:null,
		
		getWebServiceURL:function(){
			return this.webServiceURL;
		},
		
		getWebServiceMethod:function(){
			return this.webServiceMethod;
		},
		
		setWebServiceURL:function(value){
			this.webServiceURL=value;
		},
		
		setWebServiceMethod:function(value){
			this.webServiceMethod=value;
		},		
		
		setStudentName:function (value){
			this.studentName=value;
		},
		
		getStudentName:function (value){
			return this.studentName;
		},		
		
		setStudentLastName:function (value){
			this.studentLastName=value;
		},

		getStudentLastName:function (value){
			return this.studentLastName;
		},		
		
		setDefaultLanguage:function (value){
			this.deflang=value;
		},
		
		getDefaultLanguage:function (){
			return this.deflang;
		},
		
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
					console.error("ConfigModule: ShowMCQAnswer should be whether true or false.");
				}	
			}
		},
		
		getShowMCQAnswers:function (){
			return this.showMCQAnswers;
		},
		
		setAutomaticOpenMCQ:function (value){
			if (value==true || value==false){
				this.automaticOpenMCQ=value;
			}else{
				if (console && debug){
					console.error("ConfigModule: ShowMCQAnswer should be whether true or false.");
				}	
			}
		},
		
		getAutomaticOpenMCQ:function (){
			return this.automaticOpenMCQ;
		},		
		
		setContinueAfterMCQ:function (value){
			if (value==true || value==false){
				this.continueAfterMCQ=value;
			}else{
				if (console && debug){
					console.error("ConfigModule: ContinueAfterMCQ should be whether true or false.");
				}	
			}
		},
		
		getContinueAfterMCQ:function (){
			return this.continueAfterMCQ;
		},
		
		setTestModeMCQ:function (value){
			if (value==true || value==false){
				this.testModeMCQ=value;
			}else{
				if (console && debug){
					console.error("ConfigModule: MandatoryMCQ should be whether true or false.");
				}	
			}			
			
		},
		
		getTestModeMCQ:function (){
			return this.testModeMCQ;
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
			if (user.localeCompare("basic")==0 || user.localeCompare("advanced")==0 || user.localeCompare("editor")==0){
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
		 },
		 getExamplesList:function(){
			 return this.examplesList;
		 },
		 
		 setExamplesList:function (filename){
			 this.examplesList=filename;
		 }			 
		 
};
