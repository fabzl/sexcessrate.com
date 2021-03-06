/*	Author:
	Fabz&co Fabz - Fabian Andrade.. fabz.tv
*/
///// DOWNLOAD

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.download = factory();
  }
}(this, function () {

	return function download(data, strFileName, strMimeType) {

		var self = window, // this script is only for browsers anyway...
			u = "application/octet-stream", // this default mime also triggers iframe downloads
			m = strMimeType || u,
			x = data,
			D = document,
			a = D.createElement("a"),
			z = function(a){return String(a);},
			B = (self.Blob || self.MozBlob || self.WebKitBlob || z);
			B=B.call ? B.bind(self) : Blob ;
			var fn = strFileName || "download",
			blob,
			fr;


		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			x=[x, m];
			m=x[0];
			x=x[1];
		}

		//go ahead and download dataURLs right away
		if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
			return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
				navigator.msSaveBlob(d2b(x), fn) :
				saver(x) ; // everyone else can save dataURLs un-processed
		}//end if dataURL passed?

		blob = x instanceof B ?
			x :
			new B([x], {type: m}) ;


		function d2b(u) {
			var p= u.split(/[:;,]/),
			t= p[1],
			dec= p[2] == "base64" ? atob : decodeURIComponent,
			bin= dec(p.pop()),
			mx= bin.length,
			i= 0,
			uia= new Uint8Array(mx);

			for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

			return new B([uia], {type: t});
		 }

		function saver(url, winMode){

			if ('download' in a) { //html5 A[download]
				a.href = url;
				a.setAttribute("download", fn);
				a.innerHTML = "downloading...";
				D.body.appendChild(a);
				setTimeout(function() {
					a.click();
					D.body.removeChild(a);
					if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
				}, 66);
				return true;
			}

			if(typeof safari !=="undefined" ){ // handle non-a[download] safari as best we can:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
				if(!window.open(url)){ // popup blocked, offer direct download:
					if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
				}
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = D.createElement("iframe");
			D.body.appendChild(f);

			if(!winMode){ // force a mime that will download:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
			}
			f.src=url;
			setTimeout(function(){ D.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fn);
		}

		if(self.URL){ // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		}else{
			// handle non-Blob()+non-URL browsers:
			if(typeof blob === "string" || blob.constructor===z ){
				try{
					return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  );
				}catch(y){
					return saver( "data:" +  m   + "," + encodeURIComponent(blob)  );
				}
			}

			// Blob but not URL:
			fr=new FileReader();
			fr.onload=function(e){
				saver(this.result);
			};
			fr.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */
}));


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
		

	});

	$(function() {
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


		init : function () {

			console.debug('Sexcess rate');
			//Core.Config.setStageSize();
			Core.Config.loadAnswers();
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

			if ($.isNumeric( Core.Config.age) && Core.Config.age != "" ) { 

				validData ++;

			}else{
				Core.Config.textFlavourAge.innerHTML = " not valid, come on ! write your age";
			}

			if ($.isNumeric( Core.Config.virginity ) && Core.Config.virginity != "" ) { 
				validData ++;
			}else{
				Core.Config.textFlavourVirginity.innerHTML = "not valid, are you still a virgin ?";
			}


			if ($.isNumeric( Core.Config.partners ) && Core.Config.partners != "" ) { 
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

			// on getting result
			Core.Config.canvasEraser();
			Core.Config.resultInjectorCanvas("Your Sexcess rate is  :",70,30);
			Core.Config.resultInjectorCanvas(Core.Config.rateTitle,120,45);
			Core.Config.resultInjectorCanvas(Core.Config.rate+"%",200,90);
			Core.Config.resultInjectorCanvas(Core.Config.rateDescription1,250,20);		
			Core.Config.resultInjectorCanvas(Core.Config.rateDescription2,270,20);		
			Core.Config.resultInjectorCanvas(Core.Config.rateDescription3,290,20);	

			Core.Config.activateShareOnCanvasBtns();	
			Core.Config.scrollWindow($(document).height());


		},

		buttonAnimations:function (object) { 

		//	object.classList(".highlighter"); 
			object.classList.toggle("highlighter");

		},

		scrollWindow:function(posY) {
			

			window.scrollTo(0,posY);
			console.log(posY);

			// $('html, body').animate({scrollTop:$(document).height()}, 'slow');

		},

		resultInjectorCanvas : function (text,ypos,fontSize) { 

			var context = Core.Config.canvasObject.getContext("2d");
  			var xpos = Core.Config.canvasObject.width / 2;
  			context.fillStyle = "#312a11";
  			context.fontStyle = "normal";
  			context.font = "normal "+fontSize+"px OstrichSansRounded-Medium";
  			context.textAlign = 'center';
  			context.fillText(text, xpos, ypos);

		},

		/**
		 * Draws a rounded rectangle using the current state of the canvas. 
		 * If you omit the last three params, it will draw a rectangle 
		 * outline with a 5 pixel border radius 
		 * @param {CanvasRenderingContext2D} ctx
		 * @param {Number} x The top left x coordinate
		 * @param {Number} y The top left y coordinate 
		 * @param {Number} width The width of the rectangle 
		 * @param {Number} height The height of the rectangle
		 * @param {Number} radius The corner radius. Defaults to 5;
		 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
		 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
		 */
		roundRect : function (ctx, x, y, width, height, radius, fill, stroke) {
		  if (typeof stroke == "undefined" ) {
		    stroke = true;
		  }
		  if (typeof radius === "undefined") {
		    radius = 5;
		  }
		  ctx.beginPath();
		  ctx.moveTo(x + radius, y);
		  ctx.lineTo(x + width - radius, y);
		  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		  ctx.lineTo(x + width, y + height - radius);
		  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		  ctx.lineTo(x + radius, y + height);
		  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		  ctx.lineTo(x, y + radius);
		  ctx.quadraticCurveTo(x, y, x + radius, y);
		  ctx.closePath();
		  if (stroke) {
		    ctx.stroke();
		  }
		  if (fill) {
		    ctx.fill();
		  }        
		},


		canvasEraser : function () { 
			var context = Core.Config.canvasObject.getContext("2d");
			context.clearRect(0, 0, Core.Config.canvasObject.width, Core.Config.canvasObject.height);
			// draw the colour fill for the img bg
			context.fillStyle = "#c2d14a";
			Core.Config.roundRect(context, 0, 0, Core.Config.canvasObject.width, Core.Config.canvasObject.height,25, true, false);

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

		//	Core.Config.downloadToLocal();

		},

		// postToTwitter: function () { 

		// },

		// postToFacebook : function () { 

		// } ,

		downloadToLocal : function () { 

    		Core.Config.downloadCanvas(this,Core.Config.canvasObject, 'mySexRate.jpg'); 
		},	

		downloadCanvas : function(link, canvasId, filename) {
			

			var dataString = canvasId.toDataURL("image/jpg");
			dataString = dataString.replace("image/jpg", "image/octet-stream");
			// uses the download class to manage the download.
     		download(dataString, filename, "image/octet-stream");

		},

		/** 
		 * The event handler for the link's onclick event. We give THIS as a
		 * parameter (=the link element), ID of the canvas and a filename.
		*/
		tagManagerHandler : function (variable_name,variable_value)  {
			dataLayer.push({ 'variable_name' : 'variable_value' });
			console.log("tag manager");
		}
	}

})(window.Core = window.Core || {}, jQuery);