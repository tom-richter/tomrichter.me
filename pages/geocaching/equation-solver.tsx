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

  const evaluateEquation = (): string[] => {
    const scope: { [key: string]: number } = {}
    variables.forEach((value, key) => {
      if (/\d+/.test(value)) {
        scope[key] = parseInt(value)
      }
    })
    if (!equation.trim().length) {
      return []
    }
    const equationRow = equation.trim().split('\n')
    const solutions: string[] = []
    for (const row of equationRow) {
      try {
        const solution = evaluate(row, scope)
        if (typeof solution === 'number') {
          solutions.push(solution.toString())
        } else {
          solutions.push('?')
        }
      } catch (e) {
        solutions.push('?')
      }
    }
    return solutions
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
            const newEquation = e.target.value
              .toUpperCase()
              .replace('\u2013', '-') // replace en dash
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
        <h2>Solution:</h2>
        {evaluateEquation().map((res, index) => (
          <p key={index}>
            {equation.trim().split('\n')[index]} = <b>{res}</b>
          </p>
        ))}
      </Box>
    </Layout>
  )
}

export default Page
