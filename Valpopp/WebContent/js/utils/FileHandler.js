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
        console.error("File FileReader FileList Blob not Enabled!");
        m_error="The browser has not fully implemented the html5 standard. Try upgrading your browser.";
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
                    console.log("Error code %s", e.target.error.code);
                    m_error=e.target.error;
               };
                
                fReader.onload = readCallback;
                    
                fReader.readAsText(fHandler, m_codification);
                
                console.log("FileHandler, file type: "+ fHandler.type);
        } catch(e) {
            console.error(e);
            m_error=e.message;
            alert(e);
            return false;
        }
        
        return true;
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