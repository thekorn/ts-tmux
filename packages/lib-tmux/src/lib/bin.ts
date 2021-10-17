/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import execa from 'execa'

interface ITmuxRunResult {
  stdout: string,
  stderr: string,
  exitCode: number
}

interface ITmuxBinRun {
  (args?: string[]): Promise<ITmuxRunResult>
}

export interface ITmuxBin {
  run: ITmuxBinRun
}

export class SystemTmux implements ITmuxBin {
  async run(args?: string[]): Promise<ITmuxRunResult> {
    return execa('tmux', args)
  }
}