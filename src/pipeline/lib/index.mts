import { Client } from "@dagger.io/dagger"
import { program, Option } from "commander"

export interface PipelineArgs {
  client: Client
  data?: { [key: string]: any }
}

const STEP_ALL = "all"

export class Pipeline {
  events: Map<string, (args: PipelineArgs) => Promise<PipelineArgs>>
  private args: PipelineArgs

  constructor(args: PipelineArgs) {
    this.events = new Map<
      string,
      (args: PipelineArgs) => Promise<PipelineArgs>
    >()
    this.args = args
  }

  on(
    eventName: string,
    eventCallback: (args: PipelineArgs) => Promise<PipelineArgs>,
  ): Pipeline {
    this.events.set(eventName, eventCallback)
    return this
  }

  async callAll() {
    for (const [_, eventCallback] of this.events) {
      this.args = await eventCallback(this.args)
    }
  }

  async call(eventName: string) {
    const eventCallback = this.events.get(eventName)
    if (eventCallback != undefined) {
      this.args = await eventCallback(this.args)
    }
  }

  async exposeCli() {
    const choices = Array.from(this.events.keys())
    choices.push(STEP_ALL)

    program.addOption(
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

    if (this.events.has(options.step)) {
      await this.call(options.step)
    }
  }
}
