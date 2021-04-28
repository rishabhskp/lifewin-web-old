function sync(){
console.log("sync() function called");
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    console.log(xmlhttp.responseText);
    }
  }
xmlhttp.open("POST","sync.php",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
var meta = localStorage.getItem("meta");
var data = "meta="+meta;
xmlhttp.send(data);
}
window.onload=function refresh(){
console.log("window.onload = function refresh() function called");
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);

//App used for first time?
if (localStorage.getItem("meta") === null){
//Initialize Data
var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	if (month<10) month = '0'+month;
	if (day<10) day = '0'+day;
	date =''+day+'-'+month+'-'+year;
var meta = '{"date":"'+date+'","Present":0,"Future":0,"Today":0,"Tomorrow":0,"This Week":0,"Later":0,"Habits":0,"Frequent":0,"timer":0,"lastTimer":0,"daily":"00","weekly":"00","initialPos":0,"list":"Tasks","Goals":["Present","Future"],"Tasks":["Today","Tomorrow","This Week","Later"],"Dailies":["Habits","Frequent"],"Winstate":[" "]}';
var goalsDetails = '{}';
var goalsNames = '[]';
var tasksDetails = '{}';
var tasksNames = '[]';
var dailyDetails = '{}';
var dailyNames = '[]';
var winstateDetails = '{"Yes! I Did It!":{"count":0}}';
var winstateNames = '["Yes! I Did It!"]';
var scoreboard = '{}';

//set initial data
localStorage.setItem("meta",meta);
localStorage.setItem("GoalsDetails",goalsDetails);
localStorage.setItem("GoalsNames",goalsNames);
localStorage.setItem("TasksDetails",tasksDetails);
localStorage.setItem("TasksNames",tasksNames);
localStorage.setItem("DailiesDetails",dailyDetails);
localStorage.setItem("DailiesNames",dailyNames);
localStorage.setItem("WinstateDetails",winstateDetails);
localStorage.setItem("WinstateNames",winstateNames);
localStorage.setItem("scoreboard",scoreboard);
}

//get meta data
var meta = localStorage.getItem("meta");
var metaObj = JSON.parse(meta);

//Show the timers
document.getElementById("time").innerHTML = formatTime(metaObj["lastTimer"]) + "  -  " +formatTime(metaObj["timer"]);

//what's todays date?
var currentDate = new Date();
	//is today start of a new week?
	if(currentDate.getDay()==0)
	//if yes, reset weekly points
	metaObj["weekly"]='00';

	//is this the same date as last time or a new date?
	var currentDay = currentDate.getDate();
	var currentMonth = currentDate.getMonth()+1;
	var currentYear = currentDate.getFullYear();
	if (currentMonth<10) currentMonth = '0'+currentMonth;
	if (currentDay<10) currentDay = '0'+currentDay;
	currentDate =''+currentDay+'-'+currentMonth+'-'+currentYear;
	var date = metaObj["date"];
//the dates are differnet
if(currentDate!=date){

	//set currentDate as the new date
	localStorage.setItem('date',currentDate);
	
	//get date's points
	var dailyPoints = metaObj["daily"];
	
	//load the scoreboard
	var scoreboard = localStorage.getItem("scoreboard");
	//if the currentDate already exists in the scoreboard, continue from the points the day already has
	if(scoreboard.indexOf(currentDate)!=-1){
		//Object manipulation to continue that day
		var scoreboardObj = JSON.parse(scoreboard);
		//today's points are that day's points
		metaObj["daily"]=scoreboardObj[currentDate];
		}
	//today's points starts from 0
	else
		metaObj["daily"]='00';
	
	//if date already exists in the scoreboard, modify the points it already has
	if(scoreboard.indexOf(date)!=-1){
		var scoreboardObj = JSON.parse(scoreboard);
		console.log("scoreboard = " +scoreboard);
		console.log("date = "+date);
		console.log("scoreboardObj = "+scoreboardObj);
		scoreboardObj[date]=dailyPoints;
		scoreboard = JSON.stringify(scoreboardObj);
		}
	//else add date to scoreboard with string manipulation
	else{
	scoreboard = scoreboard.slice(0,-1);
	if(scoreboard!='{')
		scoreboard += ',';
	scoreboard += '"'+date+'":"'+dailyPoints+'"}';
		}
	//save the data
	localStorage.setItem("meta",JSON.stringify(metaObj));
	localStorage.setItem("scoreboard",scoreboard);
	}
	
//"Tasks" is loaded by default
list("Tasks");

//timer to reload page on Midnight
var today = new Date();
var tommorow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
var timeToMidnight = tommorow-today;
var timer = setTimeout(function(){refresh();},timeToMidnight);

//corrective code to be removed later
var scoreboard = localStorage.getItem("scoreboard");
scoreboard = scoreboard.split('[').join('');
scoreboard = scoreboard.split(']').join('');
scoreboard = scoreboard.split('{').join('');
scoreboard = scoreboard.split('}').join('');
scoreboard = '{'+scoreboard+'}';
localStorage.setItem("scoreboard",scoreboard);
}

