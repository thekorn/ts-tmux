/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import execa from 'execa'

interface IDockerRunArguments {
  name?: string;
  tty?: boolean;
  volumes?: string[];
  rm?: boolean;
  detach?: boolean
}

function getDockerRunArgs(args: IDockerRunArguments): string[] {
  const dockerArgs: string[] = []
  if (args.name) dockerArgs.push(...['--name', args.name])
  if (args.tty) dockerArgs.push('-t')
  if (args.rm) dockerArgs.push('--rm')
  if (args.detach) dockerArgs.push('-d')
  if (args.volumes) {
    args.volumes.forEach((pathMap: string) => dockerArgs.push(...['-v', pathMap]))
  }
  return dockerArgs
}

class DockerContainer {
  public imageName: string
  public containerName: string

  private _dockerPromise: execa.ExecaChildProcess | null

  constructor(containerName: string, imageName: string) {
    this.imageName = imageName
    this.containerName = containerName
    this._dockerPromise = null
  }

  run(dockerArgs: IDockerRunArguments, args: string[] = []): execa.ExecaChildProcess<string> {
    this._dockerPromise = execa(
      'docker', ['run', ...getDockerRunArgs(dockerArgs), this.imageName, ...args]
    )
    return this._dockerPromise
  }

  async kill(): Promise<void> {
    await execa('docker', ['rm', '-f', this.containerName])
    if (this._dockerPromise !== null) this._dockerPromise.kill()
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

/**
 * Returns a new instance of the class.
 * @public
 */
export interface IDockerTmuxRunResult {
  /**
   * hello world
   */
  stdout: string,
  stderr: string,
  exitCode: number
}


/**
 * Wrapper for a tmux instance running in docker
 * @beta
 */
export default class DockerTmux {
  private _hostVolume: DockerVolume
  private _container: DockerContainer
  private _containerName: string | undefined

  constructor(hostVolume?: string);
  constructor(containerName: string, hostVolume?: string) {
    this._hostVolume = new DockerVolume(hostVolume || 'tmux-volume')
    this._container = new DockerContainer('tmux', 'tmux:latest')
    this._containerName = containerName
  }

  /**
   * some function
   */
  async create(): Promise<IDockerTmuxRunResult> {
    return this._run(true)
  }

  async run(args: string[] = []): Promise<IDockerTmuxRunResult> {
    return this._run(false, args)
  }

  private async _run(detach: boolean = false, args: string[] = []): Promise<IDockerTmuxRunResult> {
    const dockerArgs: IDockerRunArguments = {
      name: this._containerName,
      tty: true,
      volumes: [
        `${this._hostVolume.name}:/tmp`
      ],
      rm: true,
      detach
    }
    const result = await this._container.run(dockerArgs, args)
    const { stdout, stderr, exitCode } = result
    return {
      stdout, stderr, exitCode
    }
  }

  async stop(): Promise<void> {
    await this._container.kill()
    await this._hostVolume.remove()
  }
}