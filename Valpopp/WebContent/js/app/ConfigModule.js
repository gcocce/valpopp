

var configModule = {
		// Config properties
		lang:"en",
		user:"basic", // {"basic", "editor"}
		defScenario:"scenarios/scenario_syntax_demo.json",
		defSchema:"js/model/schema/scenario_schema.json",
		imgpath:"img/",
		scenarioImgPath:"scenarios/img/",
		spaceBetweenMessages: 0,
		
		setSpaceBetweenMessages:function (space){
			this.spaceBetweenMessages=space;
		},
		
		getSpaceBetweenMessages:function (){
			return this.spaceBetweenMessages;
		},
		
		setScenarioImgPath: function (path){
			this.scenarioImgPath=path;
		},
		
		getScenarioImgPath: function (){
			return this.scenarioImgPath;
		},

		getLang: function () {
			console.log("configModule.getLang()");
			return this.lang;
		},
		
		setLang: function (lang){
			console.log("configModule.setLang("+lang+")");
			this.lang=lang;	  
		},		
		
		getDefaultScenario:function (){
			return this.defScenario;
		},
		
		setDefaultScenario:function (scen){
			this.defScenario=scen;
		},

		getUserMode: function(  ) {
			console.log("configModule.getUserMode()");
			return this.user;
		 },
		 
		// override the current configuration
		setUserMode: function(user) {
			console.log("configModule.setUserMode("+user+")");
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
