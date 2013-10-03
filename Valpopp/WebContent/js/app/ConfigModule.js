

var configModule = {
		// Config properties
		lang:"es",
		user:"basic",
		defScenario:"scenarios/scenario_syntax_demo.json",

		getLang: function () {
			console.log("configModule.getLang()");
			return this.lang;
		},
		
		getDefaultScenario:function (){
			return this.defScenario;
		},
  
		setLang: function (lang){
			console.log("configModule.setLang()");
			this.lang=lang;	  
		},

		getUserMode: function(  ) {
			console.log("configModule.getUserMode()");
			return this.user;
		 },
		 
		// override the current configuration
		setUserMode: function(user) {
			console.log("configModule.setUserMode()");
			this.user=user;
		 }		 
};
