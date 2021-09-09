var Calendar = tui.Calendar;
var cal, resizeThrottled;
var useDetailPopup = true;
var datePicker, selectedCalendar;

var calendar = new Calendar('#calendar', {
    defaultView: 'week',
    taskView: false,
    useDetailPopup: useDetailPopup,
    isReadOnly: true,
    startDayOfWeek: 1, // monday
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

        displayName = streamer.display_name;
        loginName = streamer.login;
        console.log(displayName);
        description = streamer.description;
        profileImage = '<img class="profile-image" src="' + streamer.profile_image_url + '">';
        schedule = streamer.segments;
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
                //event['calendarId'] = 'Prashant Yadav';
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
    });

//     $.each(data, function(i, models) {
//         model = models.model;
//        size = models.size;
//        console.log(models.model);
//        console.log(models.size);
//        carModel.append("<option value="+size+">" + model + "</option>");
//    });
    console.log(events);
    calendar.createSchedules(events);
    // calendar.createSchedules([
    //     {
    //         calendarId: '1',
    //         title: '⚡️ THIS IS WEB DEV ⚡️ - whitep4nth3r',
    //         body: '✨⚡️ I help developers build stuff, learn things, and love what they do • DevRel @contentful • @Twitch partner • @Microsoft MVP • unbreak.tech founder • she/her ⚡️✨<br><a class="button" target="_blank" href="https://twitch.tv/whitep4nth3r">Watch stream</a>',
    //         category: 'time',
    //         start: '2021-09-10T18:00:00Z',
    //         end: '2021-09-10T21:00:00Z',
    //         isReadOnly: true,
    //     },
    // ]);
    //console.log(data);
}).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
});