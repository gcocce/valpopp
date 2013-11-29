

var configModule = {
		// Config properties
		lang:"en",
		user:"basic", // {"basic", "editor"}
		defScenario:"scenarios/scenario_complete_demo.json",
		defSchema:"js/model/schema/scenario_schema.json",
		imgpath:"img/",
		scenarioPath: "scenarios/",
		scenarioImgPath:"scenarios/img/",
		spaceBetweenMessages: 0,
		initialSimulationTime: 10,
		mandatoryMCQ: true,
		continueAfterMCQ:true,
		showMCQAnswers:true,
		
		setShowMCQAnswers:function (value){
			this.showMCQAnswers=value;
		},
		
		getShowMCQAnswers:function (){
			return this.showMCQAnswers;
		},
		
		setContinueAfterMCQ:function (value){
			this.continueAfterMCQ=value;
		},
		
		getContinueAfterMCQ:function (){
			return this.continueAfterMCQ;
		},
		
		setMandatoryMCQ:function (value){
			this.mandatoryMCQ=value;
		},
		
		getMandatoryMCQ:function (){
			return this.mandatoryMCQ;
		},
		
		setInitialSimulationTime:function (time){
			this.initialSimulationTime=time;
		},
		
		getInitialSimulationTime:function (){
			return this.initialSimulationTime;
		},
		
		setSpaceBetweenMessages:function (space){
			this.spaceBetweenMessages=space;
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
			//console.log("configModule.setLang("+lang+")");
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
		 
		// override the current configuration
		setUserMode: function(user) {
			//console.log("configModule.setUserMode("+user+")");
			this.user=user;
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
