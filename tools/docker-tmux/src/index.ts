/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import execa from 'execa'

type TmuxDockerVersions = 'tmux:latest'

interface IDockerRunArguments {
  name?: string;
  tty?: boolean;
  volumes?: string[];
  rm?: boolean;
}

function getRandomString(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getDockerRunArgs(detach: boolean, args: IDockerRunArguments): string[] {
  const dockerArgs: string[] = []
  if (args.name) dockerArgs.push(...['--name', args.name])
  if (args.tty) dockerArgs.push('-t')
  if (args.rm) dockerArgs.push('--rm')
  if (detach) dockerArgs.push('-d')
  if (args.volumes) {
    args.volumes.forEach((pathMap: string) => dockerArgs.push(...['-v', pathMap]))
  }
  return dockerArgs
}

class DockerContainer {
  public imageName: string
  public containerName: string

  private _dockerChildProcess: execa.ExecaChildProcess | null

  constructor(containerName: string, imageName: TmuxDockerVersions) {
    this.imageName = imageName
    this.containerName = containerName
    this._dockerChildProcess = null
  }

  async runDetached(dockerArgs: IDockerRunArguments, args: string[] = []): Promise<execa.ExecaChildProcess<string>> {
    const result = await execa(
      'docker', ['run', ...getDockerRunArgs(true, dockerArgs), this.imageName, ...args]
    )
    return result
  }

  runAttached(dockerArgs: IDockerRunArguments, args: string[] = []): execa.ExecaChildProcess<string> {
    this._dockerChildProcess = execa(
      'docker', ['run', ...getDockerRunArgs(false, dockerArgs), this.imageName, ...args]
    )
    return this._dockerChildProcess
  }

  async kill(): Promise<void> {
    try {
      await execa('docker', ['rm', '-f', this.containerName])
    } catch (error) {
      // the container does not exist, which is okay
    }
    if (this._dockerChildProcess !== null) {
      this._dockerChildProcess.kill()
    }
  }
}

class DockerVolume {
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  get name(): string {
    return this._name
  }

  async remove(): Promise<void> {
    await execa('docker', ['volume', 'rm', this._name])
  }
}

interface IDockerTmuxRunResult {
  stdout: string,
  stderr: string,
  exitCode: number
}

export default class DockerTmux {

  constructor(
    private _hostVolume: DockerVolume,
    private _container: DockerContainer
  ) {}

  static newWithPrefix(prefix?: string): DockerTmux {
    const name = `${prefix ? `${prefix}-` : ''}${getRandomString()}`
    return DockerTmux.newWithContainerName(name)
  }

  static newWithContainerName(name: string, volumeName?: string): DockerTmux {
    const container = new DockerContainer(name, 'tmux:latest')
    const volume = new DockerVolume(volumeName || `${name}-tmux-local-volume`)
    return new DockerTmux(volume, container)
  }

  static newWithVolume(volume: DockerVolume, name?: string): DockerTmux {
    const container = new DockerContainer(name || getRandomString(), 'tmux:latest')
    return new DockerTmux(volume, container)
  }

  async create(): Promise<IDockerTmuxRunResult> {
    return this._run(true)
  }

  async run(args: string[] = []): Promise<IDockerTmuxRunResult> {
    return this._run(false, args)
  }

  private async _run(detach: boolean = false, args: string[] = []): Promise<IDockerTmuxRunResult> {
    const dockerArgs: IDockerRunArguments = {
      name: this._container.containerName,
      tty: true,
      volumes: [
        `${this._hostVolume.name}:/tmp`
      ],
      rm: true
    }
    const result = detach ? (await this._container.runDetached(dockerArgs, args)) : (await this._container.runAttached(dockerArgs, args))
    const { stdout, stderr, exitCode } = result
    return {
      stdout, stderr, exitCode
    }
  }

  async stop(): Promise<void> {
    await this._container.kill()
    await this._hostVolume.remove()
  }

  get volume(): DockerVolume {
    return this._hostVolume
  }
}