/*LATER LIST:
1. Modify .tickDay css
2. Images of jquery-ui not available
3. Try resuing the common code between the function called when a date on the datepicker is clicked and the function called when the .checkbox is clicked
4. No gap between "Today" tag and the tasks below it
5. Clicking on a Tag, (eg. "present") shows/hides al it's contents - but not accordion where only one is visible at any time
-------Tasks.js--------
5. Multiple Tags to be created and not just "future"
6. More counts and not just "present"/"future" counts
7. Clicking on checkbox to delete tasks and not just add a day to "habitDates"
8. Clicking on an li item to not show datepicker for tasks
9. update function fired on sorting to take care of other counts too and not just "present" and "future"
------Habits.js--------
*/
window.onload=function(){
//App used for first time?
if (localStorage.getItem("habitsDetails") === null){
//Initialize Data
var habitsDetails = '{}';
var habitsNames = '[]';
//set initial data
localStorage.setItem("habitsDetails",habitsDetails);
localStorage.setItem("habitsNames",habitsNames);
}
//then load list of habits
loadData();

//timer to reload page on Midnight
var today = new Date();
var tommorow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
var timeToMidnight = tommorow-today;
var timer = setTimeout(function(){loadData()},timeToMidnight);
}

function loadData(){
//clear list contents (so that double copies of list doesn't forms on reload)
var list = document.getElementById("list");	
while (list.firstChild) {
    list.removeChild(list.firstChild);
}

//get habitsNames and habitsDetails
var habitsNames = localStorage.getItem("habitsNames");
var habitsDetails = localStorage.getItem("habitsDetails");
var habitsNamesObj = JSON.parse(habitsNames);
var habitsDetailsObj = JSON.parse(habitsDetails);

/*Habits do not have any tags
//is "future" tag added?
var future =0;
*/

//for each habit
for(var i=0; i<habitsNamesObj.length; i++){
	
	/*Habits do not have "tags"
	//add "future" tag if this is the first habit belonging to future
	if((future==0)&&(habitsDetailsObj[habitsNamesObj[i]].active == "future")){
	createTags();
	future = 1
	}
	*/
	
	//get habitsDates (to tick checkbox)
	habitDates = localStorage.getItem(habitsNamesObj[i]);
	habitDatesObj = JSON.parse(habitDates);
	
	//generate key for current month (habitsDates stored in JSON with keys corresponding to mmyyyy)
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	if (month<10) month = '0'+month;
	key = ''+month+year;
	
	//HTML DOM Manipulation
	//whole container - li, checkbox, calendar
	var container = document.createElement("div");
	var inputGroup = document.createElement("div");
	inputGroup.setAttribute("class","input-group");
	var span = document.createElement("span");
	span.setAttribute("class","input-group-addon");
	var checkbox = document.createElement("input");
	checkbox.setAttribute("type","checkbox");
	checkbox.setAttribute("class", "checkbox");
	//if today present in habitsDates (i.e, progress made towards it today)
	if($.inArray(day, habitDatesObj[key])>=0)
	//then check the checkbox
	checkbox.setAttribute("checked","true");
	span.appendChild(checkbox);
	inputGroup.appendChild(span);
	//anchor tag instead of "li" to "linkify"
	var node = document.createElement("a");
	node.setAttribute("href","#");
	//"list-group-item" is a requirement of bootstrap
	node.setAttribute("class","list list-group-item");
	node.setAttribute('id','g'+i);
	var textnode = document.createTextNode(habitsNamesObj[i]);
	node.appendChild(textnode);
	inputGroup.appendChild(node);
	container.appendChild(inputGroup);
	
	/*Habits do not have due dates
	//Due Date Text
	var duedate = document.createElement("div");
	duedate.setAttribute('class','duedate');
	duedate.setAttribute('id','gd'+i);
	duedate.setAttribute('align','center');
	if(habitsDetailsObj[habitsNamesObj[i]].noofdays=='')
	var text = document.createTextNode("Click to set Duedate");
	else
	var text = document.createTextNode(""+habitsDetailsObj[habitsNamesObj[i]].duedate+" ("+habitsDetailsObj[habitsNamesObj[i]].noofdays+" days)");
	duedate.appendChild(text);
	container.appendChild(duedate);
	//Duedate Picker Calendar
	var dueCal = document.createElement("div");
	dueCal.setAttribute('id','gs'+i);
	dueCal.setAttribute('class','duedatepicker');
	container.appendChild(dueCal);
	*/
	
	//Streak Calendar
	var cal = document.createElement("div");
	cal.setAttribute('id','gc'+i);
	cal.setAttribute("class","datepicker");
	//cal (calendar) part of the container
	container.appendChild(cal);
	//container is a part of the list
	document.getElementById("list").appendChild(container);
	
	/*Habits do not have "duedates"
	//generate the duedate picker calendar
	$('.duedatepicker').click();
	*/
	
	//generate the streaks calendar
	$('.datepicker').click();
	//$('#gc'+i).children().width($('#gc'+i).innerWidth());	//Adjust the width of the Calendar to be about the same as the list item.
	}
	
	//Hide all calendars and duedates by default
	$('.datepicker').hide();
	/*Habits do not have "duedates"
	$('.duedatepicker').hide();
	$('.duedate').hide();
	*/
	
	/*Habits do not have Tags
	//if there were no "future" habits at all
	if (future == 0)
	createTags();
	*/

	/*Habits do not have Tags
	//display "present" count
	document.getElementById("present-count").innerHTML = habitsDetailsObj["present"];	
	//display "future" count
	document.getElementById("future-count").innerHTML = habitsDetailsObj["future"];
	*/
}

