/*	Author:
	Fabz&co Fabz - Fabian Andrade.. fabz.tv
*/

// Create a closure to maintain scope of the '$' and Core

;(function(Core, $) {
	$(function() {
		// Any globals go here in CAPS (but avoid if possible)
		// follow a singleton pattern
		// (http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)
		Core.Config.init();

	});// END DOC READY

	Core.Config = {
		age : 0,
		virginity : 0,
		partners : 0,
		activeyears : 0,
		rate : 0,
		answers : [],
		ageRangeMin: 1,
		ageRangeMax: 117,
		partnersRangeMin:0,
		partnersRange:666,
		

		textAge : document.querySelector(".age"),
		textVirginity : document.querySelector(".virginity"),
		textPartners : document.querySelector(".partners"),
		textResult : document.querySelector(".result"),

		textFlavourAge : document.querySelector(".flavour-age"),
		textFlavourVirginity : document.querySelector(".flavour-virginity"),
		textFlavourPaople : document.querySelector(".flavour-people"),
		
		calculateRateBtn : document.querySelector(".round-bubble-button"),
		FBshare : document.querySelector(".fb-share"),
		TWshare : document.querySelector(".tw-share"),

		canvasObject : document.getElementById("canvas"),





		init : function () {

			console.debug('Sexcess rate');
			Core.Config.calculateRateBtn.addEventListener("click",Core.Config.outputResult);
		},

		outputResult : function (event) {

			event.preventDefault();
			console.log("outputResult")
			Core.Config.formHarvest();
			
			console.log("values : ",Core.Config.age,Core.Config.virginity,Core.Config.partners);
			
			Core.Config.activeyears = Core.Config.age - Core.Config.virginity;

			Core.Config.rate  = Core.Config.activeyears / Core.Config.partners*100;

			console.log("your rate is : ", Core.Config.rate );	

			Core.Config.resultInjector();		
		},

		formHarvest : function () { 

			console.log('formHarvest');
			Core.Config.age = Core.Config.textAge.value.toString();
			Core.Config.virginity = Core.Config.textVirginity.value.toString();
			Core.Config.partners = Core.Config.textVirginity.value.toString();	
			
			if(Core.Config.isNumber(Core.Config.age)!="null") {
				console.log("nice and valid age!")
				Core.Config.emptyInvalidTexfield(Core.Config.age);
				
				if(Core.Config.age=='') {
					console.log("empty");
					Core.Config.textFlavourAge.value = "enter a number";

				}

				//textFlavourVirginity.value = "enter a number";
			//	textFlavourPaople.value = "enter a number";



			}else{
				console.log("invalid age");
			}	
			if(Core.Config.isNumber(Core.Config.virginity)!=null) {
				console.log("nice and valid virginity!")
				Core.Config.emptyInvalidTexfield(Core.Config.virginity);

			}else{
				console.log("invalid virginity");
				Core.Config.emptyInvalidTexfield(Core.Config.partners);

			}	
			if(Core.Config.isNumber(Core.Config.partners)!=null) {
				console.log("nice and valid partners!")
			}else{
				console.log("invalid partners");
				Core.Config.emptyInvalidTexfield(Core.Config.partners);
			}	

			console.log("isNUmber:",Core.Config.isNumber(Core.Config.age));


		},

		emptyInvalidTexfield : function (elementToBlank) {
			elementToBlank.value =null;		 
		},

		isNumber : function (v) { 

			  // [0-9]* Zero or more digits between 0 and 9  (This allows .25 to be considered valid.)
			  // ()? Matches 0 or 1 things in the parentheses.  (Allows for an optional decimal point)
			  // Decimal point escaped with \.
			  // If a decimal point does exist, it must be followed by 1 or more digits [0-9]
			  // \d and [0-9] are equivalent 
			  // ^ and $ anchor the endpoints so tthe whole string must match.
			  return v.trim().length > 0 && v.trim().match(/^[0-9]*(\.[0-9]+)?$/);
		},

		resultInjector : function () { 

	      
	    
	      //  Core.Config.textResult.appendChild(document.createTextNode(Core.Config.rate));
	      	Core.Config.resultInjectorCanvas(Core.Config.rate);
		},

		resultInjectorCanvas : function (text) { 

			var context = Core.Config.canvasObject.getContext("2d");
  			context.fillStyle = "#312a11";
  			context.font = "bold 90px OstrichSansRounded-Medium";
  			context.fillText(text, 165, 155);


		},


	activateShareOnCanvasBtns : function () { 

		Core.Config.TWshare.addEventListener("click",postToTwitter);

		Core.Config.TWshare.addEventListener("click",postCanvasToFacebook);
		

	}


	};

	// Example module
	/*
	Core.MyExampleModule = {
		init : function () {
			Core.MyExampleModule.setupEvents();
		},

		setupEvents : function () {
			//do some more stuff in here
		}
	};
	*/

})(window.Core = window.Core || {}, jQuery);




