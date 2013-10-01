

var configModule = {
		// Config properties
		lang:"en",
		listIdLang: ["en", "es"],
		listCaptionLang: ["English", "Espanish"],
		
		user:"basic",
		
		getLanguages:function(){
			return this.listIdLang;
		},
  
		getLang: function () {
			console.log("configModule.getLang()");
			return this.lang;
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