//function to add the "future" tag to the list
function createTags(){
	//HTML DOM Manipulation
	//Create a new li element
	var node = document.createElement("li");
	var count = document.createElement("span");
	count.setAttribute("class","badge");
	node.setAttribute("class", "list list-group-item");
	node.setAttribute('id','future');
	//Textnode (to contain Tag)
	var textnode = document.createTextNode("Future");
	//"future" count. span to contain bootstrap's badge
	count.setAttribute("id","future-count");
	//textnode and count are part of li (in that order!)
	node.appendChild(textnode);
	node.appendChild(count);
	//li is a part of the list
	document.getElementById("list").appendChild(node);
}

$(document).ready(function() {

//Sidebar
$('[data-toggle=offcanvas]').click(function() {
$('.row-offcanvas').toggleClass('active');
});

//Duedate Picker Calendar
$(document).on('click','.duedatepicker',function(){
$(".duedatepicker").datepicker({
beforeShowDay: enableFuture,
dateFormat:"yy-mm-dd",
onSelect: setDueDate
});
});

function enableFuture(date){
//current habits position
var habit = ($(this).attr('id')).slice(2);

//get habitsDetails
habitsNames = localStorage.getItem("habitsNames");
habitsNamesObj = JSON.parse(habitsNames);
habitsDetails = localStorage.getItem("habitsDetails");
habitsDetailsObj = JSON.parse(habitsDetails)

//generate today's date
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();
var array = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
var duedate = ''+day+'-'+array[month]+'-'+year;

//alter css if it's the duedate
if(duedate==habitsDetailsObj[habitsNamesObj[habit]].duedate)
return[true,'tickDay'];

//enable future days
var currentDate = new Date();
if(( Date.parse(date) - Date.parse(currentDate))>0)
return[true];

//remaining days can't be clicked
return[false];
}

function setDueDate(date){
//get id of the habit
var habit = $(this).attr('id').slice(2);

//load required data
var habitsNames = localStorage.getItem("habitsNames");
var habitsNamesObj = JSON.parse(habitsNames);
var habitsDetails = localStorage.getItem("habitsDetails");
var habitsDetailsObj = JSON.parse(habitsDetails);

//Calculate no. of days remaining
var currentDate = new Date();      //Current Date and Time
var diff =  Math.ceil(( Date.parse(date) - Date.parse(currentDate) ) / 86400000);    
console.log(Date.parse(date));

//date received in yy-mm-dd format. Convert to dd-mon-yy
console.log(date);
var year=parseInt(date.slice(0,-6));
console.log(year);
var month=parseInt(date.slice(5,-3))-1;
console.log(month);
var day=date.slice(8);
console.log(day);
var array = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
date = ''+day+'-'+array[month]+'-'+year;

//store date
habitsDetailsObj[habitsNamesObj[habit]].duedate=date;
//store no.of days remaning too
habitsDetailsObj[habitsNamesObj[habit]].noofdays=diff

//Change the text on the screen
document.getElementById('gd'+habit).innerHTML=""+habitsDetailsObj[habitsNamesObj[habit]].duedate+" ("+habitsDetailsObj[habitsNamesObj[habit]].noofdays+" days)";

//save the changes
localStorage.setItem("habitsDetails",JSON.stringify(habitsDetailsObj));
}

//Streak Calendars
$(document).on('click','.datepicker',function(){
$(".datepicker").datepicker({
beforeShowDay: alterCSS,
dateFormat: "ddmmyy",
onSelect: addDay
});
});

//alter css for days on which progress was made
//and disable future days
function alterCSS(date){

//current habits position
var habit = ($(this).attr('id')).slice(2);

//get habitsDates
habitsNames = localStorage.getItem("habitsNames");
habitsNamesObj = JSON.parse(habitsNames);
habitDates = localStorage.getItem(habitsNamesObj[habit]);
habitDatesObj = JSON.parse(habitDates);

//generate key for the month (habitsDates stored in JSON with keys corresponding to mmyyyy)
var day = date.getDate();
var month = date.getMonth()+1;
if(month<10) month = '0'+month;
var key = ''+month+date.getFullYear();

//alter css if progress was made
if($.inArray(day,habitDatesObj[key])>=0)
return[true,'tickDay'];

//disable future days
var currentDate = new Date();
if(( Date.parse(date) - Date.parse(currentDate))>0)
return[false];

//remaining days can be clicked
return[true];
}

//function executed when any day on a calendar is clicked
//function to add the day to JSON data and recalculate streak
function addDay(date){

//get id of the habit
var habit = $(this).attr('id').slice(2);

//load required data
var habitDates = localStorage.getItem(habitsNamesObj[habit]);
var habitDatesObj = JSON.parse(habitDates);

//date received as string - get day, key, month, year from date
var day=parseInt(date.slice(0,-6));
var key=date.slice(2);
var month=key.slice(0,-4);
var year=key.slice(2);

//key doesn't exists?
if(habitDatesObj[key] === undefined){
//add key
habitDates = habitDates.slice(0,-1);
habitDates += ',"'+key+'":[]}';
habitDatesObj = JSON.parse(habitDates);
}

//day doesn't exists?
if($.inArray(day, habitDatesObj[key]) == -1){
//add day
habitDatesObj[key].push(day);
//alter css (addClass indicating that progress was made on the day)
$('#gc'+habit).find(".ui-datepicker-current-day").addClass("tickDay");
} 

//day already existed?
else {
//remove day
habitDatesObj[key].splice(habitDatesObj[key].indexOf(day),1);
//alter css (removeClass indicating that progress was made on the day)
$('#gc'+habit).find(".ui-datepicker-current-day").removeClass("tickDay");
}

//recalculate streak
habitDatesObj["count"]=-1;  //-1 because the do...while loop will execute first time even if no entries present
//looping around past days
var yesterDate = new Date();
do{
habitDatesObj["count"]++;
yesterDate = new Date(yesterDate.getFullYear(), yesterDate.getMonth(), yesterDate.getDate()-1);
var yesterDay = yesterDate.getDate();
var yesterMonth = yesterDate.getMonth()+1;
if(yesterMonth<10) yesterMonth = '0'+yesterMonth;
var yesterYear = yesterDate.getFullYear();
var yesterKey = ''+yesterMonth+yesterYear;
}while($.inArray(yesterDay, habitDatesObj[yesterKey]) >= 0);
//add today if present
//get today's paramentes
var currentDate = new Date();
var currentDay = currentDate.getDate();
var currentMonth = currentDate.getMonth()+1;
if(currentMonth<10) currentMonth = '0'+currentMonth;
var currentYear = currentDate.getFullYear();
var currentKey = ''+currentMonth+currentYear;
if($.inArray(currentDay, habitDatesObj[currentKey]) >=0)
habitDatesObj["count"]++;

//save changes
localStorage.setItem(habitsNamesObj[habit],JSON.stringify(habitDatesObj));
}
	
//Checkboxes
$(document).on('change','.checkbox',function(){
//get habit's id
var habit = ($(this).parent().next().attr('id')).slice(1);

//get all habit Details
habitsNames = localStorage.getItem("habitsNames");
habitDates = localStorage.getItem(habitsNamesObj[habit]);
habitsNamesObj = JSON.parse(habitsNames);
habitDatesObj = JSON.parse(habitDates);

//generate key for current month (habitsDates stored in JSON with keys corresponding to mmyyyy)
var date = new Date();
var day = date.getDate();
var month = date.getMonth()+1;
var year = date.getFullYear();
if(month<10) month = '0'+month;
var key = ''+month+year;

//got checked?
if($(this).is(':checked')){
//this key ofr first time?
if(habitDatesObj[key] === undefined){
//add key to habitDates
habitDates = habitDates.slice(0,-1);
habitDates += ',"'+key+'":[]}';
habitDatesObj = JSON.parse(habitDates);
}
//add day to habitDates
habitDatesObj[key].push(day);
//increment "count" (streak)
habitDatesObj["count"]++;
//alter css (add the class which signifies that progress was made on the day)
$('#gc'+habit).find(".ui-datepicker-today").addClass("tickDay");
}

//got unchecked?
else {
//remove day from habitDates
habitDatesObj[key].splice(habitDatesObj[key].indexOf(day),1);
//decrement "count" (streak)
habitDatesObj["count"]--;
//alter css (remove the class which signifies that progress was made on the day)
$('#gc'+habit).find(".ui-datepicker-today").removeClass("tickDay");
}

//save the changes
localStorage.setItem(habitsNamesObj[habit],JSON.stringify(habitDatesObj));
});

//Duedate setter
$(document).on('click','.duedate',function(){
//Get id of the habit
var habit = $(this).attr('id').slice(2);

//Toggle the duedatepicker of this habit
$('#gs'+habit).toggle();
//Toggle the streak calenar of this habit
$('#gc'+habit).toggle();
});

//li elements, lists
$(document).on('click', '.list', function() {
//Get id of the habit
var habit = ($(this).attr('id')).slice(1);

//Hide all except this one
$('.datepicker:not(#gc'+habit+')').hide();
$('.duedate:not(#gd'+habit+')').hide();

//Toggle this one's duedate	
$('#gd'+habit).toggle();

//duedatepicker visible?
if($('#gs'+habit).is(":visible")){
//Hide duedate picker
$('#gs'+habit).hide();
}
else{
//Toggle datepicker
$('#gc'+habit).toggle();
}
});
	
//SOON. Update funtion to do noting with "tags" in case of habits
//Functions to enable drag and drop property to the "list" element which is a ul list containg all habits names
//Taken from: http://jqueryui.com/sortable/ and http://api.jqueryui.com/sortable/#event-update
$("#list").sortable({
update: function(event, ui) {

//reset habitsNames
var habitsNames = new Array();

//reser "present"/"future" count
var habitsDetailsStr = localStorage.getItem("habitsDetails");
var habitsDetailsStr = localStorage.getItem("habitsDetails");
var habitsDetailsObj = JSON.parse(habitsDetailsStr);
habitsDetailsObj["present"]=0;
habitsDetailsObj["future"]=0;

//are we past the "future" id yet?
var future = 0;

//loop through all li elements execept the "future" tag
$(".list").each(function() {
	
	//if this is not the "future" tag
	if($(this).attr('id')!=="future"){
	//add habit's name to the list
	habitsNames.push($(this).text());
	//if this is a "present" habit
	if(future == 0){
	//mark it as "present"
	habitsDetailsObj[$(this).text()].active="present";
	//increment "present" count
	habitsDetailsObj["present"]++;
	}
	else{
	//mark it as "future"
	habitsDetailsObj[$(this).text()].active="future";
	//increment "future" count
	habitsDetailsObj["future"]++;
	}
	}
	else
	//else mark "future" tag as passed
	future = 1;
	
	//display "present" count
	document.getElementById("present-count").innerHTML = habitsDetailsObj["present"];
	//display "future" count
	document.getElementById("future-count").innerHTML = habitsDetailsObj["future"];
    });

//save the data
localStorage.setItem("habitsNames",JSON.stringify(habitsNames));
localStorage.setItem("habitsDetails",JSON.stringify(habitsDetailsObj));
},
//Ability to drag only along the y-axis
axis: 'y',
//Do not drag the calendar and the "future" tag. From: http://jqueryui.com/draggable/#handle
cancel: "div.cal",
cancel: "#future"
});
$("#list").disableSelection();
});

