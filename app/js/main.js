/* all components / systems have been loaded at this point */

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
var session_history = db.ref('/omi-lum/production/history/session_1');
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
	 	console.log("initial load is done")

	 	var stage = new createjs.Stage("viz");

		var circle = new createjs.Shape();

		circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
		circle.x = 100;
		circle.y = 100;
		stage.addChild(circle);




		var allpoints = [
			{x: 0, y: 500},
			{x: 20, y: 400},
			{x: 40, y: 420},
			{x: 60, y: 421},
			{x: 80, y: 360},
			{x: 100, y: 100},
			{x: 120, y: 220}
		]
		var currPoint_i = 0;


		var vpoint = new createjs.Point( allpoints[currPoint_i].x, allpoints[currPoint_i].y);

		var line = new createjs.Graphics();
		line.beginStroke("#0939F2")
		line.moveTo( vpoint.x, vpoint.y );

		var s = new createjs.Shape(line);
		stage.addChild(s);

		function tweenLineOneSegment() {
			if (currPoint_i < allpoints.length) {
				currPoint_i++;
				createjs.Tween.get(vpoint).to(allpoints[currPoint_i], 1000,createjs.Ease.linear).call(handleComplete);
			}
		}
		function handleComplete() {
			console.log("what");
			tweenLineOneSegment();
		}

		// kick off tweens
		tweenLineOneSegment();

		// have code fire every tick - draw line point by point rather than using actual beziers
		createjs.Ticker.addEventListener("tick", tick);
		function tick() { 
			line.lineTo( vpoint.x, vpoint.y );
		  	stage.update();
		}



		createjs.Tween.get(circle, { loop: true })
		  .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
		  .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
		  .to({ alpha: 0, y: 225 }, 100)
		  .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
		  .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

	  	createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", stage);



	/////////
		/* ok - tween.js may not do the trick
		*  will need to use GSAP Bezier plugin - https://greensock.com/docs/Plugins/BezierPlugin
		*  with easeljs as drawing engine - https://greensock.com/forums/topic/10382-gsap-with-easeljs/
		*   example - https://codepen.io/GreenSock/pen/ABkdL
		*  tutorial - https://webdesign.tutsplus.com/tutorials/timelinemax-getting-a-handle-on-bezier-tweening--cms-23981
		*  general spline code for canvas, no animation - https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
		*/




		 // new user added
		session_history.on('child_added', (data) => {
		  console.log("child added: ",data.key)
		  if (data.key == "meta") {
		  	// new meta item
		  	//sceneEl.emit('new_meta', {moment: data.val(), id: data.key}, false);
		  }
		  if (data.key == "users") {
		  	users = data.val();
		  	// new user item
		  //	sceneEl.emit('new_users', {user: data.val()}, false);
		  }

		});
		session_history.on('child_changed', (data) => {
		  console.log("child changed: ",data.val())
		  var new_user_data = [];

		  if (data.key == "users") {
		  	// new user item

		  	// is there a new user?
		  	var new_user = null;
		  	for (var i in data.val()) {
		  		if (users[i] == null) {
		  			new_user = {key: i, data: data.val()[i]}
		  		} else {

		  			for(var j in data.val()[i]) {
		  			
		  				if (users[i][j] == null) {
		  					// HIT
		  					//  new_user_data.push({key: j, data: data.val()[i][j]})
		  				}
		  			}
		  		}
		  	}
		  	users = data.val();
		  	if (new_user != null) {
		  		// add
		  	//	sceneEl.emit('new_user', {user: new_user.data, id: new_user.key});
		  	} 
		  	if (new_user_data.length > 0) {
		  		// change was emitted because there's a new moment child
		  		//for (var i=0; i<new_user_data.length; i++) {
		  		//	var new_user_moment = new_user_data[i];
		  		//	sceneEl.emit('new_user_moment', {key: new_user_moment.key, data: new_user_moment.data});
		  		//
		  		//}
		  	}
		  	// do something to find what the new item is
		//  	
		  }
		});


	})

});


    sceneEl.bind('new_meta', function(event) {
     // console.log('new user! ', event.detail.id);
     // console.log(event);
      event.detail.moment
      for (i in event.detail.moment) {
      	var song = event.detail.moment[i]['trackname'];
      	if (!songsAlreadyContains(song)){
      	
      		songs.push(song);
      		$("<li>"+song+"</li>").prependTo("#meta-list")
      	}
      }
    });


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
