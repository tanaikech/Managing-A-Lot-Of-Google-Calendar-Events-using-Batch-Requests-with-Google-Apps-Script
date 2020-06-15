# Managing A Lot Of Google Calendar Events using Batch Requests with Google Apps Script

<a name="top"></a>

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>

## Overview

**These are the sample scripts for managing a lot of Google Calendar Events using the batch requests with Google Apps Script.**

<a name="description"></a>

## Description

When we want to manage the events of Google Calendar, we have 2 ways. One is the use of [Calendar service](https://developers.google.com/apps-script/reference/calendar). Another is the use of [Calendar API](https://developers.google.com/calendar). In the case of them, when we want to manage a lot of calendar events, unfortunately, both ways have no batch requests. Namely, for example, when a lot of events are deleted, [`deleteEvent()`](<https://developers.google.com/apps-script/reference/calendar/calendar-event#deleteEvent()>) and [Events: delete](https://developers.google.com/calendar/v3/reference/events/delete) are required to be used in the loop. In this case, the process cost will be high. On the other hand, Calendar API can use [the batch requests](https://developers.google.com/calendar/batch). But in this case, in order to use this batch requests with Google Apps Script, it is required to create the request body of `multipart/mixed` by each user. Because there are no methods for automatically requests the batch requests. From this situation, here, I would like to introduce the simple sample scripts for creating, updating and deleting the events of Google Calendar using the batch requests with Google Apps Script.

<a name="usage"></a>

## Usage

The sample scripts use [BatchRequest](https://github.com/tanaikech/BatchRequest) of the Google Apps Script library.

### 1. Install BatchRequest

You can see how to install BatchRequest at [here](https://github.com/tanaikech/BatchRequest#how-to-install).

### 2. Sample script

#### Creating events

In this sample script, 30 events are created from 20200601 to 20200630.

```javascript
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
```

#### Updating events

In this sample script, the title and description of all events from 20200601 to 20200630 are updated.

```javascript
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
```

> IMPORTANT: In this script, [Events: update](https://developers.google.com/calendar/v3/reference/events/update) is used. When I tested this using [Events: patch](https://developers.google.com/calendar/v3/reference/events/patch), I confirmed the unstable working. So I used Events: update. But this might be resolved in the future update.

#### Deleting events

In this sample script, all events from 20200601 to 20200630 are deleted. **So when you use this, please be careful this.**

```javascript
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
```

## IMPORTANT

- At the batch requests, 100 API requests can be run with the asynchronous process as one API call.

  - When the library of [BatchRequest](https://github.com/tanaikech/BatchRequest) is used, all requests can be processed in the library, even when the number of your requests is more than 100.

- When you manage a lot of Calendar Events, please be careful of Quotas for Google Services. [Ref](https://developers.google.com/apps-script/guides/services/quotas)

## References:

- [Events: insert](https://developers.google.com/calendar/v3/reference/events/insert)
- [Events: update](https://developers.google.com/calendar/v3/reference/events/update)
- [Events: delete](https://developers.google.com/calendar/v3/reference/events/delete)

---

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Tanaike](https://tanaikech.github.io/about/)

If you have any questions or comments, feel free to contact me.

<a name="updatehistory"></a>

# Update History

- v1.0.0 (June 12, 2020)

  1. Initial release.

[TOP](#top)
