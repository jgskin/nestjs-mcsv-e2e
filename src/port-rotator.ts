import * as fs from 'fs';

export const CONFIG_PATH = './.nestjs-msvc-e2e';
export const LOCK_PATH = CONFIG_PATH + '.lock';
const waitFor = 100;

function lock(onAcquired: CallableFunction, waitTime = 1000): void {
  if (waitTime <= 0) {
    throw new Error('Timeout.');
  }

  if (fs.existsSync(LOCK_PATH)) {
    setTimeout(() => lock(onAcquired, waitTime - waitFor), waitFor);
    return;
  }

  fs.writeFileSync(LOCK_PATH, '');
  onAcquired();
  fs.unlinkSync(LOCK_PATH);
}

function getPortConfig(): {} {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Use setStartingPort before running this.`);
  }

  return JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
}

function getPort(context: string) {
  const config = getPortConfig();

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
