/*	Author:
	Fabz&co Fabz - Fabian Andrade.. fabz.tv
*/


////////////////////PROTOTYPES

// to add index property to answers
Object.prototype.__index=function(index) {
	var i=-1;
	for (var key in this) {
  		if (this.hasOwnProperty(key) && typeof(this[key])!=='function') {
      	++i;
     	}

   	if (i>=index)
      {
      	return this[key];
      }
  	}
	return null;
}


// to add line breaks to canvas

CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {

    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {

        var words = lines[i].split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        this.fillText(line, x, y);
        y += lineHeight;
    }
}


///////////////////////////////////////////// ad block detection 

function adBlockDetected() {

		console.log("adBlockDetected");
		Core.Config.adBlockRoadBlock();	
		Core.Config.roadBlock.classList.toggle("active");
	}
function adBlockNotDetected() {
		console.log("adBlock NOT Detected");
	}
	
	if(typeof fuckAdBlock === 'undefined') {
		adBlockDetected();
	} else {
		fuckAdBlock.onDetected(adBlockDetected).onNotDetected(adBlockNotDetected);
	}
	
function checkAgain() {
		document.getElementById('adb-enabled').style.display = 'none';
		document.getElementById('adb-not-enabled').style.display = 'none';
		// setTimeout 300ms for the recheck is visible when you click on the button
		setTimeout(function() {
			if(typeof fuckAdBlock === 'undefined') {
				adBlockDetected();
			} else {
				fuckAdBlock.onDetected(adBlockDetected).onNotDetected(adBlockNotDetected);
				fuckAdBlock.check();
			}
		}, 300);
	}





////////////////////////// THE CORE 

