import { INestApplication, INestMicroservice, ModuleMetadata } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { getNextPort } from './port-rotator';

const CLIENT_NAME = 'client';

async function createServer(module: TestingModule, port: number): Promise<INestMicroservice> {
  const app = module.createNestMicroservice({ transport: Transport.TCP, options: { port }});

  await app.listen();

  return app;
}

async function createClient(port: number): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    providers: [
      {
        provide: CLIENT_NAME,
        useFactory: () => ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port
          }
        })
      }
    ]
  }).compile();
  const app = module.createNestApplication();
  
  return app.init();
}

export class E2eTestingApp {
  private server!: INestMicroservice;
  private clientApp!: INestApplication;
  module!: TestingModule;
  client!: ClientProxy;

  async init(moduleMetadata: ModuleMetadata = {}) {
    const port: number = await getNextPort();

    this.clientApp = await createClient(port);
    this.module = await Test.createTestingModule(moduleMetadata).compile();
    this.server = await createServer(this.module, port);
    this.client = this.clientApp.get(CLIENT_NAME);
    
    await this.client.connect();
  }

  async teardown() {
    await this.server.close();
    await this.clientApp.close();
    this.client.close();
  }
}