function list(listname){
console.log("list function called");
//save listname to localStorage so loadData can access it
var metaObj = JSON.parse(localStorage.getItem("meta"));
metaObj["list"]=listname;
localStorage.setItem("meta",JSON.stringify(metaObj));

//No tags for Tasks
//if(listname=="Tasks")
//$('.tags').hide();
//No form and tags for winstate and scoreboard
if((listname=="Winstate")||(listname=="Scoreboard")){
$('#input').hide();
$('.tags').hide();
}
else{
$('#input').show();
$('.tags').show();
}
if(listname=="Scoreboard")
scoreBoard();
else
loadData();
}

function scoreBoard(){	
console.log("scoreBoard function called");
	//clear list contents (so that double copies of list doesn't forms on reload)
var list = document.getElementById("list");
while (list.firstChild) {
    list.removeChild(list.firstChild);
}
	
	var scoreboard = localStorage.getItem("scoreboard");
	var scoreboardObj = JSON.parse(scoreboard);
	var keys = [], name;
	for(name in scoreboardObj){
		if(scoreboardObj.hasOwnProperty(name))
		keys.push(name);
	}
	//for each day
	for(var i=keys.length-1; i>=0; i--){
	//HTML DOM Manipulation
	//whole container - li, checkbox, calendar
	var container = document.createElement("li");
	container.setAttribute('class','list-group-item');
	var textNode = document.createTextNode(keys[i]);
	var points = document.createElement("span");
	points.setAttribute('class','badge');
	points.innerHTML = scoreboardObj[keys[i]];
	container.appendChild(textNode);
	container.appendChild(points);
	
	document.getElementById("list").appendChild(container);
	}

}
function setDueDate(date,entry){
console.log("setDueDate function called");
//which list?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//load required data
var listNames = localStorage.getItem(listname+"Names");
var listNamesObj = JSON.parse(listNames);
var listDetails = localStorage.getItem(listname+"Details");
var listDetailsObj = JSON.parse(listDetails);

//Calculate no. of days remaining
var currentDate = new Date();      //Current Date and Time
var diff =  Math.ceil(( Date.parse(date) - Date.parse(currentDate) ) / 86400000);   

//store date
listDetailsObj[listNamesObj[entry]].duedate=date;

/*
//date received in yy-mm-dd format. Convert to dd-mon-yy
var year=parseInt(date.slice(0,-6));
var month=parseInt(date.slice(5,-3))-1;
var day=date.slice(8);
var array = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
date = ''+day+'-'+array[month]+'-'+year;
*/

//date received in yy-mm-dd format. Convert to dd/mm
var day = date.slice(8);
var month = parseInt(date.slice(5,-3));
date = ''+day+'/'+month;

//Change the text on the screen
document.getElementById('gd'+entry).innerHTML=date;
document.getElementById('gn'+entry).innerHTML=diff;

//save the changes
localStorage.setItem(listname+"Details",JSON.stringify(listDetailsObj));
}

function clearlist(){
console.log("clearlist function called");
$('#input').hide();
$('.tags').hide();
var list = document.getElementById("list");
while (list.firstChild) {
    list.removeChild(list.firstChild);
}
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
     var categories = JSON.parse(xmlhttp.responseText);
    for(var category=0; category<2; category++){
    var item = document.createElement("li");
	item.setAttribute("class","list list-item");
    item.innerHTML = categories[category].Name;
    document.getElementById("list").appendChild(item);
	}
  }
xmlhttp.open("POST","list.php",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send();
}
}

