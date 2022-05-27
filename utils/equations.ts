export const getVariables = (equation: string): Set<string> => {
  const variables = new Set<string>()
  for (const char of equation) {
    if (/[A-Z]/.test(char)) {
      variables.add(char)
    }
  }
  return variables
}
