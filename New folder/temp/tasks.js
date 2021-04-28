/*LATER LIST:
1. Modify .tickDay css
2. Images of jquery-ui not available
3. Try resuing the common code between the function called when a date on the datepicker is clicked and the function called when the .checkbox is clicked
4. No gap between "Today" tag and the tasks below it
*/
window.onload=function(){
//App used for first time?
if (localStorage.getItem("tasksDetails") === null){
//Initialize Data
var tasksDetails = '{"today":0,"tommorow":0,"thisweek":0,"later":0}';
var tasksNames = '[]';
//set initial data
localStorage.setItem("tasksDetails",tasksDetails);
localStorage.setItem("tasksNames",tasksNames);
}
//then load list of tasks
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

//get tasksNames and tasksDetails
var tasksNames = localStorage.getItem("tasksNames");
var tasksDetails = localStorage.getItem("tasksDetails");
var tasksNamesObj = JSON.parse(tasksNames);
var tasksDetailsObj = JSON.parse(tasksDetails);

//is "future" tag added?
var future =0;

//for each task
for(var i=0; i<tasksNamesObj.length; i++){
	
	//SOON. Multiple tags to be created and not just "future"
	//add "future" tag if this is the first task belonging to future
	if((future==0)&&(tasksDetailsObj[tasksNamesObj[i]].active == "future")){
	createTags();
	future = 1;
	}
	
	/*As tasks are once-off things, checked means they are deleted!
	//get tasksDates (to tick checkbox)
	taskDates = localStorage.getItem(tasksNamesObj[i]);
	taskDatesObj = JSON.parse(taskDates);
	*/
	
	/*As tasks are once-off things, there are no different "dates" on whih they were performed
	//generate key for current month (tasksDates stored in JSON with keys corresponding to mmyyyy)
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	if (month<10) month = '0'+month;
	key = ''+month+year;
	*/
	
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
	/*Tasks are once-off things, so no ticking the checkboxes
	//if today present in tasksDates (i.e, progress made towards it today)
	if($.inArray(day, taskDatesObj[key])>=0)
	//then check the checkbox
	checkbox.setAttribute("checked","true");
	*/
	span.appendChild(checkbox);
	inputGroup.appendChild(span);
	//anchor tag instead of "li" to "linkify"
	var node = document.createElement("a");
	node.setAttribute("href","#");
	//"list-group-item" is a requirement of bootstrap
	node.setAttribute("class","list list-group-item");
	node.setAttribute('id','g'+i);
	var textnode = document.createTextNode(tasksNamesObj[i]);
	node.appendChild(textnode);
	inputGroup.appendChild(node);
	container.appendChild(inputGroup);
	/* Let Tasks have duedates too   */
	//Due Date Text
	var duedate = document.createElement("div");
	duedate.setAttribute('class','duedate');
	duedate.setAttribute('id','gd'+i);
	duedate.setAttribute('align','center');
	if(tasksDetailsObj[tasksNamesObj[i]].noofdays=='')
	var text = document.createTextNode("Click to set Duedate");
	else
	var text = document.createTextNode(""+tasksDetailsObj[tasksNamesObj[i]].duedate+" ("+tasksDetailsObj[tasksNamesObj[i]].noofdays+" days)");
	duedate.appendChild(text);
	container.appendChild(duedate);
	//Duedate Picker Calendar
	var dueCal = document.createElement("div");
	dueCal.setAttribute('id','gs'+i);
	dueCal.setAttribute('class','duedatepicker');
	container.appendChild(dueCal);
	
	/* Tasks do not have Streaks
	//Streak Calendar
	var cal = document.createElement("div");
	cal.setAttribute('id','gc'+i);
	cal.setAttribute("class","datepicker");
	//cal (calendar) part of the container
	container.appendChild(cal);
	*/
	
	//container is a part of the list
	document.getElementById("list").appendChild(container);
	//generate the duedate picker calendar
	$('.duedatepicker').click();
	/*Tasks has no Streaks Calendar
	//generate the streaks calendar
	$('.datepicker').click();
	*/
	//$('#gc'+i).children().width($('#gc'+i).innerWidth());	//Adjust the width of the Calendar to be about the same as the list item.
	}
	
	//Hide all calendars and duedates by default
	/*Tasks Do not have streks calendar
	$('.datepicker').hide();
	*/
	$('.duedatepicker').hide();
	$('.duedate').hide();
	
	//SOON. More tags and not just "future" tags
	//if there were no "future" tasks at all
	if (future == 0)
	createTags();

	//SOON. More counts and not just "present"/"future" counts
	//display "present" count
	document.getElementById("present-count").innerHTML = tasksDetailsObj["present"];	
	//display "future" count
	document.getElementById("future-count").innerHTML = tasksDetailsObj["future"];
}

