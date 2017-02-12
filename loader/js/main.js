// var black = '#122430',
// offBlack = '#273E45',
// white = '#FFFCE2',
// offWhite = '#EBD2B5',
// red = '#E63531';

var black = '#FFFCE2',
offBlack = '#EBD2B5',
white = '#122430',
offWhite = '#273E45',
red = '#E63531';

var beforeClone = 0, masterClone, face;



// Loader
// todo. Add translate 2d instead of topleft for browsers that can handle it (if IE 10 or below use top/left)

function refresca() {
	loadgrid();
}



function hexDraw() {
    requestAnimationFrame(hexDraw);


	    function hoverRaph(typeOf){
				console.log('hovering')
			var animSet = face;
			console.log('hoverSet');

			if (typeOf === true) {
				return function() {
					animSet.animate({fill: red, opacity: 0.5}, 100);
					animSet[0].animate({fill: red, opacity: 0.5}, 100);
					animSet[1].animate({fill: red, opacity: 0.5}, 100);
					animSet[2].animate({fill: red, opacity: 0.5}, 100);
					animSet[3].animate({fill: red, opacity: 0.5}, 100);
					animSet[4].animate({fill: red, opacity: 0.5}, 100);
					animSet[5].animate({fill: red, opacity: 0.5}, 100);
				};
			}
			else if (typeOf === false) {
				return function() {
					animSet.animate({fill: offWhite, opacity: 0.3}, 100);
					animSet[0].animate({fill: offWhite, opacity: 0.5}, 100);
					animSet[1].animate({fill: offWhite, opacity: 0.5}, 100);
					animSet[2].animate({fill: offWhite, opacity: 0.5}, 100);
					animSet[3].animate({fill: offWhite, opacity: 0.5}, 100);
					animSet[4].animate({fill: offWhite, opacity: 0.5}, 100);
					animSet[5].animate({fill: offWhite, opacity: 0.5}, 100);
				};
			}
		} // hoverRaph





	    if (beforeClone === 1) {
	    	console.log('ALERT: rest:');
	    	var hexVictim = $('.gridlet').not('.used');
	    	hexVictim.html(masterClone);
	    	hexVictim.addClass('used');
	    	// cancelAnimationFrame(hexDraw); // <=-- not working
	    } else {
	    	console.log('ALERT: init:');
	    	var hexVictim = $('.gridlet').not('.used').eq(0);
	    	hexVictim.addClass('used');
	    	paper = Raphael(hexVictim.get(0), 60, 52),
				face = paper.set();
				face.push(
					paper.path('M 14.334,3.842 22.969,9.069 10.21,30.693 1.575,25.467 z').attr({opacity: 0}),
					paper.path('M 39.062,3.842 47.697,9.069 22.969,9.069 14.334,3.842 z').attr({opacity: 0}),
					paper.path('M 39.062,3.842 47.697,9.069 59.666,30.693 51.031,25.467 z').attr({opacity: 0}),
					paper.path('M 51.031,25.467 59.666,30.693 46.908,52.318 38.273,47.092 z').attr({opacity: 0}),
					paper.path('M 38.273,47.092 46.908,52.318 22.18,52.318 13.544,47.092 z').attr({opacity: 0}),
					paper.path('M 1.575,25.467 10.21,30.693 22.18,52.318 13.544,47.092 z').attr({opacity: 0}),
					paper.path('M39.209,3.6L14.196,3.6,1.292,25.467,13.398,47.343,38.411,47.343,51.315,25.466z', 0, 0).toFront()
				);
				face.attr({fill: offWhite, 'stroke':white});
				face.hover(hoverRaph(true), hoverRaph(false));
				beforeClone = 1;
				masterClone = hexVictim.html();
	    }





	    // raphael dependancy
		// var paper = Raphael(hexVictim.get(0), 60, 52),
		// face = paper.set();
		// face.push(
		// 	paper.path('M 14.334,3.842 22.969,9.069 10.21,30.693 1.575,25.467 z').attr({opacity: 0}),
		// 	paper.path('M 39.062,3.842 47.697,9.069 22.969,9.069 14.334,3.842 z').attr({opacity: 0}),
		// 	paper.path('M 39.062,3.842 47.697,9.069 59.666,30.693 51.031,25.467 z').attr({opacity: 0}),
		// 	paper.path('M 51.031,25.467 59.666,30.693 46.908,52.318 38.273,47.092 z').attr({opacity: 0}),
		// 	paper.path('M 38.273,47.092 46.908,52.318 22.18,52.318 13.544,47.092 z').attr({opacity: 0}),
		// 	paper.path('M 1.575,25.467 10.21,30.693 22.18,52.318 13.544,47.092 z').attr({opacity: 0}),
		// 	paper.path('M39.209,3.6L14.196,3.6,1.292,25.467,13.398,47.343,38.411,47.343,51.315,25.466z', 0, 0).toFront()
		// );
		// face.attr({fill: offWhite, 'stroke':white});
		// face.hover(hoverRaph(true), hoverRaph(false));


} // hexDraw




