/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import execa from 'execa'

interface ITmuxBinRun {
  (args?: string[]): Promise<{stdout: string, stderr: string, exitCode: number}>
}

export interface ITmuxBin {
  run: ITmuxBinRun
}

export class SystemTmux implements ITmuxBin {
  async run(args?: string[]): Promise<{stdout: string, stderr: string, exitCode: number}> {
    return execa('tmux', args)
  }
}