/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { TmuxSessions, TmuxSession } from './sessions'
import { TmuxWindows } from './windows'

import type { ITmuxBin } from './bin'

class TmuxNewSessionArgs {
  constructor(
    protected name?: string,
    protected attach?: boolean
  ) {}

  toRunArgs(): string[] {
    // alwas print info about new session
    const args: string[] = ['-P']
    if (this.name) args.push(...['-s', this.name])
    if (!this.attach) args.push('-d')
    return args
  }
}

class TmuxListWindowsArgs {
  constructor(
    protected targetSession?: string
  ) {}

  toRunArgs(): string[] {
    const args: string[] = []
    if (this.targetSession) args.push(...['-t', this.targetSession])
    else args.push('-a')
    return args
  }
}

export class TmuxClient {
  private _bin: ITmuxBin

  constructor(bin: ITmuxBin) {
    this._bin = bin
  }

  async newSession(...args: ConstructorParameters<typeof TmuxNewSessionArgs>): Promise<TmuxSession> {
    const command = ['new-session']
    if (args) command.push(...new TmuxNewSessionArgs(...args).toRunArgs())
    const result = await this._bin.run(command)
    const session = TmuxSession.fromListSessions(result.stdout)
    return session
  }

  async listSessions(): Promise<TmuxSessions> {
    const result = await this._bin.run(['list-sessions'])
    return TmuxSessions.fromListSessions(result.stdout);
  }

  async listWindows(...args: ConstructorParameters<typeof TmuxListWindowsArgs>): Promise<TmuxWindows> {
    const command = ['list-windows']
    if (args) command.push(...new TmuxListWindowsArgs(...args).toRunArgs())
    const result = await this._bin.run(command)
    return TmuxWindows.fromListWindows(result.stdout);
  }
}