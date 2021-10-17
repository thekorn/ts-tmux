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
    const args: string[] = ['new-session', '-P']
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
    const args: string[] = ['list-windows']
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
    const result = await this._bin.run(new TmuxNewSessionArgs(...args).toRunArgs())
    const session = TmuxSession.fromListSessions(result.stdout)
    return session
  }

  async listSessions(): Promise<TmuxSessions> {
    const result = await this._bin.run(['list-sessions'])
    return TmuxSessions.fromListSessions(result.stdout);
  }

  async killSession(name: string): Promise<boolean> {
    try {
      await this._bin.run(['kill-session', '-t', name])
    } catch (error) {
      return false
    }
    return true
  }

  async listWindows(...args: ConstructorParameters<typeof TmuxListWindowsArgs>): Promise<TmuxWindows> {
    const result = await this._bin.run(new TmuxListWindowsArgs(...args).toRunArgs())
    return TmuxWindows.fromListWindows(result.stdout);
  }
}