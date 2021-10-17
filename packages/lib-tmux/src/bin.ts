interface ITmuxBinRun {
  (args?: string[]): Promise<{stdout: string, stderr: string, exitCode: number}>
}

export interface ITmuxBin {
  run: ITmuxBinRun
}