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

			Core.Config.activeyears = Core.Config.age - Core.Config.virginity;

			Core.Config.rate  = Core.Config.activeyears / Core.Config.partners;

			console.log("your rate is : ", Core.Config.rate );
			
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