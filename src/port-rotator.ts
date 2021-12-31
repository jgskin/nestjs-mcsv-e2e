import * as fs from 'fs';

const portfile: string = './.testing-app-e2e';
const lockfile: string = portfile + '.lock';

function lock(callback: CallableFunction): void {
  if (fs.existsSync(lockfile)) {
    setTimeout(() => lock(callback), 100);
    return;
  }

  fs.writeFileSync(lockfile, '');

  callback();

  fs.unlinkSync(lockfile);
}

export function getNextPort(): Promise<number> {
  if (!fs.existsSync(portfile)) {
    setPort();
  }

  return new Promise<number>(resolve => {
    lock(() => {
      const port: number = parseInt(fs.readFileSync(portfile).toString());

      fs.writeFileSync(portfile, (port + 1).toString());

      resolve(port);
    });
  });
}

export function setPort(port: number = 1000) {
  fs.writeFileSync(portfile, port.toString());
}