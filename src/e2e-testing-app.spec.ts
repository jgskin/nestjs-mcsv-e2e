import { Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { create, setStartingPort } from '.';

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

      const app = await create({ imports: [ FooModule ] });
      const res = await firstValueFrom(app.client.send('foo', {}));

      expect(res).toBe('bar');
      app.teardown();
    });
  });

});