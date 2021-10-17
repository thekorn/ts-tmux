import DockerTmux from '@thekorn/docker-tmux'

import { delay } from './utils'
import { TmuxClient } from './client'


async function main(): Promise<void> {
  const tmux = new DockerTmux('tmux')
  await tmux.create()
  const client = new TmuxClient(new DockerTmux())
  console.log('list sessions....');
  await client.listSessions()
  await client.newSession()
  await client.newSession('test')
  const sessions = await client.listSessions()
  console.log('sessions', sessions);
  
  console.log('done, waiting....');
  await delay(5)
  console.log('stopping....');
  await tmux.stop()
  console.log('done.');
}

main()
  .catch((error) => console.error('ERROR', error))
  .finally(() => console.log('done'));