//SOON. More tags and not just "future" tags
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
//current tasks position
var task = ($(this).attr('id')).slice(2);

//get tasksDetails
tasksNames = localStorage.getItem("tasksNames");
tasksNamesObj = JSON.parse(tasksNames);
tasksDetails = localStorage.getItem("tasksDetails");
tasksDetailsObj = JSON.parse(tasksDetails)

//generate today's date
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();
var array = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
var duedate = ''+day+'-'+array[month]+'-'+year;

//alter css if it's the duedate
if(duedate==tasksDetailsObj[tasksNamesObj[task]].duedate)
return[true,'tickDay'];

//enable future days
var currentDate = new Date();
if(( Date.parse(date) - Date.parse(currentDate))>0)
return[true];

//remaining days can't be clicked
return[false];
}

function setDueDate(date){
//get id of the task
var task = $(this).attr('id').slice(2);

//load required data
var tasksNames = localStorage.getItem("tasksNames");
var tasksNamesObj = JSON.parse(tasksNames);
var tasksDetails = localStorage.getItem("tasksDetails");
var tasksDetailsObj = JSON.parse(tasksDetails);

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
tasksDetailsObj[tasksNamesObj[task]].duedate=date;
//store no.of days remaning too
tasksDetailsObj[tasksNamesObj[task]].noofdays=diff

//Change the text on the screen
document.getElementById('gd'+task).innerHTML=""+tasksDetailsObj[tasksNamesObj[task]].duedate+" ("+tasksDetailsObj[tasksNamesObj[task]].noofdays+" days)";

//save the changes
localStorage.setItem("tasksDetails",JSON.stringify(tasksDetailsObj));
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

//current tasks position
var task = ($(this).attr('id')).slice(2);

//get tasksDates
tasksNames = localStorage.getItem("tasksNames");
tasksNamesObj = JSON.parse(tasksNames);
taskDates = localStorage.getItem(tasksNamesObj[task]);
taskDatesObj = JSON.parse(taskDates);

//generate key for the month (tasksDates stored in JSON with keys corresponding to mmyyyy)
var day = date.getDate();
var month = date.getMonth()+1;
if(month<10) month = '0'+month;
var key = ''+month+date.getFullYear();

//alter css if progress was made
if($.inArray(day,taskDatesObj[key])>=0)
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

//get id of the task
var task = $(this).attr('id').slice(2);

//load required data
var taskDates = localStorage.getItem(tasksNamesObj[task]);
var taskDatesObj = JSON.parse(taskDates);

//date received as string - get day, key, month, year from date
var day=parseInt(date.slice(0,-6));
var key=date.slice(2);
var month=key.slice(0,-4);
var year=key.slice(2);

//key doesn't exists?
if(taskDatesObj[key] === undefined){
//add key
taskDates = taskDates.slice(0,-1);
taskDates += ',"'+key+'":[]}';
taskDatesObj = JSON.parse(taskDates);
}

//day doesn't exists?
if($.inArray(day, taskDatesObj[key]) == -1){
//add day
taskDatesObj[key].push(day);
//alter css (addClass indicating that progress was made on the day)
$('#gc'+task).find(".ui-datepicker-current-day").addClass("tickDay");
} 

//day already existed?
else {
//remove day
taskDatesObj[key].splice(taskDatesObj[key].indexOf(day),1);
//alter css (removeClass indicating that progress was made on the day)
$('#gc'+task).find(".ui-datepicker-current-day").removeClass("tickDay");
}

//recalculate streak
taskDatesObj["count"]=-1;  //-1 because the do...while loop will execute first time even if no entries present
//looping around past days
var yesterDate = new Date();
do{
taskDatesObj["count"]++;
yesterDate = new Date(yesterDate.getFullYear(), yesterDate.getMonth(), yesterDate.getDate()-1);
var yesterDay = yesterDate.getDate();
var yesterMonth = yesterDate.getMonth()+1;
if(yesterMonth<10) yesterMonth = '0'+yesterMonth;
var yesterYear = yesterDate.getFullYear();
var yesterKey = ''+yesterMonth+yesterYear;
}while($.inArray(yesterDay, taskDatesObj[yesterKey]) >= 0);
//add today if present
//get today's paramentes
var currentDate = new Date();
var currentDay = currentDate.getDate();
var currentMonth = currentDate.getMonth()+1;
if(currentMonth<10) currentMonth = '0'+currentMonth;
var currentYear = currentDate.getFullYear();
var currentKey = ''+currentMonth+currentYear;
if($.inArray(currentDay, taskDatesObj[currentKey]) >=0)
taskDatesObj["count"]++;

//save changes
localStorage.setItem(tasksNamesObj[task],JSON.stringify(taskDatesObj));
}

