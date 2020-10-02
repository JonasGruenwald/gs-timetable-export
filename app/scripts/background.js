const ical = require('ical-generator');

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})


let exporting = false;
let startDate = null;
let entries = [];

browser.runtime.onMessage.addListener(
  (data, sender) => {
    if (data.type === 'pass_data') {
      entries.push(...data.entries)
      console.log({entries})
    } else if (data.type === 'start_export') {
      exporting = true;
      startDate = data.startDate;
      browser.browserAction.setBadgeText({
        text: '...'
      })
    } else if (data.type === 'check_status') {
      if (data.startDate === startDate) {
        console.log('Roundtrip complete ', entries)

        const cal = ical({name: 'Goldsmiths Timetable'});
        const events = entries.length;
        const calEvents = entries.map(item => ({
          start: item.fromDate,
          end: item.toDate,
          summary: item.description,
          description: `${item.name}\n${item.type}\n${item.description}`,
          location: `${item.building} ${item.rooms}`
        }))
        cal.events(calEvents)

        startDate = null;
        exporting = false;
        entries = [];

        return Promise.resolve({finished: true, calendar: cal.toString(), events})
      } else {
        return Promise.resolve({exporting})
      }
    }
  }
);

console.log(`Event Page for Browser Action`)
