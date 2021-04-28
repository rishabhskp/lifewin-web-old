//From: http://www.scriptsplash.com/2012/06/calendar-using-javascript-with-css.html
// Function to display a Calendar based on javascript. 
function calendar() {

  // Get the current date parameters.
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  
  // Array of month names
  var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
  // Array of number of days in each month
  var monthDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
  // Short notation of days
  var weekDay = new Array('Su','Mo','Tu','We','Th','Fr','Sa');
  // Taking care of Leap Years
  if ( (year%100!=0) && (year%4==0) || (year%400==0)) 
  monthDays[1] = 29;  
  // Days in this month
  var days_in_this_month = monthDays[month];

  // Create the basic Calendar structure.
  var calendar_html = '<div id="mini_here" style="width:200px">';
  calendar_html += '<div class="dhx_cal_container dhx_mini_calendar" date="2010-03-01 00:00"><div class="dhx_year_month">';
  calendar_html += '' + months[month] + ' ' + year;
  calendar_html += '<div class="dhx_cal_prev_button" style="left: 1px; top: 2px; position: absolute;">&nbsp;</div>';
  calendar_html += '<div class="dhx_cal_next_button" style="left: auto; right: 1px; top: 2px; position: absolute;">&nbsp;</div>';
  calendar_html += '<div class="dhx_year_week" style="height: 19px;">';
  var first_week_day = new Date(year, month, 1).getDay();
  for(week_day= 0; week_day < 6; week_day++) {
    calendar_html += '<div class="dhx_scale_bar" style="width: 25px; height: 18px; left: 0px; top: 0px;">' + weekDay[week_day] + '</div>';
  }
  calendar_html += '<div class="dhx_scale_bar dhx_scale_bar_last" style="width: 26px; height: 18px; left: 158px; top: 0px;">'+weekDay[week_day]+'</div></div>';
  calendar_html += '<div class="dhx_year_body">';
/* Comtinue again from here */  
  
 
 
 
  calendar_html +=

  // Fill the first week of the month with the appropriate number of blanks.
  for(week_day = 0; week_day < first_week_day; week_day++) {
    calendar_html += '<td> </td>';
  }
  week_day = first_week_day;
  for(day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
    week_day %= 7;
    if(week_day == 0)
      calendar_html += '</tr><tr>';
    // Do something different for the current day.
    if(day == day_counter) {
      calendar_html += '<td class="currentDay">' + day_counter + '</td>';
    } else {
      calendar_html += '<td class="monthDay"> ' + day_counter + ' </td>';
 }
    week_day++;
  }
  calendar_html += '</tr>';
  calendar_html += '</table>';
  return calendar_html;
}