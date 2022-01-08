"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const port_rotator_1 = require("./port-rotator");
const context = 'port-rotator';
describe('Port selector', () => {
    describe('getNextPort', () => {
        it('Returns a new port at each call starting with the configured port', async () => {
            (0, port_rotator_1.setStartingPort)(9000, context);
            expect(await (0, port_rotator_1.getNextPort)(context)).toBe(9000);
            expect(await (0, port_rotator_1.getNextPort)(context)).toBe(9001);
            expect(await (0, port_rotator_1.getNextPort)(context)).toBe(9002);
        });
        it('Only returns a port when another thread/proccess is not requesting it', done => {
            (0, port_rotator_1.setStartingPort)(9000, context);
            fs.writeFileSync(port_rotator_1.LOCK_PATH, '');
            (0, port_rotator_1.getNextPort)(context)
                .then(port => {
                expect(port).toBe(9001);
                done();
            })
                .catch(err => {
                done(err);
            });
            const config = JSON.parse(fs.readFileSync(port_rotator_1.CONFIG_PATH).toString());
            expect(config[context]).toBe(9000);
            config[context] += 1;
            fs.writeFileSync(port_rotator_1.CONFIG_PATH, JSON.stringify(config));
            fs.unlinkSync(port_rotator_1.LOCK_PATH);
        });
    });
});
//# sourceMappingURL=port-rotator.spec.js.map