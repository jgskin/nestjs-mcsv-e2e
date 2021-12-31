import { ModuleMetadata } from '@nestjs/common';
import { E2eTestingApp } from './e2e-testing-app';

export async function create(moduleMetadata: ModuleMetadata = {}): Promise<E2eTestingApp> {
  const app = new E2eTestingApp();
  await app.init(moduleMetadata);

  return app;
}

export { setPort } from './port-rotator';
export * from './e2e-testing-app';
