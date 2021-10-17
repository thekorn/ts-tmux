/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { TmuxSessions, TmuxSession } from './sessions'
import { TmuxWindows, TmuxWindow } from './windows'

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
    protected targetSession?: TmuxSession
  ) {}

  toRunArgs(): string[] {
    const args: string[] = ['list-windows', '-F', '#S:#I:#W']
    if (this.targetSession) args.push(...['-t', this.targetSession.id])
    else args.push('-a')
    return args
  }
}

class TmuxNewWindowArgs {
  constructor(
    protected name?: string,
    protected targetSession?: TmuxSession
  ) {}

  toRunArgs(): string[] {
    // alwas print info about new window
    const args: string[] = ['new-window', '-P', '-F', '#S:#I:#W']
    if (this.name) args.push(...['-n', this.name])
    if (this.targetSession) args.push(...['-t', this.targetSession.id])
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

  async killSession(session: TmuxSession): Promise<boolean> {
    try {
      await this._bin.run(['kill-session', '-t', session.id])
    } catch (error) {
      return false
    }
    return true
  }

  async listWindows(...args: ConstructorParameters<typeof TmuxListWindowsArgs>): Promise<TmuxWindows> {
    const result = await this._bin.run(new TmuxListWindowsArgs(...args).toRunArgs())
    return TmuxWindows.fromListWindows(result.stdout);
  }

  async newWindow(...args: ConstructorParameters<typeof TmuxNewWindowArgs>): Promise<TmuxWindow> {
    const result = await this._bin.run(new TmuxNewWindowArgs(...args).toRunArgs())
    const window = TmuxWindow.fromListWindows(result.stdout)
    return window
  }
}