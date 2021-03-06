# Goldsmiths Timetable Export

(This software is not affiliated with or endorsed by the college)

Web Extension to export Goldsmiths Timetable to a format usable by all common calendar software.

![Image of calendar output](./ouput.png)

## Installation

The extension is built and signed for firefox, you can install it [here](https://github.com/JonasGruenwald/gs-timetable-export/releases/download/latest/goldsmiths_timetable_export-0.0.0-fx.xpi).

If you need it for a different browser, you will have to build from source, but I can't guarantee it will work as I've only used it on Firefox.

## Usage

Navigate to any timetable and display it using 'Single Week View' (not the default 'Grid View').

![Image of calendar output](./guide-1.png)

When the extension is running, at the bottom of the single week view, an export button should appear.

![Image of calendar output](./guide-2.png)

After clicking the export button, the browser will load all available calendar weeks and then display a button to 
download the generated iCal (.ics) file.

iCal files can be imported into pretty much any calendar software or service (Google Calendar, Outlook etc.).

Keep in mind the export logic is pretty rough and may break at any point.

## Setup

	$ npm install

## Development

    npm run dev chrome
    npm run dev firefox
    npm run dev opera
    npm run dev edge

## Build

    npm run build chrome
    npm run build firefox
    npm run build opera
    npm run build edge

## Docs
This extension is built with [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox).
