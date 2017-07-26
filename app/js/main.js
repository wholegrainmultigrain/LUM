/* all components / systems have been loaded at this point */

		var bgel = document.querySelector( '#viz-container' );
	 	var currBgColors = {
	 		angle: "0deg",
	 		from: "#000000",
	 		to: "#000000"
	 	}

	 	var basicBgColor = "#1B0F27";
	 	var basicBgColorPulse = "#3D2554";
	 	var partyColors = ['#E318F1', '#ffffff'];

	 	var currentlyTweening = false;



/* firebase stuff */
 var config = {
    apiKey: "AIzaSyCAmNrgHi-bPoZh7vf-eQlTA0-YD9QBIFk",
    authDomain: "omi-lum.firebaseapp.com",
    databaseURL: "https://omi-lum.firebaseio.com",
    projectId: "omi-lum",
    storageBucket: "omi-lum.appspot.com",
    messagingSenderId: "4778512644"
  };

firebase.initializeApp(config);
var db = firebase.database();
var session_history = db.ref('/omi-lum/production/sessions/session_1');
var all_history;
var songs = [];
var users = {};

var sceneEl = $('#viz-container');
var initialized = false;
var initializedTimeout = setTimeout(function() {
	initialized = true;
	clearTimeout(initializedTimeout);
	delete initializedTimeout;
}, 5000)