//SOON. Clicking on checkbox to delete tasks and not just add a day to "goalDates"
//Checkboxes
$(document).on('change','.checkbox',function(){
//get task's id
var task = ($(this).parent().next().attr('id')).slice(1);

//get all task Details
tasksNames = localStorage.getItem("tasksNames");
taskDates = localStorage.getItem(tasksNamesObj[task]);
tasksNamesObj = JSON.parse(tasksNames);
taskDatesObj = JSON.parse(taskDates);

//generate key for current month (tasksDates stored in JSON with keys corresponding to mmyyyy)
var date = new Date();
var day = date.getDate();
var month = date.getMonth()+1;
var year = date.getFullYear();
if(month<10) month = '0'+month;
var key = ''+month+year;

//got checked?
if($(this).is(':checked')){
//this key ofr first time?
if(taskDatesObj[key] === undefined){
//add key to taskDates
taskDates = taskDates.slice(0,-1);
taskDates += ',"'+key+'":[]}';
taskDatesObj = JSON.parse(taskDates);
}
//add day to taskDates
taskDatesObj[key].push(day);
//increment "count" (streak)
taskDatesObj["count"]++;
//alter css (add the class which signifies that progress was made on the day)
$('#gc'+task).find(".ui-datepicker-today").addClass("tickDay");
}

//got unchecked?
else {
//remove day from taskDates
taskDatesObj[key].splice(taskDatesObj[key].indexOf(day),1);
//decrement "count" (streak)
taskDatesObj["count"]--;
//alter css (remove the class which signifies that progress was made on the day)
$('#gc'+task).find(".ui-datepicker-today").removeClass("tickDay");
}

//save the changes
localStorage.setItem(tasksNamesObj[task],JSON.stringify(taskDatesObj));
});

//Duedate setter
$(document).on('click','.duedate',function(){
//Get id of the task
var task = $(this).attr('id').slice(2);

//Toggle the duedatepicker of this task
$('#gs'+task).toggle();
//Toggle the streak calenar of this task
$('#gc'+task).toggle();
});

//SOON. Clicking on an li item to not show datepicker for tasks
//li elements, lists
$(document).on('click', '.list', function() {
//Get id of the task
var task = ($(this).attr('id')).slice(1);

//Hide all except this one
$('.datepicker:not(#gc'+task+')').hide();
$('.duedate:not(#gd'+task+')').hide();

//Toggle this one's duedate	
$('#gd'+task).toggle();

//duedatepicker visible?
if($('#gs'+task).is(":visible")){
//Hide duedate picker
$('#gs'+task).hide();
}
else{
//Toggle datepicker
$('#gc'+task).toggle();
}
});
	
//Functions to enable drag and drop property to the "list" element which is a ul list containg all tasks names
//Taken from: http://jqueryui.com/sortable/ and http://api.jqueryui.com/sortable/#event-update
$("#list").sortable({
//SOON. update function fired on sorting to take care of other counts too and not just "present" and "future"
update: function(event, ui) {

//reset tasksNames
var tasksNames = new Array();

//reser "present"/"future" count
var tasksDetailsStr = localStorage.getItem("tasksDetails");
var tasksDetailsStr = localStorage.getItem("tasksDetails");
var tasksDetailsObj = JSON.parse(tasksDetailsStr);
tasksDetailsObj["present"]=0;
tasksDetailsObj["future"]=0;

//are we past the "future" id yet?
var future = 0;

//loop through all li elements execept the "future" tag
$(".list").each(function() {
	
	//if this is not the "future" tag
	if($(this).attr('id')!=="future"){
	//add task's name to the list
	tasksNames.push($(this).text());
	//if this is a "present" task
	if(future == 0){
	//mark it as "present"
	tasksDetailsObj[$(this).text()].active="present";
	//increment "present" count
	tasksDetailsObj["present"]++;
	}
	else{
	//mark it as "future"
	tasksDetailsObj[$(this).text()].active="future";
	//increment "future" count
	tasksDetailsObj["future"]++;
	}
	}
	else
	//else mark "future" tag as passed
	future = 1;
	
	//display "present" count
	document.getElementById("present-count").innerHTML = tasksDetailsObj["present"];
	//display "future" count
	document.getElementById("future-count").innerHTML = tasksDetailsObj["future"];
    });

//save the data
localStorage.setItem("tasksNames",JSON.stringify(tasksNames));
localStorage.setItem("tasksDetails",JSON.stringify(tasksDetailsObj));
},
//Ability to drag only along the y-axis
axis: 'y',
//Do not drag the calendar and the "future" tag. From: http://jqueryui.com/draggable/#handle
cancel: "div.cal",
cancel: "#future"
});
$("#list").disableSelection();
});