function loadData(){
console.log("loadData() function called");
/*Collapse/Show List Icons removed - they were confusing the users - users think that clicking on them will reveal what they are to do for the day
//set Icon for the first Tag
document.getElementById('tagIcon0').setAttribute('class','glyphicon glyphicon-collapse-down');
*/

//clear list contents (so that double copies of list doesn't forms on reload)
var list = document.getElementById("list");
while (list.firstChild) {
    list.removeChild(list.firstChild);
}

//get all Details
var meta = localStorage.getItem("meta");
var metaObj = JSON.parse(meta);
//which list is this?
var listname = metaObj["list"];
var listNames = localStorage.getItem(listname+"Names");
var listDetails = localStorage.getItem(listname+"Details");
var listNamesObj = JSON.parse(listNames);
var listDetailsObj = JSON.parse(listDetails);

//show daily and weekly points on screen
document.getElementById("daily").innerHTML = metaObj.daily;
document.getElementById("weekly").innerHTML = metaObj.weekly;

//Display List's name at the top
document.getElementById("listname").innerHTML=metaObj["list"];

//Set Text of the input box ("New "+listname);
document.getElementById("newEntry").setAttribute('placeholder','Add '+metaObj["list"]+'...');

//set text for the firstTag and it's count
console.log("meta ="+meta);
console.log("listname = "+listname);
document.getElementById("firstTag").innerHTML = metaObj[listname][0];
document.getElementById("tagCount0").innerHTML = metaObj[metaObj[listname][0]];

//what's the index value of next tag to be added?
var nextTag = 1;
//firstTag done. How many remaining?
var tagsRemaining = metaObj[listname].length - 1;

//for each goal
for(var entry=0; entry<listNamesObj.length; entry++){
	//add secondTag tag if this is the first goal belonging to future
	while((tagsRemaining!=0)&&(listDetailsObj[listNamesObj[entry]].tag != metaObj[listname][nextTag - 1])){
	createTags(nextTag);
	nextTag++;
	tagsRemaining--;
	}

	
if(listname!= "Tasks"){
	
	//generate key for current month (goalsDates stored in JSON with keys corresponding to mmyyyy)
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	if (month<10) month = '0'+month;
	if (day<10) day = '0'+day;
	key = ''+month+year;
}
	
	//HTML DOM Manipulation
	//whole container - li, checkbox, calendar
	var container = document.createElement("div");
	//"inTag"+(nextTag-1) to indentify as to under which tag it is and show/hide when the tag is clicked
	container.setAttribute('class','inTag'+(nextTag-1));
	var inputGroup = document.createElement("div");
	inputGroup.setAttribute("class","input-group");
	var span = document.createElement("span");
	span.setAttribute("class","input-group-addon");
	var checkbox = document.createElement("input");
	checkbox.setAttribute("type","checkbox");
	checkbox.setAttribute("class", "checkbox");
	checkbox.setAttribute("id","check"+entry);
if(listname!="Tasks"){
	//if today present in goalsDates (i.e, progress made towards it today)
	if($.inArray(day, listDetailsObj[listNamesObj[entry]].key)>=0)
	//then check the checkbox
	checkbox.setAttribute("checked","true");
}
	//have label after checkbox - so that the checkbox can be styled
	var label = document.createElement("label");
	label.setAttribute("for","check"+entry);
	//label.setAttribute("style","display:none");
	span.appendChild(checkbox);
	span.appendChild(label);
	inputGroup.appendChild(span);
	//anchor tag instead of "li" to "linkify"
	var node = document.createElement("a");
	node.setAttribute("href","#");
	//"list-group-item" is a requirement of bootstrap
	node.setAttribute("class","list list-group-item");
	node.setAttribute('id','g'+entry);
	var text = document.createElement('span');
	text.setAttribute('id','entryText'+entry);
	text.innerHTML = listNamesObj[entry];
	node.appendChild(text);
	
	//toolbar to contain all options/buttons -- align towards right
	var toolbar = document.createElement("span");
	toolbar.setAttribute('class','toolbar');
	streakCount = document.createElement("span");
	streakCount.setAttribute('id','co'+entry);
	streakCount.setAttribute('class','');
if(listname!="Tasks"){
	//Display the Streak Count from localStorage
	streakCount.innerHTML=listDetailsObj[listNamesObj[entry]]["count"];
	
	//streakIcon - glyphicon halfling icon of links
	streakIcon = document.createElement("span");
	streakIcon.setAttribute('class','glyphicon glyphicon-link');
	toolbar.appendChild(streakCount);
	toolbar.appendChild(streakIcon);
}
if((listname!="Winstate")&&(listname!="Dailies")){
	//duedate - duedate, calendar icon, no.of days remaining & icon for that too
	var duedate = document.createElement("span");
	duedate.setAttribute('class','duedate');
	duedate.setAttribute('id','du'+entry);
	//due - the date on which the entry is due
	var due = document.createElement("span");
	due.setAttribute('id','gd'+entry);
	//dueIcon - glyphicon halfling icon of calendar
	var dueIcon = document.createElement("span");
	dueIcon.setAttribute('class','glyphicon glyphicon-calendar');
	//daysNumber - no.of days remaining
	var daysNumber = document.createElement("span");
	daysNumber.setAttribute('id','gn'+entry);
	//daysIcon - glyphicon halfling icon of time
	var daysIcon = document.createElement("span");
	daysIcon.setAttribute('class','glyphicon glyphicon-time');
	duedate.appendChild(due);
	duedate.appendChild(dueIcon);
	duedate.appendChild(daysNumber);
	duedate.appendChild(daysIcon);
	toolbar.appendChild(duedate);
}
if(listname!='Winstate'){
	//editIcon - glyphicon halfling icon of pencil to edit the entry's name
	var editIcon = document.createElement("span");
	editIcon.setAttribute('id','ed'+entry);
	editIcon.setAttribute('class','edit glyphicon glyphicon-pencil');
	toolbar.appendChild(editIcon);
	//deleteIcon - glyphicon halfling icon of trash to delete the entry
	var deleteIcon = document.createElement("span");
	deleteIcon.setAttribute('id','d'+entry);
	deleteIcon.setAttribute('class','del glyphicon glyphicon-trash');
	toolbar.appendChild(deleteIcon);
}
if((listname=="Tasks")||(listname=="Dailies")){
	//Points - how many points is this worth and pointsIcon (star)
	var points = document.createElement("span");
	points.setAttribute('class','point badge');
	points.setAttribute('id','p'+entry);
	points.innerHTML = listDetailsObj[listNamesObj[entry]].points;
	toolbar.appendChild(points);
}
	node.appendChild(toolbar);
	inputGroup.appendChild(node);
	container.appendChild(inputGroup);

	//Duedate Picker Calendar
	var dueCal = document.createElement("div");
	dueCal.setAttribute('id','gs'+entry);
	dueCal.setAttribute('class','duedatepicker');
	container.appendChild(dueCal);
if(listname!="Tasks"){
	//Streak Calendar
	var cal = document.createElement("div");
	cal.setAttribute('id','gc'+entry);
	cal.setAttribute("class","datepicker");
	//cal (calendar) part of the container
	container.appendChild(cal);
}
	//container is a part of the list
	document.getElementById("list").appendChild(container);
if(listname!="Winstate"){
	//if duedate is set, show it and no. of days remaining on the screen:
	if(listDetailsObj[listNamesObj[entry]].duedate!=''){
	setDueDate(listDetailsObj[listNamesObj[entry]].duedate,entry);
	}
}
if(listname!="Dailies"){
	//generate the duedate picker calendar
	$('.duedatepicker').click();
}
if(listname!="Tasks"){
	//generate the streaks calendar
	$('.datepicker').click();
}
	//$('#gc'+entry).children().width($('#gc'+entry).innerWidth());	//Adjust the width of the Calendar to be about the same as the list item.
	}
	
	//Hide all calendars by default.
if(listname!="Dailies"){
	$('.duedatepicker').hide();
}
if((listname!="Tasks")&&(listname!="Winstate")){
	$('.datepicker').hide();
}

	//if there were no "future" goals at all
	while (tagsRemaining != 0){
	createTags(nextTag);
	nextTag++;
	tagsRemaining--;
	}
}

