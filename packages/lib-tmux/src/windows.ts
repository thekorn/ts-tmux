/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class TmuxWindow {
  constructor(
    readonly session: string,
    readonly name: string
  ) {}

  static fromListWindows(output: string): TmuxWindow {
    const [session, name]  = output.split(':', 2)
    return new TmuxWindow(session, name)
  }

  get id(): string {
    return `${this.session}:${this.name}`
  }

}

export class TmuxWindows extends Map<string, TmuxWindow>{
  static fromListWindows(output: string): TmuxWindows {
    console.log('list windows', output);
    
    const result: Array<[string, TmuxWindow]> = output.split('\n').map((line) => {
        const window = TmuxWindow.fromListWindows(line)
        return [window.id, window]
      })
    return new TmuxWindows(result)
  }
}
