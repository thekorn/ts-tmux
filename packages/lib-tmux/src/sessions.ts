/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class TmuxSession {
  constructor(
    readonly name: string,
    readonly attached: boolean
  ) {}

  static fromListSessions(output: string): TmuxSession {
    const [name, remainder]  = output.split(':', 1)
    const attached = !!remainder && remainder.includes('(attached)')
    return new TmuxSession(name, attached)
  }

}

export class TmuxSessions extends Map<string, TmuxSession>{
  static fromListSessions(output: string): TmuxSessions {
    const result: Array<[string, TmuxSession]> = output.split('\n').map((line) => {
      const session = TmuxSession.fromListSessions(line)
      return [session.name, session]
    })
    return new TmuxSessions(result)
  }
}