//add new tasks
function save(){
//Get data from the form
var task = document.getElementById("task").value;		//Get 'task' from form

//no value? terminate function
if (task=="")
return false;

//clear the form.
var form = document.getElementById("input");
form.reset();

//Storing values into localStorage
//Get localStorage Data
var tasksNamesStr = localStorage.getItem("tasksNames");
var tasksDetailsStr = localStorage.getItem("tasksDetails");
console.log(tasksNamesStr);

//add to tasksNames
var tasksNames = JSON.parse(tasksNamesStr);
tasksNames.unshift(task);
//tasksNames.push(task);	//Toadd task at the end
localStorage.setItem("tasksNames", JSON.stringify(tasksNames));

//add to tasksDetails
var details = '"'+task+'":{"duedate":"","noofdays":"","active":"present"}';//Data Structure of JSON data
tasksDetailsStr = tasksDetailsStr.slice(0,-1);		//Data Structure in which JSON data is stored
tasksDetailsStr += ',' + details + '}';			//Data Structure in which JSON data is stored
//increment "present" count
var tasksDetailsObj = JSON.parse(tasksDetailsStr);
tasksDetailsObj["present"]++;
localStorage.setItem("tasksDetails", JSON.stringify(tasksDetailsObj));

//Initialize task Dates
localStorage.setItem(task,'{"count":0}');
loadData();     //refresh list with the new task present
}

//function to edit the name of a task
function edit(){

//get old name and new name
var task2 = document.getElementById("task2").value;
var task3 = document.getElementById("task3").value;

//load all data
var tasksNamesStr = localStorage.getItem("tasksNames");
var tasksDetailsStr = localStorage.getItem("tasksDetails");
var tasksNamesObj = JSON.parse(tasksNamesStr);
var tasksDetailsObj = JSON.parse(tasksDetailsStr);

//edit in tasksNames. From: http://www.w3schools.com/jsref/jsref_splice.asp and http://www.w3schools.com/jsref/jsref_indexof_array.asp
tasksNamesObj.splice(tasksNamesObj.indexOf(task2),1,task3);

//edit in tasksDetails
tasksDetailsObj[task3] = tasksDetailsObj[task2];
delete tasksDetailsObj[task2];

//edit in taskDates
localStorage.setItem(task3,localStorage.getItem(task2));
localStorage.removeItem(task2);

//saving tasksNames and tasksDetails
localStorage.setItem("tasksNames",JSON.stringify(tasksNamesObj));
localStorage.setItem("tasksDetails",JSON.stringify(tasksDetailsObj));

//reload list
loadData();
}

function del(){

//get task's name
var task2 = document.getElementById("task2").value;

//load all data
var tasksNamesStr = localStorage.getItem("tasksNames");
var tasksDetailsStr = localStorage.getItem("tasksDetails");
var tasksNamesObj = JSON.parse(tasksNamesStr);
var tasksDetailsObj = JSON.parse(tasksDetailsStr);

//remove from tasksNames. From: http://stackoverflow.com/a/5767357/2134555
tasksNamesObj.splice(tasksNamesObj.indexOf(task2),1);

//decrementing "present"/"future" count
tasksDetailsObj[tasksDetailsObj[task2].active]--;

//remove from tasksDetails
delete tasksDetailsObj[task2];

//delete from taskDates
localStorage.removeItem(task2);

//saving tasksNames and tasksDetails
localStorage.setItem("tasksNames",JSON.stringify(tasksNamesObj));
localStorage.setItem("tasksDetails",JSON.stringify(tasksDetailsObj));

//reload list
loadData();
}

//Function to get the name of the task in "task2" box and display details of the particular task
function showAll(){
var task2=document.getElementById("task2").value;
var tasksStr = localStorage.getItem("tasksDetails");
var tasksObj = JSON.parse(tasksStr);
if (tasksObj[task2]!==undefined){
//document.getElementById("duedate").innerHTML=tasksObj[task2].duedate;
//document.getElementById("noofdays").innerHTML=tasksObj[task2].noofdays;
//document.getElementById("active2").innerHTML=tasksObj[task2].active; 
}
//else
//document.getElementById("duedate").innerHTML="No such task found";
}