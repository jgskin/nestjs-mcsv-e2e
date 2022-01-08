"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestingApp = exports.E2eTestingApp = void 0;
const microservices_1 = require("@nestjs/microservices");
const testing_1 = require("@nestjs/testing");
const port_rotator_1 = require("./port-rotator");
const CLIENT_NAME = 'client';
async function createServer(module, port) {
    const app = module.createNestMicroservice({ transport: microservices_1.Transport.TCP, options: { port } });
    await app.listen();
    return app;
}
async function createClient(port) {
    const module = await testing_1.Test.createTestingModule({
        providers: [
            {
                provide: CLIENT_NAME,
                useFactory: () => microservices_1.ClientProxyFactory.create({
                    transport: microservices_1.Transport.TCP,
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
class E2eTestingApp {
    async init(moduleMetadata = {}) {
        const port = await (0, port_rotator_1.getNextPort)();
        this.clientApp = await createClient(port);
        this.module = await testing_1.Test.createTestingModule(moduleMetadata).compile();
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
exports.E2eTestingApp = E2eTestingApp;
async function createTestingApp(moduleMetadata = {}) {
    const app = new E2eTestingApp();
    await app.init(moduleMetadata);
    return app;
}
exports.createTestingApp = createTestingApp;
//# sourceMappingURL=e2e-testing-app.js.map