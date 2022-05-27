import { getVariables } from './equations'

test('getVariables', () => {
  expect(getVariables('A + 3 * B')).toEqual(new Set(['A', 'B']))
  expect(getVariables('4 - D+A')).toEqual(new Set(['A', 'D']))
  expect(getVariables('(A + B) / C')).toEqual(new Set(['A', 'B', 'C']))
  expect(getVariables('12 ^ 3 - 8')).toEqual(new Set([]))
})
