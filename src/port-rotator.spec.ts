import * as fs from 'fs';
import { LOCK_PATH, CONFIG_PATH, getNextPort, setStartingPort } from './port-rotator';

const context = 'port-rotator';

describe('Port selector', () => {
  describe('getNextPort', () => {

    it('Returns a new port at each call starting with the configured port', async () => {
      setStartingPort(9000, context);
      expect(await getNextPort(context)).toBe(9000);
      expect(await getNextPort(context)).toBe(9001);
      expect(await getNextPort(context)).toBe(9002);
    });

    it('Only returns a port when another thread/proccess is not requesting it', done => {
      setStartingPort(9000, context);

      fs.writeFileSync(LOCK_PATH, '');

      getNextPort(context)
        .then(port => {
          expect(port).toBe(9001);
          done();
        })
        .catch(err => {
          done(err);
        });

      const config = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());

      expect(config[context]).toBe(9000);

      config[context] += 1;
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));

      fs.unlinkSync(LOCK_PATH);
    });

  });
});
