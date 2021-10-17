/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { TmuxSessions, TmuxSession } from './sessions'

import type { ITmuxBin } from './bin'

export class TmuxNewSessionArgs {
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

export class TmuxClient {
  private _bin: ITmuxBin

  constructor(bin: ITmuxBin) {
    this._bin = bin
  }

  async newSession(args: TmuxNewSessionArgs =  new TmuxNewSessionArgs()): Promise<TmuxSession> {
    const command = ['new-session']
    if (args) command.push(...args.toRunArgs())
    const result = await this._bin.run(command)
    const session = TmuxSession.fromListSessions(result.stdout)
    return session
  }


  async listSessions(): Promise<TmuxSessions> {
    const result = await this._bin.run(['list-sessions'])
    return TmuxSessions.fromListSessions(result.stdout);
  }
}