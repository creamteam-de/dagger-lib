import type { JestConfigWithTsJest } from "ts-jest"
import { defaults } from "jest-config"

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, "mts", "cts"],
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  resolver: "./e2e/mjsResolver.cjs",
  testMatch: ["**/?(*.)+(spec|test).mts"],
}

export default jestConfig