//function to add the "future" tag to the list
function createTags(nextTag){
console.log("createTags() function called");
	//which list?
	var listname = JSON.parse(localStorage.getItem("meta"))["list"];
	
	//get meta data
	var meta = localStorage.getItem("meta");
	var metaObj = JSON.parse(meta);
	
	//get data to display count
	var listDetails = localStorage.getItem(listname+"Details");
	var listDetailsObj = JSON.parse(listDetails);

	//HTML DOM Manipulation
	//Create a new li element
	var node = document.createElement("li");
	
	/*Collapse/Show List Icons removed - they were confusing the users - users think that clicking on them will reveal what they are to do for the day
	//CollapseIcon to contain collapse icon
	var collapseIcon = document.createElement("span");
	collapseIcon.setAttribute('class','glyphicon glyphicon-collapse-down');
	//this id is to be able to access and modify the icon later on
	collapseIcon.setAttribute('id','tagIcon'+nextTag);
	node.appendChild(collapseIcon);
	*/
	var count = document.createElement("span");
	count.setAttribute("class","badge");
	node.setAttribute("class", "tags list list-group-item");
	//id to show/hide all items under a tag
	node.setAttribute("id","tag"+nextTag);
	//Textnode (to contain Tag)
	var textnode = document.createTextNode(metaObj[listname][nextTag]);
	//"future" count. span to contain bootstrap's badge
	count.setAttribute("id","tagCount"+nextTag);
	//set the count value
	count.innerHTML = metaObj[metaObj[listname][nextTag]];
	//textnode and count are part of li (in that order!)
	node.appendChild(textnode);
	node.appendChild(count);
	//li is a part of the list
	document.getElementById("list").appendChild(node);
}

function addPoints(points){
console.log("addPoints function called");
//coming from quickAdd?
if(points=='quickAdd'){

//get quickAdd's form data
points =  document.getElementById("points").value;

//clear the input field
var form = document.getElementById("quickAdd");
form.reset();
}
//load relevent data
var metaObj = JSON.parse(localStorage.getItem("meta"));

metaObj.daily = parseInt(metaObj.daily) + parseInt(points);
metaObj.weekly = parseInt(metaObj.weekly) + parseInt(points);
//points are of atleast 2 digits all the time
if(metaObj.daily<10) metaObj.daily='0'+metaObj.daily;
if(metaObj.weekly<10) metaObj.weekly='0'+metaObj.weekly;

//save changes
localStorage.setItem('meta',JSON.stringify(metaObj));
	
//reflect change in UI
document.getElementById("daily").innerHTML = metaObj.daily;
document.getElementById("weekly").innerHTML = metaObj.weekly;
}

