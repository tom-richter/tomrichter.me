import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { evaluate } from 'mathjs'
import type { NextPage } from 'next'
import { useState } from 'react'
import Layout from 'components/Layout'
import { getVariables } from 'utils/equations'

const Page: NextPage = () => {
  const [equation, setEquation] = useState<string>('')
  const [variables, setVariables] = useState<Map<string, string>>(new Map())

  const evaluateEquation = () => {
    try {
      const scope: { [key: string]: number } = {}
      variables.forEach((value, key) => {
        if (/\d+/.test(value)) {
          scope[key] = parseInt(value)
        }
      })
      const res = evaluate(equation, scope)
      if (typeof res === 'number') {
        return res
      }
      return ''
    } catch (e) {
      return ''
    }
  }

  return (
    <Layout>
      <Box>
        <h1>Equation Solver</h1>
        <TextField
          fullWidth
          label="Equation"
          value={equation}
          onChange={(e) => {
            const newEquation = e.target.value.toUpperCase()
            setEquation(newEquation)
            const newVariables = getVariables(newEquation)
            const newVariablesMap = new Map()
            for (const variable of newVariables) {
              if (variables.has(variable)) {
                newVariablesMap.set(variable, variables.get(variable))
              } else {
                newVariablesMap.set(variable, '')
              }
            }
            setVariables(newVariablesMap)
          }}
          multiline
          rows={4}
        />
        {Array.from(variables.entries())
          .sort()
          .map(([key, value]) => (
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              key={key}
              label={key}
              value={value}
              onChange={(e) => {
                const newVariables = new Map(variables)
                newVariables.set(key, e.target.value)
                setVariables(newVariables)
              }}
            />
          ))}
        <p>Solution: {evaluateEquation()}</p>
      </Box>
    </Layout>
  )
}

export default Page