//add new habits
function save(){
//Get data from the form
var habit = document.getElementById("habit").value;		//Get 'habit' from form

//no value? terminate function
if (habit=="")
return false;

//clear the form.
var form = document.getElementById("input");
form.reset();

//Storing values into localStorage
//Get localStorage Data
var habitsNamesStr = localStorage.getItem("habitsNames");
var habitsDetailsStr = localStorage.getItem("habitsDetails");

//add to habitsNames
var habitsNames = JSON.parse(habitsNamesStr);
habitsNames.unshift(habit);
//habitsNames.push(habit);	//Toadd habit at the end
localStorage.setItem("habitsNames", JSON.stringify(habitsNames));

//add to habitsDetails
var details = '"'+habit+'":{"duedate":"","noofdays":"","active":"present"}';//Data Structure of JSON data
habitsDetailsStr = habitsDetailsStr.slice(0,-1);		//Data Structure in which JSON data is stored
habitsDetailsStr += ',' + details + '}';			//Data Structure in which JSON data is stored
//increment "present" count
var habitsDetailsObj = JSON.parse(habitsDetailsStr);
habitsDetailsObj["present"]++;
localStorage.setItem("habitsDetails", JSON.stringify(habitsDetailsObj));

//Initialize habit Dates
localStorage.setItem(habit,'{"count":0}');
loadData();     //refresh list with the new habit present
}

