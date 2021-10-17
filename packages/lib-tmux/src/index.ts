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
  console.log('remove session', await session.kill());
  console.log('sessions', await client.listSessions());

  console.log('done, waiting....');
  const session0 = (await client.listSessions()).get('0')
  const session1 = (await client.listSessions()).get('1')
  console.log('windows', await client.listWindows())
  await client.newWindow()
  await session1!.newWindow()
  await client.newWindow('feature/BK-345345', session0!)
  await session1!.newWindow()
  console.log('windows', await client.listWindows())
  console.log('windows session0', await session0!.listWindows())
  console.log('windows session1', await session1!.listWindows())
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
