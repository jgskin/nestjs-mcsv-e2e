import { Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { createTestingApp } from './e2e-testing-app';
import { setStartingPort } from './port-rotator';

@Controller()
class FooController {

  @MessagePattern('foo')
  foo() {
    return 'bar';
  }
}

@Module({
  controllers: [ FooController ]
})
class FooModule {}

describe('E2e testing app', () => {

  describe('E2eTestingApp', () => {
    it('.client can send a message to the server', async () => {
      setStartingPort(9100);

      const app = await createTestingApp({ imports: [ FooModule ] });
      const res = await firstValueFrom(app.client.send('foo', {}));

      expect(res).toBe('bar');
      app.teardown();
    });
  });

});