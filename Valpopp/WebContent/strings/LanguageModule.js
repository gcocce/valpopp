
var languageModule = (function () {
	// Privates
	var numLanguages=0;
	var langArr=new Array();
	var m_error="";
	var fileContents="";
	
	// List of available languages
	var languagesId=configModule.getLanguages();
	//var languagesCaption=configModule.get;
	
	// Default Language
	var currentlang = configModule.getLang();

	
	var consts = new Array();
	var jqxhr=$.get('strings/language.csv', function(data){
		fileContents=data;
		consts = data.split('\n');
		var firstline=consts[0];
		langArr=firstline.split(";");
		langArr.shift();
		console.log(langArr);
		consts.shift();
		console.log(consts);
		m_error="File readed";

		// Create a new jQuery.Event object without the "new" operator.
		var eventLanguageFile = $.Event( "LanguageFileLoaded" );
		// Dispatch the event
		$( "body" ).trigger( eventLanguageFile );
	});	
	
	// Set another completion function for the request above
	jqxhr.fail(function() {
	  m_error="Error reading file!";
	});	

	
	// Object to hold all the captions
	var captions= {};
	
	// Variable to hold all the contents of each language file
	var filesContent=new Array();
	
	
	function doInitialization() {
		console.log("languageModule.Initialize()");
		
		if (m_error.localeCompare("")==0){
			m_error="Initialized";	
		}
			
		
		for (var c=0; c < consts.length; c++){
			var tempc=consts;
			var line=tempc[c].split(";");
			
			// Do not consider blank lines
			if (line.length > 1){
				captions[line[0]]={};
			}
		}	
		
		console.log(captions);
		
		for (var c=0; c < consts.length; c++){
			var line=consts[c].split(";");
			
			// Do not consider blank lines
			if (line.length > 1){
				for (var l=1; l<line.length; l++){
					captions[line[0]][langArr[l-1]]=line[l];
					console.log(captions[line[0]][langArr[l-1]]);
				}
			}
		}
		
		console.log(captions);
	}


  // Return an object exposed to the public
	return { 
		getCaption: function (caption){
			console.log("getCaption for: "+ caption + " lang:"+currentlang);
			return captions[caption][currentlang];
		},
		initialize: doInitialization,
		getError: function (){
			return m_error;
		},
		getFileContents: function (){
			return fileContents;
		}
		
	};
}());
