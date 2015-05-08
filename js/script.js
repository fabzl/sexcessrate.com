/*	Author:
		TMW - (Author Name Here)
*/

// Create a closure to maintain scope of the '$' and KO (Kickoff)
;(function(KO, $) {

	$(function() {
		// Any globals go here in CAPS (but avoid if possible)

		// follow a singleton pattern
		// (http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)

		KO.Config.init();

	});// END DOC READY


	KO.Config = {
		age : '0', // please don't keep me - only for example syntax!
		virginity : '0',
		partners :'0',
		activeyears : '0',
		rate : '0',
		answers : [],

		init : function () {
			console.debug('Kickoff is running');
		},

		calculateRate : function () {

			KO.Config.activeyears = KO.Config.age - KO.Config.virginity;

			KO.Config.rate  = KO.Config.activeyears / KO.Config.partners;

			console.log("your rate is : ", KO.Config.rate );
			
		}

	};

	// Example module
	/*
	KO.MyExampleModule = {
		init : function () {
			KO.MyExampleModule.setupEvents();
		},

		setupEvents : function () {
			//do some more stuff in here
		}
	};
	*/

})(window.KO = window.KO || {}, jQuery);