//function to edit the name of a habit
function edit(){

//get old name and new name
var habit2 = document.getElementById("habit2").value;
var habit3 = document.getElementById("habit3").value;

//load all data
var habitsNamesStr = localStorage.getItem("habitsNames");
var habitsDetailsStr = localStorage.getItem("habitsDetails");
var habitsNamesObj = JSON.parse(habitsNamesStr);
var habitsDetailsObj = JSON.parse(habitsDetailsStr);

//edit in habitsNames. From: http://www.w3schools.com/jsref/jsref_splice.asp and http://www.w3schools.com/jsref/jsref_indexof_array.asp
habitsNamesObj.splice(habitsNamesObj.indexOf(habit2),1,habit3);

//edit in habitsDetails
habitsDetailsObj[habit3] = habitsDetailsObj[habit2];
delete habitsDetailsObj[habit2];

//edit in habitDates
localStorage.setItem(habit3,localStorage.getItem(habit2));
localStorage.removeItem(habit2);

//saving habitsNames and habitsDetails
localStorage.setItem("habitsNames",JSON.stringify(habitsNamesObj));
localStorage.setItem("habitsDetails",JSON.stringify(habitsDetailsObj));

//reload list
loadData();
}

function del(){

//get habit's name
var habit2 = document.getElementById("habit2").value;

//load all data
var habitsNamesStr = localStorage.getItem("habitsNames");
var habitsDetailsStr = localStorage.getItem("habitsDetails");
var habitsNamesObj = JSON.parse(habitsNamesStr);
var habitsDetailsObj = JSON.parse(habitsDetailsStr);

//remove from habitsNames. From: http://stackoverflow.com/a/5767357/2134555
habitsNamesObj.splice(habitsNamesObj.indexOf(habit2),1);

//decrementing "present"/"future" count
habitsDetailsObj[habitsDetailsObj[habit2].active]--;

//remove from habitsDetails
delete habitsDetailsObj[habit2];

//delete from habitDates
localStorage.removeItem(habit2);

//saving habitsNames and habitsDetails
localStorage.setItem("habitsNames",JSON.stringify(habitsNamesObj));
localStorage.setItem("habitsDetails",JSON.stringify(habitsDetailsObj));

//reload list
loadData();
}

//Function to get the name of the habit in "habit2" box and display details of the particular habit
function showAll(){
var habit2=document.getElementById("habit2").value;
var habitsStr = localStorage.getItem("habitsDetails");
var habitsObj = JSON.parse(habitsStr);
if (habitsObj[habit2]!==undefined){
//document.getElementById("duedate").innerHTML=habitsObj[habit2].duedate;
//document.getElementById("noofdays").innerHTML=habitsObj[habit2].noofdays;
//document.getElementById("active2").innerHTML=habitsObj[habit2].active; 
}
//else
//document.getElementById("duedate").innerHTML="No such habit found";
}