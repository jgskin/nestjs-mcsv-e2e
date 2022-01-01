import * as fs from 'fs';

export const CONFIG_PATH = process.env.NM_E2E_FILEPATH || './.nestjs-msvc-e2e';
export const LOCK_PATH = CONFIG_PATH + '.lock';
const waitTime = 100;

function lock(onAcquired: CallableFunction, maxWaitTime = 1000): void {
  if (maxWaitTime <= 0) {
    throw new Error('Timeout.');
  }

  if (fs.existsSync(LOCK_PATH)) {
    setTimeout(() => lock(onAcquired, maxWaitTime - waitTime), waitTime);
    return;
  }

  fs.writeFileSync(LOCK_PATH, '');
  onAcquired();
  fs.unlinkSync(LOCK_PATH);
}

function getPortConfig(): {} {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
}

function getPort(context: string) {
  const config = getPortConfig();

  if (!config[context]) {
    throw new Error(`Use setStartingPort before running this.`);
  }

  return config[context];
}

function setPort(port: number, context: string = 'default') {
  const config = getPortConfig();
  config[context] = port;
  
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
}

export function getNextPort(context: string = 'default'): Promise<number> {

  return new Promise<number>((resolve, reject) => {
    try {
      lock(() => {
        const port: number = getPort(context);
        
        setPort(port + 1, context);
  
        resolve(port);
      });
    } catch (err) {
      reject(err);
    }
  });

}

export function setStartingPort(port: number, context: string = 'default') {
  if (fs.existsSync(LOCK_PATH)) {
    fs.unlinkSync(LOCK_PATH);
  }
  
  setPort(port, context);
}
