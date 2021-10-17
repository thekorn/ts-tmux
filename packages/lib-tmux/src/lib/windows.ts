/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class TmuxWindow {
  constructor(
    readonly session: string,
    readonly wid: string,
    readonly name: string
  ) {}

  static fromListWindows(output: string): TmuxWindow {
    const [session, wid, name]  = output.split(':', 3)
    return new TmuxWindow(session, wid, name)
  }

  get id(): string {
    return `${this.session}:${this.wid}`
  }

}

export class TmuxWindows extends Map<string, TmuxWindow>{
  static fromListWindows(output: string): TmuxWindows {
    const result: Array<[string, TmuxWindow]> = output.split('\n').map((line) => {
        const window = TmuxWindow.fromListWindows(line.trim())
        return [window.id, window]
      })
    return new TmuxWindows(result)
  }
}
