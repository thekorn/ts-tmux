import DockerTmux from '@thekorn/docker-tmux'

import { TmuxClient } from './lib/client'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SystemTmux } from './lib/bin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { delay } from './lib/utils'


async function main(): Promise<void> {
  const tmux = new DockerTmux('tmux')
  await tmux.create()
  const client = new TmuxClient(new DockerTmux())
  console.log('list sessions....');
  await client.listSessions()
  await client.newSession()
  const session = await client.newSession('test')
  console.log('sessions', await client.listSessions());
  console.log('remove sessions', await client.killSession(session.id));
  console.log('sessions', await client.listSessions());

  console.log('done, waiting....');
  console.log('windows', await client.listWindows())
  console.log('stopping....');
  await tmux.stop()
  console.log('done.');

  //const client1 = new TmuxClient(new SystemTmux())
  //console.log('list sessions....');
  //await client1.listSessions()
  //await client1.newSession()
  //await client1.newSession('test')
  //console.log('sessions', await client1.listSessions());
  //
  //console.log('done, waiting....');
  //console.log('windows', await client1.listWindows())
}

main()
  .catch((error) => console.error('ERROR', error))
  .finally(() => console.log('done'));
