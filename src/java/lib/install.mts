import { Client, Container } from "@dagger.io/dagger"

const SDKMAN_CACHE = "sdkman-cache"
export const SDKMAN_PATH = "/root/.sdkman"

export async function withSdkman(
  client: Client,
  container: Container,
  withCache: Boolean = false,
): Promise<Container> {
  if (withCache) {
    const sdkman_cache = client.cacheVolume(SDKMAN_CACHE)
    container.withMountedCache(SDKMAN_PATH, sdkman_cache)
  }

  container = container
    .withExec("apt-get update".split(" "))
    .withExec("apt-get install -y zip unzip wget curl".split(" "))
    .withEnvVariable("SDKMAN_DIR", `${SDKMAN_PATH}/sdkman`)
    .withExec(["bash", "-c", "curl -s https://get.sdkman.io | bash"])

  return container
}

export async function withJava(
  client: Client,
  container: Container,
  version: string,
  withCache: Boolean = false,
): Promise<Container> {
  container = await withSdkman(client, container, withCache)

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

export async function withMaven(
  client: Client,
  container: Container,
  version: string,
  withCache: Boolean = false,
): Promise<Container> {
  container = await withSdkman(client, container, withCache)

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