function loadgrid() {
	var wProp = $('.loader');
	wProp.randy = Math.floor((Math.random()*100000)+1);
	$('.gridlet').not($('.col .' + wProp.randy)).fadeOut('fast');

	// console.log(wProp.randy);

	wProp.height = wProp.height();
	wProp.width = wProp.width();

	wProp.gridlet = $('<div class="gridlet col row"></div>');
	wProp.gridlet.dimensionX = 50;
	wProp.gridlet.dimensionY = 44;

	if ($('.gridlet').length < 1) { // initial run
		$('.loader').html(wProp.gridlet);
		shiftgrid();
	}
	else { // run on resize
		$('.loader').animate({'opacity':1}, function() {
			shiftgrid();
		});
	}

	function shiftgrid() {
		wProp.gridlet.rows = $('.loader .gridlet .row');
		wProp.gridlet.cols = $('.loader .gridlet .col');

		wProp.gridlet.width = wProp.gridlet.dimensionX;
		wProp.gridlet.height = wProp.gridlet.dimensionY;

		wProp.projectX = Math.ceil(wProp.width / wProp.gridlet.dimensionX) + 10;
		wProp.projectY = Math.ceil(wProp.height / wProp.gridlet.dimensionY) + 10;


		/* Some Tests
		console.log('existing cols: ' + wProp.gridlet.rows);
		console.log('existing rows: ' + wProp.gridlet.cols);
		console.log('');
		console.log('starting col: ' + wProp.trackX);
		console.log('starting row: ' + wProp.trackY);
		console.log('');
		console.log('total cols: ' + wProp.projectX);
		console.log('total rows: ' + wProp.projectY);
		*/


		for (var row = 0; row < wProp.projectY; row++) {
			for (var col = 0; col <= wProp.projectX; col++) {

				var gClone = wProp.gridlet.clone();
				gClone
				.css({
					'left': wProp.gridlet.width * (col * 0.75) + 'px',
					'top': (row + (col % 2 ? 0.5 : 0)) * wProp.gridlet.height + 'px'
				})
				.appendTo('.loader')
				.addClass('col ' + wProp.randy);

			}
		}
		$('.loader').animate({'opacity':1}, function() { $('.gridlet').not($('.col .' + wProp.randy).remove()); });
	} // shiftgrid

}




$(document).ready(function() {

	loadgrid();

	var resizeTimer;
	$(window).resize(function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(refresca, 400);
	});

});



$(window).load(function() {
	hexDraw();
	console.log('done.');

});


//TODO / Ideas

// - hex opener while loading (depends on efficiency)
// - Loading wormhole
// - '3, 2, 1 (counter)' -> speed-reading text 'I am ...'
// 	- 'text goes elsewhere right after, or during each word, or after entire speed read is complete'


// pages:
// 	- Home
// 		Very short intro, lots of whitespace
// 	- About
// 		Map overlay
// 			cronjob: pick up last location, serverside hyperlapse to gif...? or html5 video?
// 				algo: last known location with bias towards high-movement (for hyperlapse)
// 		twitter feed (w/ locations)
// 		instagram feed (w/ locations)?


// 	- Work
// 		self-explanatory
// 		card/grid-based, use accordion or growing-cards (see material design guidelines for ideas)
// 		basis: list of latest works, click to open, see gallery, short text description (meta tags?), click to go to site

// 	- Contact
// 		form?
