// This classe is intended to manipulate File, FileReader, FileList and Blob Apis
// and to provide a secure way to manipulate local files


function FileHandler() {
	
	// ******************************************************************************
	// Properties
	// ******************************************************************************	
    var m_enabled=false;
    var m_codification="UTF-8";
    var m_error=null;
    
    var m_contents=null;
    var m_type=null;
    var m_size=null;
    var m_name=null;
       
	// ******************************************************************************
	// Constructor
	// ******************************************************************************    
      
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        m_enabled=true;
    }else{
    	
    	if (console){
    		console.error("File FileReader FileList Blob not Enabled!");	
    	}
        
        m_error=languageModule.getCaption("FH_ERROR_BROWSER_NOT_HTML5");
    }
    
	// ******************************************************************************
	// Private Methods
	// ******************************************************************************
    
    
	// ******************************************************************************
	// Public Methods Publication
	// ******************************************************************************    
    this.isEnabled=isEnabled;
    this.setCodification=setCodification;
    this.openJsonFile=openJsonFile;
    this.openImageFile=openImageFile;
    this.getName=getName;
    this.getType=getType;
    this.setType=setType;
    this.getSize=getSize;
    this.getError=getError;   
    
	// ******************************************************************************
	// Public Methods Definition
	// ******************************************************************************

    function isEnabled() {
        return m_enabled;
    }
    
    function setCodification(arg) {
        m_codification=arg;
    }
    
    /* The parameter must be an input file html element */
    /* Returns true or false according to result */
    function openJsonFile(fHandler, readCallback) {
    	
   		try {
                m_type=fHandler.type;
                m_size=fHandler.size;
                m_name=fHandler.name;
                
               var fReader = new FileReader();
               
               fReader.onerror = function (e){
            	   
            	   if (console){
            		   console.log("Error code %s", e.target.error.code);
            	   }
                    
                    m_error=e.target.error;
               };
                
                fReader.onload = readCallback;
                    
                fReader.readAsText(fHandler, m_codification);
                
                if (console){
                	console.log("FileHandler, file type: "+ fHandler.type);
                }
        } catch(e) {
            console.error(e);
            m_error=e.message;
            alert(e);
            return false;
        }
        
        return true;
    }
    
    /* The parameter must be an input file html element */
    /* Returns true or false according to result */
    function openImageFile(fHandler) {
   		try {
   			if (console){
   				console.log("FileHandler, process file : "+ fHandler.name);
   			}
            
            // Read the image using FileReader
            readImage(fHandler, fHandler.name);
            
        }catch(e) {
        	if (console){
        		console.error(e);	
        	}
            
            m_error=e.message;
            return false;
        }
        
        return true;
    }
    
    function readImage(fHandler, file_name){
        var fReader = new FileReader();
        
        fReader.onerror = function (e){
        	
        	if (console){
            	console.log("Local Image loading error: ", file_name);
                console.log("Error code %s", e.target.error.code);
        	}
            
 			var event = $.Event( "LocalScenarioImageLoadingError" );
            event.imageError=e.target.error.code;
  			event.imageName=file_name; 			
 			
 			$(window).trigger( event );
        };
         
         fReader.onload = function (e){
        	//console.log("Local Image succesfuly read: ", file_name);
        	 
  			var event = $.Event( "LocalScenarioImageLoaded" );
  			event.imageData=e.target.result;
  			event.imageName=file_name;
  			
 			$(window).trigger( event );        	 
         };
             
         fReader.readAsDataURL(fHandler);    	
    }
    
    function getName() {
        return m_name;
    }
    
    function getType() {
        return m_type;
    }
    
    function setType(arg) {
        m_type=arg;
    }
    
    function getSize() {
        return m_size;
    }
   
    function getError() {
        return m_error;
    }
}