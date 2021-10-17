/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { TmuxClient } from './client'
import { TmuxWindow, TmuxWindows } from './windows'

export class TmuxSession {
  constructor(
    private _client: TmuxClient,
    readonly name: string,
    readonly attached: boolean
  ) {}

  static fromListSessions(client: TmuxClient, output: string): TmuxSession {
    const [name, remainder]  = output.split(':', 1)
    const attached = !!remainder && remainder.includes('(attached)')
    return new TmuxSession(client, name, attached)
  }

  get id(): string {
    return `${this.name}:`
  }

  async kill(): Promise<boolean> {
    return this._client.killSession(this)
  }

  async listWindows(): Promise<TmuxWindows>{
    return this._client.listWindows(this)
  }

  async newWindow(name?: string): Promise<TmuxWindow>{
    return this._client.newWindow(name, this)
  }

}

export class TmuxSessions extends Map<string, TmuxSession>{
  static fromListSessions(client: TmuxClient, output: string): TmuxSessions {
    const result: Array<[string, TmuxSession]> = output.split('\n').map((line) => {
      const session = TmuxSession.fromListSessions(client, line.trim())
      return [session.name, session]
    })
    return new TmuxSessions(result)
  }
}

