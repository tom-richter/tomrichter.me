import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
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
import Typography from '@mui/material/Typography'
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
          The GPX Builder converts a list of coordinates into a GPX file. If you
          have questions about how to use it, you can watch the{' '}
          <a href="https://youtu.be/HRAC2_WK5r8" target="blank">
            <Typography
              component="span"
              sx={{
                textDecoration: 'underline',
                color: 'blue',
              }}
            >
              tutorial video (German only)
            </Typography>
          </a>{' '}
          or send me an email.
        </p>
        <h2>Remarks on the coordinate input:</h2>
        <ul>
          <li>Exactly one coordinate per line</li>
          <li>
            Coordinates in decimal minute format (e.g. N 50°12.345 E 12°34.567)
          </li>
          <li>North/south coordinate before east/west coordinate</li>
          <li>
            Only if there is no N, S, E or W in front of a coordinate, the
            default orientation selected below is assumed
          </li>
          <li>
            Degrees, minutes and decimals of minutes are separated by at least
            one character which is not a digit
          </li>
          <li>
            Everything after the coordinate in a line is used as a comment for
            the waypoint
          </li>
        </ul>
      </Box>
      <Box>
        <TextField
          fullWidth
          label="Coordinates"
          variant="outlined"
          placeholder="N 50°12.345 E 12°34.567 Hint: under stone"
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
          Default orientation if there is no N, S, E or W (case-insensitive) in
          front of a coordinate:
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
      <h2>FAQ</h2>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            Why is the standard Geocaching App not available?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            It is (still) not possible to import custom GPX files into the
            Geocaching App.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Layout>
  )
}

export default Page