$(document).ready(function() {
//Sidebar
$('[data-toggle=offcanvas]').click(function() {
$('.row-offcanvas').toggleClass('active');
});

//Duedate Picker Calendar
$(document).on('click','.duedatepicker',function(){
console.log("$(document).on('click','.duedatepicker',function() called");
$(".duedatepicker").datepicker({
beforeShowDay: enableFuture,
dateFormat:"yy-mm-dd",
onSelect: function(date){
//get id of the entry
var entry = $(this).attr('id').slice(2);
setDueDate(date,entry);

//if in Tasks, change the tag it is under
var metaObj = JSON.parse(localStorage.getItem("meta"));
var listname = metaObj["list"];
if(listname=="Tasks"){
	var listDetailsObj = JSON.parse(localStorage.getItem(listname+"Details"));
	//Calculate no. of days remaining
	var currentDate = new Date();      //Current Date and Time
	var diff =  Math.ceil(( Date.parse(date) - Date.parse(currentDate) ) / 86400000);
	console.log(diff);
	listDetailsObj[listNamesObj[entry]].tag = (diff==1)? "Today" :(diff==2)? "Tomorrow" :(diff<8)? "This Week" : "Later";
	localStorage.setItem(listname+"Details",JSON.stringify(listDetailsObj));
	loadData();
	}
}
});
});

function enableFuture(date){
console.log("enableFuture() function called");
	//which list?
	var listname = JSON.parse(localStorage.getItem("meta"))["list"];

	//current goals position
	var entry = ($(this).attr('id')).slice(2);

	//get goalsDetails
	listNames = localStorage.getItem(listname+"Names");
	listNamesObj = JSON.parse(listNames);
	listDetails = localStorage.getItem(listname+"Details");
	listDetailsObj = JSON.parse(listDetails);
	
	//Date in standard format, convert to yy-mm-dd
	var day=date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	if(month<10) month = '0'+month;
	date=''+year+'-'+month+'-'+day;

if(listname!="Winstate"){
	//alter css if it's the duedate
	if(date==listDetailsObj[listNamesObj[entry]].duedate)
	return[true,'tickDay'];
}

	//enable future days
	var currentDate = new Date();
	if(( Date.parse(date) - Date.parse(currentDate))>0)
	return[true];

	//remaining days can't be clicked
	return[false];
}

//Streak Calendars
$(document).on('click','.datepicker',function(){
console.log("$(document).on('click','.datepicker',function() called");
$(".datepicker").datepicker({
beforeShowDay: alterCSS,
dateFormat: "ddmmyy",
onSelect: addDay
});
});

//alter css for days on which progress was made
//and disable future days
function alterCSS(date,entry){
console.log("alterCSS() function called");
//which list?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//current goals position (if entry is not given as a parameter - get it from the attribute's id
var entry = entry||($(this).attr('id')).slice(2);

//get goalsDates
listNames = localStorage.getItem(listname+"Names");
listNamesObj = JSON.parse(listNames);
listDetails = localStorage.getItem(listname+"Details");
listDetailsObj = JSON.parse(listDetails);

//generate key for the month (goalsDates stored in JSON with keys corresponding to mmyyyy)
var day = date.getDate();
var month = date.getMonth()+1;
if(month<10) month = '0'+month;
var key = ''+month+date.getFullYear();

//alter css if progress was made
if($.inArray(day,listDetailsObj[listNamesObj[entry]][key])>=0)
return[true,'tickDay'];

//disable future days
var currentDate = new Date();
if(( Date.parse(date) - Date.parse(currentDate))>0)
return[false];

//remaining days can be clicked
return[true];
}

//Checkboxes
$(document).on('change','.checkbox',function(){
console.log("$(document).on('change','.checkbox',function() called");
//which list?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];
//get goal's id
var entry = ($(this).parent().next().attr('id')).slice(1);

//add points if Tasks or Dailies
if((listname=="Tasks")||(listname=="Dailies")){
	//load relevent data
	var listDetails = localStorage.getItem(listname+"Details");
	var listNames = localStorage.getItem(listname+"Names");
	var listDetailsObj = JSON.parse(listDetails);
	var listNamesObj = JSON.parse(listNames);

	//add points
	addPoints(parseInt(listDetailsObj[listNamesObj[entry]].points));
	
	//uncheck the checkbox (because Habit's can be done any number of times in a day)
	$(this).prop("checked", false);
}
//if it's a task, delete it
if(listname == "Tasks"){
	del(entry);
}
//else add today's date to it's calendar
else{
	//get today's date and send it to addDay() function in the same format as jquery sends a date when any date on a calendar is clicked
	var date = new Date();
	var day = date.getDate();
	if(day<10) day='0'+day;
	var month = date.getMonth()+1;
	if(month<10) month='0'+month;
	if(day<10) day='0'+day;
	var year = date.getFullYear();
	date=''+day+month+year;	
	//if "Dailies" then continue only if Today is not already present in it's data
	if (listname=="Dailies"){
	//load required data
	var listDetails = localStorage.getItem(listname+"Details");
	var listDetailsObj = JSON.parse(listDetails);
	//key doesn't exists (or) date doesn't exists
	if((listDetailsObj[listNamesObj[entry]].key === undefined)||($.inArray(day, listDetailsObj[listNamesObj[entry]].key) == -1)){
	addDay(date,entry);
	}
	}
	else //its "Goals" or "Winstate"
	//addDay to calendar through the same function that does it when any date on the calendar is clicked
	addDay(date,entry);
}
});

//function executed when any day on a calendar is clicked
//function to add the day to JSON data and recalculate streak
function addDay(date, entry){
console.log("addDay() function called");
//which list?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//get id of the entry
//if nothing has been sent in "entry" parameter - i.e., calendar was clicked and not checkbox
if(isNaN(entry))
entry = $(this).attr('id').slice(2);

//load required data
var listNames = localStorage.getItem(listname+"Names");
var listDetails = localStorage.getItem(listname+"Details");
var listNamesObj = JSON.parse(listNames);
var listDetailsObj = JSON.parse(listDetails);

//date received as string - get day, key, month, year from date
var day=parseInt(date.slice(0,-6));
var key=date.slice(2);
var month=key.slice(0,-4);
var year=key.slice(2);

//key doesn't exists?
if(listDetailsObj[listNamesObj[entry]][key] === undefined){
//add key
listDetailsObj[listNamesObj[entry]][key]=new Array();
}

//day doesn't exists? add day
if($.inArray(day, listDetailsObj[listNamesObj[entry]][key]) == -1)
listDetailsObj[listNamesObj[entry]][key].push(day);

//day already existed? remove day
else 
listDetailsObj[listNamesObj[entry]][key].splice(listDetailsObj[listNamesObj[entry]][key].indexOf(day),1);

//recalculate streak
listDetailsObj[listNamesObj[entry]]["count"]=-1;  //-1 because the do...while loop will execute first time even if no entries present
//looping around past days
var yesterDate = new Date();
do{
listDetailsObj[listNamesObj[entry]]["count"]++;
yesterDate = new Date(yesterDate.getFullYear(), yesterDate.getMonth(), yesterDate.getDate()-1);
var yesterDay = yesterDate.getDate();
var yesterMonth = yesterDate.getMonth()+1;
if(yesterMonth<10) yesterMonth = '0'+yesterMonth;
var yesterYear = yesterDate.getFullYear();
var yesterKey = ''+yesterMonth+yesterYear;
}while($.inArray(yesterDay, listDetailsObj[listNamesObj[entry]][yesterKey]) >= 0);
//add today if present
//get today's paramentes
var currentDate = new Date();
var currentDay = currentDate.getDate();
var currentMonth = currentDate.getMonth()+1;
if(currentMonth<10) currentMonth = '0'+currentMonth;
var currentYear = currentDate.getFullYear();
var currentKey = ''+currentMonth+currentYear;
if($.inArray(currentDay, listDetailsObj[listNamesObj[entry]][currentKey]) >=0)
listDetailsObj[listNamesObj[entry]]["count"]++;

//update UI with latest data
document.getElementById("co"+entry).innerHTML = listDetailsObj[listNamesObj[entry]]["count"];

//save changes
localStorage.setItem(listname+"Details",JSON.stringify(listDetailsObj));
}

//edit points for an entry
$(document).on('click','.point', function(e){
console.log("$(document).on('click','.point', function(e) function called");
//To not click on the .list too
e.stopImmediatePropagation();

//which list is this?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//get required data
var listDetails = localStorage.getItem(listname+"Details");
var listNames = localStorage.getItem(listname+"Names");
var listDetailsObj = JSON.parse(listDetails);
var listNamesObj = JSON.parse(listNames);

//get id
var entry = $(this).attr('id').slice(1);

$('#p'+entry).attr('contentEditable',true).focus().blur(function(){
	$(this).attr('contentEditable',false);
	listDetailsObj[listNamesObj[entry]].points = $(this).text();
	//save the changes
	localStorage.setItem(listname+'Details',JSON.stringify(listDetailsObj));
});
});

//edit pencil icons
$(document).on('click','.edit', function(e){
console.log("$(document).on('click','.edit', function(e) called");
//To not click on the .list too
e.stopImmediatePropagation();
//get id
var entry = $(this).attr('id').slice(2);
var oldValue = $('#entryText'+entry).text();
$('#entryText'+entry).attr('contentEditable',true).focus().blur(function(){
	$(this).attr('contentEditable',false);
	var newValue = $(this).text();
	//getting some error if oldValue=newValue
	if((oldValue!=newValue)&&(newValue!=""))
		edit(oldValue, newValue);
});
});

//delete icons
$(document).on('click','.del',function(e){
console.log("$(document).on('click','.del',function(e) fuction called");
//To not click on the .list too
e.stopImmediatePropagation();
//get id
var entry = $(this).attr('id').slice(1);
del(entry);
});

//Duedate setter
$(document).on('click','.duedate',function(e){
console.log("$(document).on('click','.duedate',function(e) called");
//To not click on the .list too
e.stopImmediatePropagation();
//Get id of the goal
var entry = $(this).attr('id').slice(2);
//Toggle the duedatepicker of this goal
$('#gs'+entry).toggle();
//Hide the streak calenar of this goal
$('#gc'+entry).hide();
});

//li elements, lists
$(document).on('click', '.list', function(e){
console.log("$(document).on('click', '.list', function(e) called");
//which list?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//Do not show/hide anything for "Yes! I did it!" page
if (listname!="Winstate"){

    $("#popup").animate({left:"335px"});
	//Get id of the goal
	var entry = ($(this).attr('id')).slice(1);

	//Hide all except this one - streaks calendar
	$('.datepicker:not(#gc'+entry+')').hide();
	//toggle for this one
	$('#gc'+entry).toggle();
	
	//Hide all duedate pickers
	$('.duedatepicker').hide();
}
});

/*Collapse/Show List Icons removed - they were confusing the users - users think that clicking on them will reveal what they are to do for the day
//tags - present, future, today, etc...
$(document).on('click', '.tags', function(){

//Get id of the Tag
var tag = ($(this).attr('id')).slice(3);
$('.inTag'+tag).toggle();

//toggle the collapse gliphicon icon
$('#tagIcon'+tag).toggleClass('glyphicon-collapse-down');
$('#tagIcon'+tag).toggleClass('glyphicon-expand');
});
*/
	
//Functions to enable drag and drop property to the "list" element which is a ul list containg all goals names
//Taken from: http://jqueryui.com/sortable/ and http://api.jqueryui.com/sortable/#event-update
$("#list").sortable({
start: function(event, ui) {
console.log("start function in sortable called");
//hide all calendars
$('.datepicker').hide();
$('.duedatepicker').hide();
//save the initial position of item being dragged
var entry = $(ui.item).index();
var metaObj = JSON.parse(localStorage.getItem("meta"));
metaObj["initialPos"]=entry;
localStorage.setItem("meta",JSON.stringify(metaObj));
},
update: function(event, ui) {
console.log("update() function in sortable called");
//position changes
var initialPos = JSON.parse(localStorage.getItem("meta"))["initialPos"];
var finalPos = $(ui.item).index();

//get meta data
var meta = localStorage.getItem("meta");
var metaObj = JSON.parse(meta);

//which list got updated?
var listname = metaObj["list"];

//get listNames
var listNames = localStorage.getItem(listname+"Names");
var listNamesObj = JSON.parse(listNames);

//get Details -- for tags and their counts
var listDetailsStr = localStorage.getItem(listname+"Details");
var listDetailsObj = JSON.parse(listDetailsStr);

//uncount the tags -- from initialPos and finalPos
var thisPos = -1;
var initialTag = 0;
var finalTag= 0;
var correctInitial = initialPos;
//because initially it might have been just below a Tag
if(initialPos>finalPos) initialPos++;
var correctFinal = finalPos;
$(".list").each(function() {
thisPos++;
if($(this).hasClass("tags")){

if(thisPos<finalPos){
correctFinal--;
finalTag++;

}
if(thisPos<initialPos){
correctInitial--;
initialTag++;

}
}
});

//update listNames with changed position
listNamesObj.move(correctInitial,correctFinal);

//mark the tag
listDetailsObj[listNamesObj[correctFinal]].tag = metaObj[listname][finalTag];

//increment final tag's count
metaObj[metaObj[listname][finalTag]]++;

//decrement initial tags's count
metaObj[metaObj[listname][initialTag]]--;

//change the class of this one's container --> to hide when a tag is clicked
$('#g'+correctInitial).parent().parent().removeClass().addClass('inTag'+finalTag);

//show correct count on screen
document.getElementById("tagCount"+finalTag).innerHTML++;
document.getElementById("tagCount"+initialTag).innerHTML--;

//save the data
localStorage.setItem("meta",JSON.stringify(metaObj));
localStorage.setItem(listname+"Names",JSON.stringify(listNamesObj));
localStorage.setItem(listname+"Details",JSON.stringify(listDetailsObj));

//change the duedate if "Tasks"
if((listname=="Tasks")&&(initialTag!=finalTag)){
	//the task is due 'n' days from today
	var n = finalTag; //for finalTag=0,1 i.e, today and tommorrow
	if(finalTag==2) n = 7;
	else if(finalTag==3) n= 14;

	//today's date
	var today = new Date();
	
	//duedate
	var duedate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+n);
	
	//convert to yy-mm-dd format because that's what jQuery supports and can be parsed
	var duedateDay = duedate.getDate();
	if (duedateDay<10) duedateDay = '0'+duedateDay;
	var duedateMonth = duedate.getMonth()+1;
	if (duedateMonth<10) duedateMonth = '0'+duedateMonth;
	var duedateYear = duedate.getFullYear();
	var duedate = ''+duedateYear+'-'+duedateMonth+'-'+duedateDay;
	setDueDate(duedate,correctFinal);
}

//Reload the whole list, so every entry gets new ID
loadData();

},
//Ability to drag only along the y-axis
axis: 'y',
//Do not drag the calendar and the "future" tag. From: http://jqueryui.com/draggable/#handle
cancel: "div.cal",
cancel: ".tags"
});
$("#list").disableSelection();
});

