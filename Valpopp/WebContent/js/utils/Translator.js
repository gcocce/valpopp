


function Translator(){
	var m_error="";
	var m_file_content="";
    var m_codification="UTF-8";
	
	function readFile(fHandler, callbackFunction){
  		try {
            m_type=fHandler.type;
            m_size=fHandler.size;
            m_name=fHandler.name;
            
           var fReader = new FileReader();
           
           fReader.onerror = function (e){
        	   	m_error=e.target.error;
                console.log("Error code %s", m_error);
                alert(m_error);
           };
            
            fReader.onload = callbackFunction;
                
            fReader.readAsText(fHandler, m_codification);
            
            console.log("FileHandler, file type: "+ fHandler.type);
	    } catch(e) {
	        console.error(e);
	        m_error=e.message;
	        return false;
	    }
    
	    return true;
	}
	
	// Get file contents
	function readFileCallBack(e){
		
		m_file_content=e.target.result;
		
		console.log("File contents:");
		console.log(m_file_content);
		
		
		
		
		
		
	}
	
	// **************************************************************************
	// Public Methods Publication
	//***************************************************************************

	this.translate=translate;
	this.getError=getError;


	//***************************************************************************
	// Public Methods Definition	
	//***************************************************************************
	
	function getError(){
		return m_error;
	}

	function translate(filePointer){
	
		if(filePointer){
			
			if(readFile(filePointer, readFileCallBack)){
				
				
				
				
				
				return true;
			}else{
				return false;
			}
		}else{
			m_error="Error: there is no selected file!";
			console.error(m_error);
			return false;
		}
	}
	
}