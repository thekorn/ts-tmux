import DockerTmux from '@thekorn/docker-tmux'
import { TmuxClient } from '../lib/client';

let tmuxInstance: DockerTmux

describe('handle sessions', () => {
  beforeAll(async () => {
    tmuxInstance = DockerTmux.newWithPrefix('tmux-test')
    await tmuxInstance.create()
  })

  afterAll(async () => {
    if (tmuxInstance !== undefined) {
      await tmuxInstance.stop()
    }
  })


  test('list default session', async () => {
    const client = new TmuxClient(DockerTmux.newWithVolume(tmuxInstance.volume))
    const sessions = await client.listSessions();
    expect(sessions.size).toBe(1)
  });

  //it('Correctly handles snapshots', () => {
  //  expect({ a: 1, b: 2, c: 3 }).toMatchSnapshot();
  //});
//
  //it('Correctly handles TypeScript constructs', () => {
  //  const interfaceInstance: IInterface = {
  //    element: 'a'
  //  };
  //  expect(interfaceInstance).toBeTruthy();
  //});
});
