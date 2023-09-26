import { describe, expect, test } from "@jest/globals"
import { Client } from "@dagger.io/dagger"

import { Pipeline, PipelineGroup } from "./index.mjs"

describe("Test pipeline", () => {
  test("The pipeline can be instantiated", () => {
    const client = new Client()
    const pipeline = new Pipeline({ client })
    expect(pipeline).toBeDefined()
  })
  test("The pipeline can be extended with events", () => {
    const client = new Client()
    const pipeline = new Pipeline({ client }).on("test", async (args) => {
      return args
    })
    expect(pipeline.getEventNames()).toContain("test")
  })
  test("The pipeline can be chained with events", () => {
    const client = new Client()
    const pipeline = new Pipeline({ client }).on("test", async (args) => {
      return args
    })
    expect(pipeline.getEventNames()).toContain("test")
    const pipeline2 = pipeline.on("test2", async (args) => {
      return args
    })
    expect(pipeline2.getEventNames()).toContain("test2")
  })
  test("The pipeline can be executed", async () => {
    const client = new Client()
    let pipeline = new Pipeline({ client }).on("test", async (args) => {
      return args
    })
    await pipeline.callAll()
  })
  test("The pipeline can be executed with a specific event", async () => {
    const client = new Client()
    const pipeline = new Pipeline({ client }).on("test", async (args) => {
      return args
    })
    await pipeline.call("test")

    try {
      await pipeline.call("example")
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toBe("Event example not found")
    }
  })
  test("The pipeline can expose a CLI", async () => {
    const client = new Client()
    const pipeline = new Pipeline({ client }).on("test", async (args) => {
      return args
    })
    await pipeline.exposeCli()
  })
})

describe("Test pipeline groups", () => {
  test("The pipeline group can be instantiated", () => {
    const pipeline = new PipelineGroup()
    expect(pipeline).toBeDefined()
  })
  test("The pipeline group can be extended with pipelines", () => {
    new PipelineGroup().withPipeline(new Pipeline({ client: new Client() }))
  })
  test("The pipeline group can expose a CLI", async () => {
    const pipelineGroup = new PipelineGroup().withPipeline(
      new Pipeline({ client: new Client() }).on("test", async (args) => {
        return args
      }),
    )
    await pipelineGroup.exposeCli()
  })
})
