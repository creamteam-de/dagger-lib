import { describe, expect, test } from "@jest/globals"
import { connect, Client } from "@dagger.io/dagger"

import { withSdkman } from "./install.mjs"

describe("test sdk installation", () => {
  test("sdk directory exists after installation", async () => {
    connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withSdkman(client, container)).withExec(
        "ls /root/.sdkman/sdkman".split(" "),
      )
      await container.stdout()
    })
  })
})
