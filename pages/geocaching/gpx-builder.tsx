import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import type { NextPage } from 'next'
import { useState } from 'react'
import Layout from 'components/Layout'
import { buildGpx } from 'utils/gpxBuilder'

type LatitudeOrientation = 'north' | 'south'
type LongitudeOrientation = 'west' | 'east'
type ApplicationName = 'l4c' | 'other'

export interface GpxInput {
  coordinates: string
  latitudeOrientation: LatitudeOrientation
  longitudeOrientation: LongitudeOrientation
  fileName: string
  applicationName: ApplicationName
}

const Page: NextPage = () => {
  const [gpxInput, setGpxInput] = useState<GpxInput>({
    coordinates: '',
    latitudeOrientation: 'north',
    longitudeOrientation: 'east',
    fileName: 'route',
    applicationName: 'other',
  })
  const createGpxFile = () => {
    let file = new Blob([buildGpx(gpxInput)], { type: '.gpx' })
    let a = document.createElement('a'),
      url = URL.createObjectURL(file)
    a.href = url
    a.download = gpxInput.fileName + '.gpx'
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
  return (
    <Layout>
      <Box>
        <h1>GPX Builder</h1>
        <p>
          Der GPX-Builder wandelt eine Liste von Koordinaten in eine GPX-Datei
          um. Bei Fragen zur Benutzung kannst du das{' '}
          <a href="https://youtu.be/HRAC2_WK5r8" target="blank">
            <Typography
              component="span"
              sx={{
                textDecoration: 'underline',
                color: 'blue',
              }}
            >
              Erklärungsvideo
            </Typography>
          </a>{' '}
          anschauen, oder mir eine E-Mail an schreiben.
        </p>
        <h2>Hinweise zur Eingabe:</h2>
        <ul>
          <li>Genau eine Koordinate pro Zeile</li>
          <li>
            Koordinaten im Dezimalminuten-Format (z.B. N 50°12.345 E 12°34.567)
          </li>
          <li>Nord-/Südkoordinate vor Ost-/Westkoordinate</li>
          <li>
            Nur falls kein N, S, E oder W vor einer Koordinate steht, wird die
            unten ausgewählte Standard-Orientierung angenommen
          </li>
          <li>
            Grad, Minuten und Dezimalstellen der Minuten werden durch mindestens
            ein Zeichen getrennt, welches keine Zahl ist
          </li>
          <li>
            Alles, was nach der Koordinate in einer Zeile steht, wird als
            Kommentar für den Wegpunkt gespeichert
          </li>
        </ul>
      </Box>
      <Box>
        <TextField
          fullWidth
          label="Coordinates"
          variant="outlined"
          placeholder="e.g. N 50°12.345 E 12°34.567 Hint: stone"
          value={gpxInput.coordinates}
          onChange={(e) =>
            setGpxInput({
              ...gpxInput,
              coordinates: e.target.value,
            })
          }
          multiline
          rows={4}
        />
        <p>
          Standard-Orientierung, falls kein N, S, E oder W
          (Groß-/Kleinschreibung egal) vor einer Koordinate steht:
        </p>
        <FormControl component="fieldset">
          <RadioGroup
            value={gpxInput.latitudeOrientation}
            onChange={(e) =>
              setGpxInput({
                ...gpxInput,
                latitudeOrientation: e.target.value as LatitudeOrientation,
              })
            }
          >
            <FormControlLabel value="north" control={<Radio />} label="North" />
            <FormControlLabel value="south" control={<Radio />} label="South" />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset">
          <RadioGroup
            value={gpxInput.longitudeOrientation}
            onChange={(e) =>
              setGpxInput({
                ...gpxInput,
                longitudeOrientation: e.target.value as LongitudeOrientation,
              })
            }
          >
            <FormControlLabel value="west" control={<Radio />} label="West" />
            <FormControlLabel value="east" control={<Radio />} label="East" />
          </RadioGroup>
        </FormControl>
        <TextField
          fullWidth
          label="File Name"
          variant="outlined"
          value={gpxInput.fileName}
          onChange={(e) =>
            setGpxInput({
              ...gpxInput,
              fileName: e.target.value,
            })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="application-select-label">Application</InputLabel>
          <Select
            labelId="application-select-label"
            id="application-select"
            value={gpxInput.applicationName}
            label="Application"
            onChange={(e) =>
              setGpxInput({
                ...gpxInput,
                applicationName: e.target.value as ApplicationName,
              })
            }
          >
            <MenuItem value="l4c">Looking4Cache App</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={createGpxFile}>
          Create GPX-File
        </Button>
      </Box>
    </Layout>
  )
}

export default Page