;(function(Core, $) {

		// WINDOW.RESIZE
	
	$(window).resize(function() {
		
	//	Core.Config.setStageSize();

	});

	$(function() {
		// Any globals go here in CAPS (but avoid if possible)
		// follow a singleton pattern
		// (http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)
		Core.Config.init();

	});// END DOC READY

	Core.Config = {

		$window:$(window),
		answers:{},
		age : 0,
		virginity : 0,
		partners : 0,
		activeYears : 0,
		activeMonths : 0,
		rate : 0,
		rateTitle: "",
		rateDescription1: "",
		rateDescription2: "",
		rateDescription3: "",

		textAge : document.querySelector(".age"),
		textVirginity : document.querySelector(".virginity"),
		textPartners : document.querySelector(".partners"),
		textResult : document.querySelector(".result"),

		textFlavourAge : document.querySelector(".flavour-age"),
		textFlavourVirginity : document.querySelector(".flavour-virginity"),
		textFlavourPartners : document.querySelector(".flavour-partners"),
		
		calculateRateBtn : document.querySelector(".round-bubble-button"),
		FBshare : document.querySelector(".fb-share"),
		TWshare : document.querySelector(".tw-share"),
		downloadBtn : document.querySelector(".download-btn"),


		canvasObject : document.getElementById("canvas"),

		roadBlock : document.getElementById("roadBlock"),

		adBlockRoadBlock : function () { 

		},

		init : function () {

			console.debug('Sexcess rate');
			//Core.Config.setStageSize();
			Core.Config.loadAnswers();
		},

		
		setStageSize:function() {

			// Returns height of HTML document

			Core.Config.$window.stageH = Core.Config.getDimensionsHeight(Core.Config.$window);

			Core.Config.$window.stageW = Core.Config.getDimensionsWidth(Core.Config.$window);

			console.log("stage size is H : ", Core.Config.$window.stageH,"W : ",Core.Config.$window.stageW);

		},

		getDimensionsHeight:function (obj) {

			var value = obj.height();
			return value;
		},

		 getDimensionsWidth :function(obj) {

			var value = obj.width();
			return value;
		},

		loadAnswers  : function (rate) {

			var url = "../data/answers.json"
		
			$.getJSON(url, function (json) {
	    		//	console.log(json);
	 			Core.Config.answers = json.answers;
	 			Core.Config.activateButtons();

			});
		},

		activateButtons : function () {

			Core.Config.listenForChanges(".age",Core.Config.getAgeAnswer);
			Core.Config.listenForChanges(".virginity",Core.Config.getVirginityAnswer);	
			Core.Config.listenForChanges(".partners",Core.Config.getPartnersAnswer);
			Core.Config.calculateRateBtn.addEventListener("click",Core.Config.outputResult);
		},

		outputResult : function (event) {

			event.preventDefault();
			
			var validData  = 0;

			Core.Config.age = Number(Core.Config.textAge.value.toString());
			Core.Config.virginity = Number(Core.Config.textVirginity.value.toString());
			Core.Config.partners = Number(Core.Config.textPartners.value.toString());	

			if ($.isNumeric( Core.Config.age) ) { 

				validData ++;

			}else{
				Core.Config.textFlavourAge.innerHTML = " not valid, come on ! write your age";
			}

			if ($.isNumeric( Core.Config.virginity) ) { 
				validData ++;
			}else{
				Core.Config.textFlavourVirginity.innerHTML = "not valid, are you still a virgin ?";
			}


			if ($.isNumeric( Core.Config.partners) ) { 
				validData ++;
			}else{	
				Core.Config.textFlavourPartners.innerHTML = "Not valid, it might be though to remember.";
			}


			if(validData === 3 ) {

				if ( Core.Config.virginity <= Core.Config.age ) { 

					Core.Config.calculateRate();

				}else{
					Core.Config.textFlavourAge.innerHTML = "not valid, you little liar !";
					Core.Config.textFlavourVirginity.innerHTML = "not valid, future plans don't count.";
				}
			}
		},

		calculateRate : function () {

			var rateVirginity;
			var rateActivity;
			var ratePartners;
			var rateSucess;
			var activeYearsForRate;

			Core.Config.activeYears = Core.Config.age - Core.Config.virginity;
//			Core.Config.activeMonths = Core.Config.activeYears*12;
		
			// we set the partners range to a maximun of 100
			if(	Core.Config.partners >= 100 ) {
				Core.Config.partners = 100;
			};

			if(	Core.Config.partners <= 0 ) {
				Core.Config.partners = 1;
			};
 			// 20 points will be assigned for when you lose your virginity.
			rateVirginity = 21 - Core.Config.virginity;
			
			if(rateVirginity < 0 ) { 

				rateVirginity = 0;
			};
			if (rateVirginity > 20) { 

				rateVirginity = 20;
			};

			// 10 points will be assigned for the number of active years; 
			rateActivity = Core.Config.activeYears;
			
			if(rateActivity >= 10 ) { 

				rateActivity = 10;
			};
			if(rateActivity <= 0 ) { 

				rateActivity = 0;
			};
			//20 points will be assigner for the rate of girls you sleep with
			ratePartners = Math.round(Core.Config.partners*.5);
			if(ratePartners >= 20 ) { 
				ratePartners = 20;
			};

			if(ratePartners <= 0 ) { 
				ratePartners = 0;
			};
			// 50 points based on your success getting laid.

			rateSuccess = (Math.round((Core.Config.partners/Core.Config.activeYears)*10));

			if(rateSuccess >= 50 ) { 
				rateSuccess  = 50;
			}
			if(rateSucess <= 0 ) { 
				rateSucess = 0;
			}

			Core.Config.rate  = rateVirginity + rateActivity +ratePartners + rateSuccess;

			console.log("your rateVirginity is : ", rateVirginity );
			console.log("your rateActivity is : ", rateActivity );
			console.log("your ratePartners is : ", ratePartners );
			console.log("your rateSuccess is : ",  rateSuccess );
			console.log("your rate is : ", Core.Config.rate );

			Core.Config.getRateAnswer();

		},

		emptyInvalidTexfield : function (elementToBlank) {
			elementToBlank.value = null;		 
		},

		resultInjector : function () { 

			Core.Config.canvasEraser();
			Core.Config.resultInjectorCanvas("Your Sexcess rate is  :",70,30);
			Core.Config.resultInjectorCanvas(Core.Config.rateTitle,120,45);
			Core.Config.resultInjectorCanvas(Core.Config.rate+"%",200,90);
			Core.Config.resultInjectorCanvas(Core.Config.rateDescription1,250,20);		
			Core.Config.resultInjectorCanvas(Core.Config.rateDescription2,270,20);		
			Core.Config.resultInjectorCanvas(Core.Config.rateDescription3,290,20);	


			Core.Config.activateShareOnCanvasBtns();	
		},

		resultInjectorCanvas : function (text,ypos,fontSize) { 

			var context = Core.Config.canvasObject.getContext("2d");
  			var xpos = Core.Config.canvasObject.width / 2;
      	//	var ypos = Core.Config.canvasObject.height / 2;
  			context.fillStyle = "#312a11";
  			context.font = "bold "+fontSize+"px OstrichSansRounded-Medium";
  			context.textAlign = 'center';
  			context.fillText(text, xpos, ypos);

		},
		canvasEraser : function () { 
			var context = Core.Config.canvasObject.getContext("2d");
			context.clearRect(0, 0, Core.Config.canvasObject.width, Core.Config.canvasObject.height);
		},

		getRateAnswer : function () { 
		
			var keyValue = Math.round(Core.Config.rate/10);
			Core.Config.rateTitle =  Core.Config.answersManager("rate",keyValue).title;
			Core.Config.rateDescription1 = Core.Config.answersManager("rate",keyValue).description1;
			Core.Config.rateDescription2 = Core.Config.answersManager("rate",keyValue).description2;
			Core.Config.rateDescription3 = Core.Config.answersManager("rate",keyValue).description3;

			Core.Config.resultInjector();
		
		},

		getAgeAnswer : function () { 


			var answerAge;
			var keyValue;
			Core.Config.age = Core.Config.textAge.value.toString();

			if(Core.Config.age!='') {
						
					if (Core.Config.age > 99 ) { 
						Core.Config.textAge.value = 99;	
					}

					keyValue  = Math.round(Core.Config.age/10);
					if (keyValue > 9 ) { 
						keyValue = 9;
					} 
					//console.log("key value",keyValue);
	
					answerAge = Core.Config.answersManager("age",keyValue);

				} else { 

					answerAge = "";
				}

				Core.Config.textFlavourAge.innerHTML = answerAge;
		},

		getVirginityAnswer : function () { 

			var answerVirginity;
			var keyValue;
			
			Core.Config.virginity = Core.Config.textVirginity.value.toString();

			if(Core.Config.virginity!='') {
						
					if (Core.Config.virginity > 99 ) { 
						Core.Config.textVirginity.value = 99;	
					}

					keyValue  = Math.round(Core.Config.virginity/10);
					if (keyValue > 9 ) { 
						keyValue = 9;
					} 
					//console.log("key value",keyValue);
	
					answerVirginity = Core.Config.answersManager("virginity",keyValue);

				} else { 

					answerVirginity = "";
				}

				Core.Config.textFlavourVirginity.innerHTML = answerVirginity;
		},

		getPartnersAnswer : function () { 

			
			var answerPartners;
			var keyValue;
			
			Core.Config.Partners = Core.Config.textPartners.value.toString();

			if(Core.Config.Partners!='') {
						
					if (Core.Config.Partners > 999 ) { 
						Core.Config.textPartners.value = 999;	
					}
					if (Core.Config.Partners < 99 ) { 
						
						keyValue  = Math.floor(Core.Config.Partners/10);

					}else {
						keyValue  = 9;
					}
					if (keyValue > 9 ) { 
						keyValue = 9;
					} 

					answerPartners = Core.Config.answersManager("partners",keyValue);

				} else { 


					answerPartners = "";
				}

				Core.Config.textFlavourPartners.innerHTML = answerPartners;
		},


		answersManager : function (question,value) {

			var answer ; 
			switch(question) {
	 		   case "rate":
		    		answer = Core.Config.answers.rateAnswers.__index(value);
	      		break;
	    		case "age":
			    	answer = Core.Config.answers.flavourAnswersAge.__index(value).toString();
	        	break;
	        	case "virginity":
	    			answer = Core.Config.answers.flavourAnswersVirginity.__index(value).toString();
	        	break;
	        	case "partners":
	        		answer = Core.Config.answers.flavourAnswersPersons.__index(value).toString();
	        	break;
	   			
				}
			//	console.log("answer :", answer);
			return answer;
				
			},

		listenForChanges : function (object,func) { 
		
			$(object).on("change keyup paste click",func);

		},

		activateShareOnCanvasBtns : function () { 

			Core.Config.downloadBtn.addEventListener("click",Core.Config.downloadToLocal);

//			Core.Config.TWshare.addEventListener("click",postToTwitter);
//			Core.Config.TWshare.addEventListener("click",postToFacebook);

		},

		postToTwitter: function () { 

		},

		postToFacebook : function () { 

		} ,

		downloadToLocal : function () { 

			    // var canvas = document.getElementById("mycanvas");
    			// var img    = canvas.toDataURL("image/jpeg");
    			// document.write('<img src="'+mySexRate+'"/>');
    			console.log("downloadToLocal");
    			downloadCanvas(this, 'canvas', 'mySexRate.png'); 
		},

		/**
		 * This is the function that will take care of image extracting and
		 * setting proper filename for the download.
		 * IMPORTANT: Call it from within a onclick event.
		*/
		downloadCanvas : function(link, canvasId, filename) {
		    link.href = document.getElementById(canvasId).toDataURL();
		    link.download = filename;
		}

		/** 
		 * The event handler for the link's onclick event. We give THIS as a
		 * parameter (=the link element), ID of the canvas and a filename.
		*/

	}

})(window.Core = window.Core || {}, jQuery);



