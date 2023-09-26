import { describe, expect, test } from "@jest/globals"
import { connect, Client } from "@dagger.io/dagger"

import { withSdkman, SDKMAN_PATH, withJava, withMaven } from "./install.mjs"

describe("Test sdk installation", () => {
  test("The sdk directory exists after installation", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withSdkman(client, container)).withExec(
        `ls /${SDKMAN_PATH}`.split(" "),
      )
      await container.stdout()
    })
  })
  test("The sdk installation works with cache", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = await withSdkman(client, container, true)

      await container.stdout()
    })
  })
  test("The sdkman script can be sourced", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withSdkman(client, container)).withExec([
        "/bin/bash",
        "-c",
        `source ${SDKMAN_PATH}/sdkman/bin/sdkman-init.sh`,
      ])
      await container.stdout()
    })
  })
  test("The sdk command is available after sourcing sdkman script", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withSdkman(client, container)).withExec([
        "/bin/bash",
        "-c",
        `source ${SDKMAN_PATH}/sdkman/bin/sdkman-init.sh && sdk version`,
      ])
      await container.stdout()
    })
  })
})

describe("Test Java installation", () => {
  test("Java candidate 11.0.20-zulu is installed", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withJava(client, container, "11.0.20-zulu")).withExec(
        "java --version".split(" "),
      )

      const output = await container.stdout()
      expect(output).toContain(
        "OpenJDK Runtime Environment Zulu11.66+15-CA (build 11.0.20+8-LTS)",
      )
    })
  })
  test("Java candidate 11.0.20-zulu is installed with cache", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (
        await withJava(client, container, "11.0.20-zulu", true)
      ).withExec("java --version".split(" "))

      const output = await container.stdout()
      expect(output).toContain(
        "OpenJDK Runtime Environment Zulu11.66+15-CA (build 11.0.20+8-LTS)",
      )
    })
  })
  test("The env variable PATH contains the binaries for Java", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withJava(client, container, "11.0.20-zulu")).withExec(
        "printenv".split(" "),
      )

      const output = await container.stdout()
      expect(output).toContain(
        `${SDKMAN_PATH}/sdkman/candidates/java/current/bin`,
      )
    })
  })
  test("The env variable JAVA_HOME is set", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = (await withJava(client, container, "11.0.20-zulu")).withExec(
        "printenv".split(" "),
      )

      const output = await container.stdout()
      expect(output).toContain(
        `JAVA_HOME=${SDKMAN_PATH}/sdkman/candidates/java/current`,
      )
    })
  })
})

describe("Test Maven installation", () => {
  test("Maven candidate 3.6.3 is installed", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = await withJava(client, container, "11.0.20-zulu")
      container = await withMaven(client, container, "3.6.3")
      container = container.withExec("mvn --version".split(" "))

      const output = await container.stdout()
      expect(output).toContain("Apache Maven 3.6.3")
    })
  })
  test("Maven candidate 3.6.3 is installed with cache", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = await withJava(client, container, "11.0.20-zulu")
      container = await withMaven(client, container, "3.6.3")
      container = container.withExec("mvn --version".split(" "))

      const output = await container.stdout()
      expect(output).toContain("Apache Maven 3.6.3")
    })
  })
  test("The env variable PATH contains the binaries for Maven", () => {
    return connect(async (client: Client) => {
      let container = client.container().from("ubuntu:20.04")
      container = await withJava(client, container, "11.0.20-zulu")
      container = await withMaven(client, container, "3.6.3")
      container = container.withExec("printenv".split(" "))

      const output = await container.stdout()
      expect(output).toContain(
        `${SDKMAN_PATH}/sdkman/candidates/maven/current/bin`,
      )
    })
  })
})
