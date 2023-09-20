import { Client, Container } from "@dagger.io/dagger"

const SDKMAN_CACHE = "sdkman-cache"
const SDKMAN_PATH = "/root/.sdkman"

export function installSdkman(
  client: Client,
  container: Container,
  with_cache: Boolean = false,
): Container {
  if (with_cache) {
    const sdkman_cache = client.cacheVolume(SDKMAN_CACHE)
    container.withMountedCache(SDKMAN_PATH, sdkman_cache)
  }

  container = container
    .withExec("apt-get update".split(" "))
    .withExec("apt-get install -y zip unzip wget curl".split(" "))
    .withEnvVariable("SDKMAN_DIR", `${SDKMAN_PATH}/sdkman`)
    .withExec("curl -s https://get.sdkman.io -o sdkman.sh".split(" "))
    .withExec("bash sdkman.sh".split(" "))

  return container
}

export function installJava(
  client: Client,
  container: Container,
  version: string,
  with_cache: Boolean = false,
): Container {
  container = installSdkman(client, container, with_cache)

  container = container
    .withExec([
      "/bin/bash",
      "-c",
      `source ${SDKMAN_PATH}/sdkman/bin/sdkman-init.sh && sdk install java ${version}`,
    ])
    .withEnvVariable(
      "PATH",
      `$PATH:${SDKMAN_PATH}/sdkman/candidates/java/current/bin`,
      { expand: true },
    )
    .withEnvVariable(
      "JAVA_HOME",
      `${SDKMAN_PATH}/sdkman/candidates/java/current`,
    )
  return container
}

export function installMaven(
  client: Client,
  container: Container,
  version: string,
  with_cache: Boolean = false,
): Container {
  container = installSdkman(client, container, with_cache)

  container = container
    .withExec([
      "/bin/bash",
      "-c",
      `source ${SDKMAN_PATH}/sdkman/bin/sdkman-init.sh && sdk install maven ${version}`,
    ])
    .withEnvVariable(
      "PATH",
      `$PATH:${SDKMAN_PATH}/sdkman/candidates/maven/current/bin`,
      { expand: true },
    )
  return container
}
