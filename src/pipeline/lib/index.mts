import { Client } from "@dagger.io/dagger"
import { program, Command, Option } from "commander"

const STEP_ALL = "all"

export class Pipeline {
  events: Map<string, (...args: any[]) => Promise<any>>

  constructor() {
    this.events = new Map<string, (...args: any[]) => Promise<any>>()
  }

  on(
    eventName: string,
    eventCallback: (...args: any[]) => Promise<any>,
  ): Pipeline {
    this.events.set(eventName, eventCallback)
    return this
  }

  async callAll(...args: any[]) {
    for (const [_, eventCallback] of this.events) {
      await eventCallback(...args)
    }
  }

  async call(eventName: string, ...args: any[]) {
    const eventCallback = this.events.get(eventName)
    if (eventCallback != undefined) {
      await eventCallback(...args)
    }
  }

  async exposeCli() {
    const choices = Array.from(this.events.keys())
    choices.push(STEP_ALL)

    const option = program.addOption(
      new Option(
        "--step <string>",
        "step of the pipeline to be executed, defaults to 'all'",
      )
        .choices(choices)
        .default(STEP_ALL),
    )
    program.parse()
    const options = program.opts()

    if (options.step == STEP_ALL) {
      await this.callAll()
      return
    }

    const step = this.events.get(options.step)
    if (step != undefined) {
      await step()
    }
  }
}
