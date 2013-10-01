

window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
   init();
}

var scenario = null;
var scenario_schema=null;
var scenario_obj=null;

function init(){
   console.log("Page Already loaded.");

   // Load schema
   jQuery.getJSON('schema_demo.json', function(data) {
      scenario_schema=JSON.stringify(data);
      console.log("Scenario Schema");
      console.log(scenario_schema);
   })
   .error(function() {
      alert("getJSON ERROR. SCHEMA.JSON is not valid json.");
   });
   
   scenario = new Scenario();   
}
   
function validate() {
   console.log("Se ejecuta validate");
   
   var result= document.getElementById('result');
   result.innerHTML = "";    
   
   var elfile=document.getElementById('file');

   if (!scenario.openFile(elfile)) {
      var error=scenario.getError();
      alert(error);    
   }  
}

function contenido() {
   console.log("Se ejecuta contenido");
      
   var result= document.getElementById('result');
   
   if (scenario.isValid()) {
      result.innerHTML = scenario.getContents();
   }else{
      //result.innerHTML = scenario.getError();
      result.innerHTML = scenario.getContents();
   }
}


//***************************************************************************************


alert("I am working");

function Car( model, year, miles ) {
	  this.model = model;
	  this.year = year;
	  this.miles = miles;
	  
	  this.str=str;
	  
	  function str(){
		  console.log(this.model + " has done " + this.miles + " miles");
	  }
}

// Note here that we are using Object.prototype.newMethod rather than
// Object.prototype so as to avoid redefining the prototype object

Car.prototype.toString = function () {
  return this.model + " has done " + this.miles + " miles";

};

// Usage:

var civic = new Car( "Honda Civic", 2009, 20000 );

var mondeo = new Car( "Ford Mondeo", 2010, 5000 );

 

console.log( civic.toString() );

console.log( mondeo.toString() );

civic.str();