//add new entries
function save(){
console.log("save() function called");
//in which list are we saving?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//Get data from the form
var newEntry = document.getElementById("newEntry").value;		//Get 'goal' from form

//no value? terminate function
if (newEntry=="")
return false;

//clear the form.
var form = document.getElementById("input");
form.reset();

//Storing values into localStorage
//Get localStorage Data
var meta = localStorage.getItem("meta");
var metaObj = JSON.parse(meta);
var listNamesStr = localStorage.getItem(listname+"Names");
var listDetailsStr = localStorage.getItem(listname+"Details");

//add to goalsNames
var listNames = JSON.parse(listNamesStr);
listNames.unshift(newEntry);
//goalsNames.push(newEntry);	//To add entry at the end
localStorage.setItem(listname+"Names", JSON.stringify(listNames));

//duedate is null by default
var duedate = "";
//add to goalsDetails
if(listname=="Tasks"){
//Set today as the duedate
duedate = new Date();
var day = duedate.getDate();
var month = duedate.getMonth()+1;
var year = duedate.getFullYear();
if(month<10) month='0'+month;
if(day<10) day='0'+day;
duedate = ''+year+'-'+month+'-'+day;
}
var details = '"'+newEntry+'":{"count":0,"duedate":"'+duedate+'","points":0,"tag":"'+metaObj[listname][0]+'"}';//Data Structure of JSON data
listDetailsStr = listDetailsStr.slice(0,-1);		//Data Structure in which JSON data is stored
if(listDetailsStr!='{')
listDetailsStr += ',';
listDetailsStr += details + '}';			//Data Structure in which JSON data is stored
//increment "present" count
metaObj[metaObj[listname][0]]++;

//save data
localStorage.setItem("meta", JSON.stringify(metaObj));
localStorage.setItem(listname+"Details", listDetailsStr);

loadData();     //refresh list with the new goal present
}

