import { beforeEach, describe, expect, test } from "@jest/globals"

import { getEnvVariable } from "./env.mjs"

const VARIABLE_NAME = "EXAMPLE"
const VARIABLE_VALUE = "example"

describe("Test env module", () => {
  beforeEach(() => {
    delete process.env[VARIABLE_NAME]
  })

  test("getEnvVariable returns the value of an environment variable", () => {
    process.env[VARIABLE_NAME] = VARIABLE_VALUE
    const variable = getEnvVariable(VARIABLE_NAME)
    expect(variable).toBe(VARIABLE_VALUE)
  }),
    test("getEnvVariable throws an error if the environment variable is not set", () => {
      expect(() => getEnvVariable(VARIABLE_NAME)).toThrow(
        `Missing environment variable ${VARIABLE_NAME}`,
      )
    })
})
