var Calendar = tui.Calendar;
var cal, resizeThrottled;
var useDetailPopup = true;
var datePicker, selectedCalendar;

var currentDate = new Date();
var dateIndex = currentDate.getDay()

var calendar = new Calendar('#calendar', {
    defaultView: 'week',
    taskView: false,
    useDetailPopup: useDetailPopup,
    week: {
        startDayOfWeek: dateIndex, // monday
    },
    isReadOnly: true,
    
    template: {
        monthDayname: function(dayname) {
          return '<span class="calendar-week-dayname-name">' + dayname.label + '</span>';
        }
      }
  });

let events = [];

scheduleAPI = 'https://jwalter-teamschedule.builtwithdark.com/schedule';
fetch(scheduleAPI).then(function (response) {
    // The API call was successful!
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then(function (data) {
    document.getElementById('loader').remove();
    data.forEach(streamer => {
        //console.log(streamer);

        schedule = streamer.segments;
        if(schedule){
        displayName = streamer.display_name;
        loginName = streamer.login;
        console.log(displayName);
        description = streamer.description;
        profileImage = '<img class="profile-image" src="' + streamer.profile_image_url + '">';
        var randomColour = '#' + Math.floor(Math.random()*16777215).toString(16);
        //console.log(schedule);
        if(schedule){
            for (let i = 0; i < schedule.length; i++) {
                const streamEvent = schedule[i];
                title = streamEvent.title;
                startTime = streamEvent.start_time;
                endTime = streamEvent.end_time;
                category = streamEvent.category;
                if(category){categoryName = category.name};
                let event = {};
                event['title'] = title + ' - ' + displayName;
                event['body'] = profileImage + '<br>' +  description + '<br><a class="button" target="_blank" href="https://twitch.tv/'+ loginName + '>Watch stream</a>';
                event['category'] = 'time';
                event['start'] = startTime;
                event['end'] = endTime;
                event['isReadOnly'] = true;
                event['bgColor'] = randomColour;
                event['color'] = 'white';
                console.log(randomColour);
                events.push(event);

            }
        }
    }});

    //console.log(events);
    calendar.createSchedules(events);

}).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
});