//function to edit the name of an entry
function edit(oldValue, newValue){
console.log("edit function called");
//which list?
var listname = JSON.parse(localStorage.getItem("meta"))["list"];

//load all data
var listNamesStr = localStorage.getItem(listname+"Names");
var listDetailsStr = localStorage.getItem(listname+"Details");
var listNamesObj = JSON.parse(listNamesStr);
var listDetailsObj = JSON.parse(listDetailsStr);

//edit in goalDates
localStorage.setItem(newValue,localStorage.getItem(oldValue));
localStorage.removeItem(oldValue);

//edit in goalsNames. From: http://www.w3schools.com/jsref/jsref_splice.asp and http://www.w3schools.com/jsref/jsref_indexof_array.asp
listNamesObj.splice(listNamesObj.indexOf(oldValue),1,newValue);

//edit in goalsDetails
listDetailsObj[newValue] = listDetailsObj[oldValue];
delete listDetailsObj[oldValue];

//saving goalsNames and goalsDetails
localStorage.setItem(listname+"Names",JSON.stringify(listNamesObj));
localStorage.setItem(listname+"Details",JSON.stringify(listDetailsObj));

//reload list
loadData();
}

function del(entry){
console.log("del() function called");
//load all data
var meta = localStorage.getItem("meta");
var metaObj = JSON.parse(meta);
//which list?
var listname = metaObj["list"];
var listNamesStr = localStorage.getItem(listname+"Names");
var listDetailsStr = localStorage.getItem(listname+"Details");
var listNamesObj = JSON.parse(listNamesStr);
var listDetailsObj = JSON.parse(listDetailsStr);

//decrementing tag's count
metaObj[listDetailsObj[listNamesObj[entry]].tag]--;

//remove from listDetails
delete listDetailsObj[listNamesObj[entry]];

//remove from listNames. From: http://www.w3schools.com/jsref/jsref_splice.asp
listNamesObj.splice(entry,1);

//saving listNames and listDetails
localStorage.setItem("meta",JSON.stringify(metaObj));
localStorage.setItem(listname+"Names",JSON.stringify(listNamesObj));
localStorage.setItem(listname+"Details",JSON.stringify(listDetailsObj));

//reload list
loadData();
}

Array.prototype.move = function (old_index, new_index) {
console.log("Array.prototype.move = function called");
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};