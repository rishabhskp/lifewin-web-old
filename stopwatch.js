//SINGLE BUTTON IMPLEMENTATION: http://stackoverflow.com/q/21202928/3065082

//	Simple example of using private variables
//
//	To start the stopwatch:
//		obj.start();
//
//	To get the duration in milliseconds without pausing / resuming:
//		var	x = obj.time();
// 
//	To pause the stopwatch:
//		var	x = obj.stop();	// Result is duration in milliseconds
//
//	To resume a paused stopwatch
//		var	x = obj.start();	// Result is duration in milliseconds
//
//	To reset a paused stopwatch
//		obj.stop();
//
var	clsStopwatch = function() {
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
				return (new Date()).getTime(); 
			}; 
 
		this.setLapTime = function() {
			var data = JSON.parse(localStorage.getItem("meta"))["timer"];
			if(data!=null)
			lapTime = parseInt(data);
			}
		// Public methods
		// Start or resume
		this.start = function() {
			//console.log("Before start startAt: "+startAt);
			startAt	= startAt ? startAt : now();
			//console.log("After start startAt: "+startAt);
			};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				//console.log("Before stop lapTime: "+lapTime);
				//console.log("Before stop startAt: "+startAt);
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				//console.log("After stop lapTime: "+lapTime);
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0); 
			};
			
		this.pomotime = function() {
				return 25*60*1000 - lapTime - (startAt ? now() - startAt : 0);
		};
	};

var x = new clsStopwatch();
var y = new clsStopwatch();
var type, clocktimer;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / 3600000 );
	time = time % 3600000;
	m = Math.floor( time / 60000 );
	time = time % (60000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2); // + ':' + pad(ms, 3);  (milliseconds removed)
	return newTime;
}

function update(type) {
	var data = JSON.parse(localStorage.getItem("meta"))["timer"];
	if (data == null) data=0;
	document.getElementById("time").innerHTML = formatTime(type? x.pomotime() : x.time()) + "  -  " +formatTime(y.time());
}

function updatePoints(){
	var meta = localStorage.getItem("meta");
	var metaObj = JSON.parse(meta);
	metaObj["daily"] = parseInt(metaObj["daily"]) + 1;
	metaObj["weekly"] = parseInt(metaObj["weekly"]) + 1;
	if(metaObj["daily"]<10) metaObj["daily"]='0'+metaObj["daily"];
	if(metaObj["weekly"]<10) metaObj["weekly"]='0'+metaObj["weekly"];
	document.getElementById("daily").innerHTML = metaObj["daily"];
	document.getElementById("weekly").innerHTML = metaObj["weekly"];
	localStorage.setItem("meta",JSON.stringify(metaObj));
}

//start timer. para = 0 for normal and 1 for pomodoro
function start(para) {
	type = para;
	if(x.time())	//if a timer is already running
	stop();			//stop it (and save it's data too)
	clocktimer = setInterval("update("+type+")", 1000);   //use 1 instead of 1000 for millisecons
	addpoints = setInterval("updatePoints()",1000*60*6);
	//stop pomodoro timer at 0
	if(type==1) stoptimer = setInterval ("stop()",25*60*1000);
	x.start();
	if(y.time()==0){
	y.setLapTime();
	}
	y.start();
}

function stop() {
	var metaObj = JSON.parse(localStorage.getItem("meta"));
	metaObj["lastTimer"] = x.time();
	x.reset();
	var data = metaObj["timer"];
	if(data==null)data=0;
	metaObj["timer"] = y.time();
	localStorage.setItem("meta",JSON.stringify(metaObj));
	y.stop();
	clearInterval(clocktimer);
}

function reset() {
	stop();
	x.reset();
	update();
}