

var languageModule = (function () {
	// Field Separator
	var SEP=";";
	
	// Error message
	var m_error="";
	
	// Number of available languages
	var numLanguages=0;
	var numConstants=0;
	
	// List of available languages Ids
	var langIdList=new Array();

	// List of available languages Captions
	var langCaptionList=new Array();
	
	// Default Language
	var currentlang = configModule.getLang();
	
	// Language File Content
	var fileContents="";
	
	// Object to hold all the captions in the different languages
	var captions= {};
	
	// Language File Lines
	var lflines = new Array();
	
	// Load file languages content
	var jqxhr=$.get('strings/language.csv', function(data){
		// For deguggin purpuse
		fileContents=data;
		
		lflines = data.split('\n');
		var firstline=lflines[0];
		var langArr=firstline.split(SEP);
		langArr.shift();
		console.log(langArr);
		
		numLanguages=langArr.length;
		if (numLanguages < 1){
			m_error="Problem in the Language File Header";
		}else{
			// Process language file header, get the id and caption for each available language
			for (var l=0; l < langArr.length; l++){
				var lang=langArr[l];
				lang=lang.split(":");
				langIdList.push(lang[0]);
				langCaptionList.push(lang[1]);
			}			
		}
	
		// Remove the header of the language file
		lflines.shift();
		
		console.log(lflines);
		
		//TODO: replace the next by calling to a function like modifyLayout()
		
		// Create a new jQuery.Event object without the "new" operator.
		var eventLanguageFile = $.Event( "LanguageFileLoaded" );
		// Dispatch the event
		$(window).trigger( eventLanguageFile );
	});	
	
	// Set another completion function for the request above
	jqxhr.fail(function() {
	  m_error="Error reading file!";
	});	

	// Initialize Module
	function doInitialization() {
		console.log("languageModule.Initialize()");
		
		// If there is no previous error
		if (m_error.localeCompare("")==0){
			
			var tempc=lflines;
			
			// For each line in the Language File
			for (var c=0; c < lflines.length; c++){
				var line=tempc[c].split(SEP);
				
				// Do not consider blank lines
				if (line.length > 1){
					
					// Creates a property of type object with the name of the Constant
					captions[line[0]]={};
				}
			}	
			
			console.log(captions);
			
			// For each line in the Language File
			for (var c=0; c < lflines.length; c++){
				// Separate each line into its contents
				var line=lflines[c].split(SEP);
				
				// Do not consider blank lines
				if (line.length > 1){
					
					// Test that every line has a translation for the number of available languages
					if (line.length - 1 < numLanguages){ //(The line has also the Constant that why -1)
						m_error="Missing translation for: " + line[0];
						return false;
					}else if (line.length - 1 > numLanguages){
						m_error="More translation than languages availables("+numLanguages+") for: " + line[0];
						return false;
					}
					
					numConstants++;
					
					// For each available language
					for (var l=1; l<line.length; l++){
						// Add property to the object with the Constant Name 
						captions[line[0]][langIdList[l-1]]=line[l];
						
						// For debugging purpose
						console.log(captions[line[0]][langIdList[l-1]]);
					}
				}
			}
			
			console.log(captions);			
		}
		
		
		return true;
	}


  // Return an object exposed to the public
	return { 
		getCaption: function (caption){
			console.log("languageModule.getCaption for: "+ caption + " in lang:"+ currentlang);
			return captions[caption][currentlang];
		},
		initialize: doInitialization,
		getError: function (){
			return m_error;
		},
		getFileContents: function (){
			return fileContents;
		},
		getNumberofLanguages: function(){
			return numLanguages;
		},
		getAvailableLanguages: function (){
			return langCaptionList;
		},
		getCurrentLanguage: function (){
			var pos = langIdList.indexOf(currentlang);
			return langCaptionList[pos];
		},
		getNumConstants: function (){
			return numConstants;
		}
	};
}());
