export function getEnvVariable(variableName: string): string {
  const variable = process.env[variableName]
  if (variable == undefined) {
    throw new Error(`Missing environment variable ${variableName}`)
  }
  return variable
}
