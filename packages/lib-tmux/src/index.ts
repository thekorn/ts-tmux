import DockerTmux from '@thekorn/docker-tmux'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  console.log('sessions', await client.listSessions());
  
  console.log('done, waiting....');
  console.log('windows', await client.listWindows())
  console.log('stopping....');
  await tmux.stop()
  console.log('done.');
}

main()
  .catch((error) => console.error('ERROR', error))
  .finally(() => console.log('done'));
