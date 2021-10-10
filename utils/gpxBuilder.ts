import { GpxInput } from 'pages/geocaching/gpx-builder'

function getRandomGcCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let gcCode = 'GCX'
  for (let i = 0; i < 4; i++) {
    gcCode += chars[Math.floor(Math.random() * 26)]
  }
  return gcCode
}

function base10To36(num: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let base36Num = ''
  if (!num) {
    return '0'
  }
  while (num) {
    base36Num = chars[num % 36] + base36Num
    num = Math.floor(num / 36)
  }
  return base36Num
}

function wpNumber(num: number) {
  if (num < 10) {
    return '0' + num
  } else if (num < 100) {
    return String(num)
  } else {
    return base10To36(num)
  }
}

function wpComment(line: string) {
  line += ' '
  let numCounter = 6
  let digitMode = false
  let i = 0
  while (numCounter && i < line.length) {
    if (line[i] >= '0' && line[i] <= '9' && !digitMode) {
      digitMode = true
    } else if (!(line[i] >= '0' && line[i] <= '9') && digitMode) {
      numCounter--
      digitMode = false
    }
    i++
  }
  return line.slice(i - 1).replace(/^\s+|\s+$/g, '')
}

function getOrientation(
  coord: string,
  latDefault: string,
  longDefault: string
) {
  let lat = latDefault
  let long = longDefault
  let latChecked = false
  let longChecked = false
  let i = 0
  while (!latChecked && i < coord.length) {
    switch (coord[i]) {
      case (coord[i].match(/[nN]/) || {}).input:
        lat = 'north'
        latChecked = true
        break
      case (coord[i].match(/[sS]/) || {}).input:
        lat = 'south'
        latChecked = true
        break
      case (coord[i].match(/\w/) || {}).input:
        latChecked = true
        break
      default:
        break
    }
    i++
  }

  let numCounter = 3
  let digitMode = false
  i = -1
  while (numCounter && i < coord.length) {
    i++
    if (coord[i] >= '0' && coord[i] <= '9' && !digitMode) {
      digitMode = true
    } else if (!(coord[i] >= '0' && coord[i] <= '9') && digitMode) {
      numCounter--
      digitMode = false
    }
  }

  while (!longChecked && i < coord.length) {
    switch (coord[i]) {
      case (coord[i].match(/[eE]/) || {}).input:
        long = 'east'
        longChecked = true
        break
      case (coord[i].match(/[wW]/) || {}).input:
        long = 'west'
        longChecked = true
        break
      case (coord[i].match(/\w/) || {}).input:
        longChecked = true
        break
      default:
        break
    }
    i++
  }

  return [lat === 'north' ? 1 : -1, long === 'east' ? 1 : -1]
}

function urlify(fileName: string) {
  // remove leading and trailing spaces, replace spaces with underscores, remove all non-alphanumeric chars
  return fileName
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s+/g, '_')
    .replace(/[\W]+/g, '')
}

export function buildGpx(gpxInput: GpxInput): string {
  let stage = 1
  let stage1CoordsLat = 0
  let stage1CoordsLong = 0
  let gcCode = ''
  let gpxFile: string
  let gpxHeader = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <metadata>
        <name>${urlify(gpxInput.fileName)}</name>
        <desc></desc>
        <author>
            <name></name>
        </author>
    </metadata>
`
  switch (gpxInput.applicationName) {
    case 'l4c':
      gcCode = getRandomGcCode()
      gpxFile = ''
      break
    default:
      gpxFile = gpxHeader
      break
  }

  let lines = gpxInput.coordinates.replace(/^\s+|\s+$/g, '').split('\n')

  for (const line of lines) {
    let orientation = getOrientation(
      line,
      gpxInput.latitudeOrientation,
      gpxInput.longitudeOrientation
    )
    let waypoint = ''
    let coordNums = line.match(/\d+/g)?.map(Number) ?? []
    let coordsLat =
      (coordNums[0] + (coordNums[1] + coordNums[2] / 1000) / 60) *
      orientation[0]
    let coordsLong =
      (coordNums[3] + (coordNums[4] + coordNums[5] / 1000) / 60) *
      orientation[1]

    if (gpxInput.applicationName === 'l4c') {
      waypoint = `    <wpt lat="${coordsLat.toFixed(
        7
      )}" lon="${coordsLong.toFixed(7)}">
        <name>${wpNumber(stage)}${gcCode.slice(2)}</name>
        <desc>Waypoint ${stage}</desc>
        <sym>Reference Point</sym>
        <type>Waypoint|Reference Point</type>
        <cmt>${wpComment(line)}</cmt>
    </wpt>
`
      if (stage === 1) {
        stage1CoordsLat = coordsLat
        stage1CoordsLong = coordsLong
      }
    } else {
      waypoint = `    <wpt lat="${coordsLat.toFixed(
        7
      )}" lon="${coordsLong.toFixed(7)}">
        <name>Waypoint ${stage}</name>
        <cmt>${wpComment(line)}</cmt>
    </wpt>
`
    }

    gpxFile += waypoint
    stage++
  }

  if (gpxInput.applicationName === 'l4c') {
    gpxFile =
      gpxHeader +
      `    <wpt lat="${stage1CoordsLat.toFixed(
        7
      )}" lon="${stage1CoordsLong.toFixed(7)}">
        <name>${gcCode}</name>
        <sym>Geocache</sym>
        <type></type>
        <time></time>
        <groundspeak:cache id="1" available="True" archived="False" 
          xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">
            <groundspeak:name>${urlify(gpxInput.fileName)}</groundspeak:name>
            <groundspeak:placed_by></groundspeak:placed_by>
            <groundspeak:type></groundspeak:type>
            <groundspeak:container></groundspeak:container>
            <groundspeak:difficulty></groundspeak:difficulty>
            <groundspeak:terrain></groundspeak:terrain>
            <groundspeak:short_description html="True">
            </groundspeak:short_description>
            <groundspeak:long_description html="True">
            </groundspeak:short_description>
        </groundspeak:cache>
    </wpt>
` +
      gpxFile
  }

  gpxFile += '</gpx>'

  return gpxFile
}