/* get connected to firebase */
$(document).ready(function() {

	function init() {

		return new Promise( (resolve,reject) => {

			var p1 = session_history.once('value', (snap) => {
				all_history = snap.val();
			})
		
			Promise.all([p1]).then(() => {
				resolve();
			});
		});
	}


	init().then(() => {
	 	console.log("initial load is done");

	 	var stage = new createjs.Stage("viz");

	  	createjs.Ticker.setFPS(33);
		createjs.Ticker.addEventListener("tick", stage);

		// var backgroundColor = new createjs.Graphics().beginFill("#1B0F27").drawRect(0, 0, 1920, 1080);
 	// 	var backgroundColorShape = new createjs.Shape(backgroundColor);
		// stage.addChild(backgroundColorShape);

	 	var currX = 0;
	 	var currY = 1080;

	 	var tween = TweenMax.fromTo(currBgColors, 60/112,
		{
			  colorProps: {
		        angle:      "0deg",
		        from:       basicBgColorPulse,
		        to:         basicBgColorPulse
		      },
		      onUpdate:           updatebgcolors
		},
			{
			  colorProps: {
		        angle:      "0deg",
		        from:       basicBgColor,
		        to:         basicBgColor
		      },
		      onUpdate:   updatebgcolors,
		     repeat: -1, /* Aka infinite amount of repeats */
			 yoyo: true /* Make it go back and forth */
			}
		);
  

	 	// start listening to energy levels
		var usersToWatch = {
			"ashleylovespizza": {
				'color': "#2CACF2",
				'energy': 0,
				'active': false,
				'line': 0,
				'mostrecentupdate': 0
			}, // ashley / turquoise
			"1297263669": {
				'color': "#A900FF",
				'energy': 0,
				'active': false,
				'line': 1,
				'mostrecentupdate': 0
			}, // tony / purple
			"jonathankoh": {
				'color': "#42F463",
				'energy': 0,
				'active': false,
				'line': 2,
				'mostrecentupdate': 0
			}, // jonathan / green
			"22tgz2mg7sxqszvkvi6nrvppi": {
				'color': "#EE1872",
				'energy': 0,
				'active': false,
				'line': 3,
				'mostrecentupdate': 0
			} // michelle / red
		}
		var line_ashley = new createjs.Graphics();
		var line_tony = new createjs.Graphics();
		var line_jon = new createjs.Graphics();
		var line_michelle = new createjs.Graphics(); 


		var circle_ashley = new createjs.Shape();
		var circle_tony = new createjs.Shape();
		var circle_jon = new createjs.Shape();
		var circle_michelle = new createjs.Shape();
		var circles =[circle_ashley, circle_tony, circle_jon, circle_michelle];
		stagecircles = new Array();


		var lines = [line_ashley, line_tony, line_jon, line_michelle];
		var stagelines = new Array();
		
		var lineKey = ["ashleylovespizza", '1297263669', 'jonathankoh', '22tgz2mg7sxqszvkvi6nrvppi'];


		for (var i=0; i<lines.length; i++){

			lines[i].setStrokeStyle(10);
			lines[i].beginStroke(usersToWatch[lineKey[i]]['color']);
			lines[i].moveTo(currX, currY-i);
			var s = new createjs.Shape(lines[i]);
			stage.addChild(s);
			stagelines.push(s);

			
			circles[i].graphics.beginFill(usersToWatch[lineKey[i]]['color']).drawCircle(0, 0, 10);
			circles[i].x = currX;
			circles[i].y = currY;

			stage.addChild(circles[i]);

		}
		// 

		// have code fire every tick - draw line point by point rather than using actual beziers
		createjs.Ticker.addEventListener("tick", tick);


		// not attempting bezier
		var ticks = 0;
		function tick() { 
			ticks++;

			var sum = 0;
			var highestperson = { currY: 0, person: null}

		//	currX = (currX > 1920*.6) ? currX : currX+1;
			currX+=10;
			for (var i=0; i<lines.length; i++){
				//if (i == 0) { console.log( usersToWatch[lineKey[i]]['energy']  )}


				if (Date.now() - usersToWatch[lineKey[i]]['mostrecentupdate'] > 100) {
					// hasn't updated in a while, lift up your STROKE
					lines[i].endStroke();
					currY = 1080;
				} else if (circles[i].y == 1080 && ( (1080-((Number(usersToWatch[lineKey[i]]['energy'])*1080))) > 2 )) { 
					// begin stroke 
					lines[i].beginStroke(usersToWatch[lineKey[i]]['color']);
					currY  = 1080 - (Number(usersToWatch[lineKey[i]]['energy']) * 1080)
				} else {
					// update Y with current energy
					currY  = 1080 - (Number(usersToWatch[lineKey[i]]['energy']) * 1080)
				}
				//	lines[i].lineTo(currX, usersToWatch[lineKey[i]]['energy']);
				lines[i].lineTo(currX, currY);
				// move back so it doesn't go off screen
				if (currX > (1920*.6)+(26*i) ) {
					stagelines[i].x = stagelines[i].x-10;
				}

				circles[i].x = stagelines[i].x + currX;
				circles[i].y = currY;

				// assign highest energy person
				if (highestperson.currY < currY && currY < 1070) {
					highestperson.currY = currY;
					highestperson.person = lineKey[i];
				}

				sum += (1080-currY) / 1080;
			}
		

			// if all 4 summed together are > 2.2, take precedence over any other tweens
			if (sum > .6*(lines.length)) {
				//https://codepen.io/rossobarnes/pen/mEWBQe
				TweenLite.to(
					currBgColors,
					.3,
					{
				      colorProps: {
				        angle:      "360deg",
				        from:       partyColors[0],
				        to:         partyColors[1]
				      },
				      onUpdate:           updatebgcolors,
				      onUpdateParams:     [bgel],
				      onComplete:         backToNormalColors,
				      ease:               Sine.easeInOut
				    }
				)
			} else {
				if (highestperson.person != null) {
						TweenLite.to(
						currBgColors,
						.4,
						{
					      colorProps: {
					        angle:      (Math.random()*360) + "deg",
					        from:       usersToWatch[highestperson.person]['color'],
					        to:        usersToWatch[highestperson.person]['color']
					      },
					      onUpdate:           updatebgcolors,
					      onUpdateParams:     [bgel],
					      onComplete:         backToNormalColors,
					      ease:               Sine.easeInOut
					    }
					)
				}
				

			}
			// if one guy is over 50% and noone else is, make them the leader



		  	stage.update();
		}


		// UPDATE FROM DB
		session_history.on('child_changed', (data) => {
		 // console.log("child changed: ",data.key, data.val())
		  var new_user_data = [];

		  if (data.key in usersToWatch) {
		  	// energy levels are changing for our user
			// if (!usersToWatch[data.key]['active']) {
			// 	// joining in!
			// 	// todo -  some animation

			// 	usersToWatch[data.key]['active'] = true;

			// }
			usersToWatch[data.key]['energy'] = (data.val())['energy'];
			usersToWatch[data.key]['mostrecentupdate'] = Date.now(); 
			
		  }
		});



	})

});

function backToNormalColors() {
	TweenLite.to(
		currBgColors,
		.2,
		{
	      colorProps: {
	        angle:      "0deg",
	        from:       basicBgColor,
	        to:         basicBgColor
	      },
	      onUpdate:           updatebgcolors,
	      onUpdateParams:     [bgel],
	      ease:               Sine.easeInOut
	    }
	)
}

function updatebgcolors() {
	TweenLite.set(
	    bgel, { backgroundImage: 'linear-gradient( ' + currBgColors.angle + ', ' + currBgColors.from + ', ' + currBgColors.to + ')' }
	);
}

function songsAlreadyContains(song) {
	for (var i in songs) {
		if (songs[i] == song) {
			return true;
		}
	}
	return false;
}
function isEmptyString(str) {
	if (str == null || str == "" || !str.replace(/\s/g, '').length) { return true; }
	return false;
}
function toDegrees(angle) {
  return angle * (180 / Math.PI)
}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
