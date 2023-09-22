import { Container } from "@dagger.io/dagger"

const FNM_PATH = "/root/.fnm"

export async function withFnm(container: Container): Promise<Container> {
  container = container
    .withExec("apt-get update".split(" "))
    .withExec("apt-get install -y curl unzip".split(" "))
    .withExec("mkdir /root/.fnm".split(" "))
    .withExec([
      "/bin/bash",
      "-c",
      `curl -fsSL https://fnm.vercel.app/install | bash`,
    ])
    .withEnvVariable("PATH", `$PATH:${FNM_PATH}`, { expand: true })

  return container
}

export async function withNode(
  container: Container,
  node_version?: Number,
): Promise<Container> {
  container = container
    .withExec(`fnm install ${node_version}`.split(" "))
    .withExec([
      "/bin/bash",
      "-c",
      `fnm env --shell=bash | head -n 1 | awk '{ split($0, parts, /"/); print parts[2] }'`,
    ])

  const FNM_EXPORT: String = (await container.stdout()).trim()
  container = container.withEnvVariable("PATH", `$PATH:${FNM_EXPORT}`, {
    expand: true,
  })

  return container
}
