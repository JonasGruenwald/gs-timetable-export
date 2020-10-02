console.log('-- GS TIMETABLE EXPORT CONTENT SCRIPT RUNNING --')
const listView = document.querySelector('.header-1-args').textContent.includes('Single Week View');
const rangeText = document.querySelector('.header-5-args')
  .innerText
  .replace(/^\s+|\s+$/g, '')
  .trim()
const datePart = rangeText.split('(')[1].split(')')[0]
const startDate = datePart.split('to')[0].trim();

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const gatherData = () => {
  let entries = [];
  const days = Array.from(document.body.querySelectorAll('.spreadsheet'));
  days.forEach((item, idx) => {
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + idx)
    // console.log({targetDate})
    const rows = Array.from(item.querySelectorAll('tr'))
    rows.forEach(row => {
      if (row.classList.contains('columnTitles')) {
        // Don't process header row
        return;
      }
      const columns = Array.from(row.children).map(node => node.textContent.trim());
      const fromHours = columns[3].split(':')[0];
      const fromMinutes = columns[3].split(':')[1];
      const toHours = columns[4].split(':')[0];
      const toMinutes = columns[4].split(':')[1];
      const fromDate = new Date(targetDate.toISOString());
      fromDate.setHours(fromHours, fromMinutes);
      const toDate = new Date(targetDate.toISOString());
      toDate.setHours(toHours, toMinutes);

      entries.push({
        name: columns[0],
        description: toTitleCase(columns[1]),
        type: columns[2],
        rooms: columns[5],
        building: columns[6],
        fromDate,
        toDate,
      })
    })
  })
  return entries;
}

const doRun = () => {
  const entries = gatherData();
  browser.runtime.sendMessage(
    {
      type: 'pass_data',
      entries
    },
  ).then(() => {
    document.querySelector('#bNextWeek').click();
  })
}

const startRun = () => {
  browser.runtime.sendMessage(
    {
      type: 'start_export',
      startDate
    },
  )
    .then(() => {
      const exportingElement = document.createElement('div');
      exportingElement.textContent = 'Export in progress...';
      document.body.appendChild(exportingElement);
      return doRun();
    })
}

if (listView) {
  browser.runtime.sendMessage(
    {
      type: 'check_status',
      startDate
    },
  )
    .then(res => {
      if (res.finished) {
        document.querySelector('body').innerHTML = `
<style>
  body{
    font-size: 50px !important;
    padding: 1em;
  }
  div{
    margin-bottom: 1em !important;
  }
</style>

<div class="heading">💚 EXPORT COMPLETE 💚</div>

<div>Parsed Entries: ${res.events}</div>

<div>Click the link below to download the iCal file to import into your calendar.</div>


        `
        const a = document.createElement('a');
        a.download = 'goldsmiths_timetable.ics';
        const blob = new Blob([res.calendar], { type: 'text/ics' });
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/ics', a.download, a.href].join(':');
        document.body.appendChild(a);
        a.textContent = '💽 Download Calendar File'

      } else if (res.exporting) {
        doRun();
      } else {
        // Not exporting - add button
        const button = document.createElement('button');
        button.textContent = '📆 EXPORT TO ICAL';
        button.addEventListener('click', startRun);
        document.body.appendChild(button);
      }
    })
} else {
  const note = document.createElement('div')
  note.textContent = 'iCal export is available in single week list view.'
  document.body.appendChild(note)
}
