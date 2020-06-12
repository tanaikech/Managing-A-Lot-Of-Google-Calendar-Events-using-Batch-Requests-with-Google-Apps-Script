function createEvents() {
  const calendarId = "###"; // Please set the Calendar ID.
  const numberOfEvents = 30;
  let requests = [];
  for (let i = 0; i < numberOfEvents; i++) {
    requests.push({
      method: "POST",
      endpoint: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      requestBody: {
        start: {
          dateTime: new Date(2020, 5, i + 1, 12).toISOString(),
          timeZone: Session.getScriptTimeZone(),
        },
        end: {
          dateTime: new Date(2020, 5, i + 1, 13).toISOString(),
          timeZone: Session.getScriptTimeZone(),
        },
        summary: `sample event ${i + 1}`,
        description: `sample description ${i + 1}`,
      },
    });
  }
  const result = BatchRequest.EDo({
    batchPath: "batch/calendar/v3",
    requests: requests,
  });
  console.log(result);
}


function updateEvents() {
  const calendarId = "###"; // Please set the Calendar ID.
  const start = new Date(2020, 5, 1);
  const end = new Date(2020, 5, 30);
  const requests = CalendarApp.getCalendarById(calendarId)
    .getEvents(start, end)
    .map((e, i) => ({
      method: "PUT",
      endpoint: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${e
        .getId()
        .replace("@google.com", "")}`,
      requestBody: {
        start: { dateTime: e.getStartTime().toISOString() },
        end: { dateTime: e.getEndTime().toISOString() },
        description: `sample description ${i}`,
        summary: `sample event ${i}`,
      },
    }));
  const result = BatchRequest.EDo({
    batchPath: "batch/calendar/v3",
    requests: requests,
  });
  console.log(result);
}


function deleteEvents() {
  const calendarId = "###"; // Please set the Calendar ID.
  const start = new Date(2020, 5, 1);
  const end = new Date(2020, 5, 30);
  const requests = CalendarApp.getCalendarById(calendarId)
    .getEvents(start, end)
    .map((e, i) => ({
      method: "DELETE",
      endpoint: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${e
        .getId()
        .replace("@google.com", "")}`,
    }));
  const result = BatchRequest.EDo({
    useFetchAll: true,
    batchPath: "batch/calendar/v3",
    requests: requests,
  });
}
