"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const e2e_testing_app_1 = require("./e2e-testing-app");
const port_rotator_1 = require("./port-rotator");
let FooController = class FooController {
    foo() {
        return 'bar';
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('foo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FooController.prototype, "foo", null);
FooController = __decorate([
    (0, common_1.Controller)()
], FooController);
let FooModule = class FooModule {
};
FooModule = __decorate([
    (0, common_1.Module)({
        controllers: [FooController]
    })
], FooModule);
describe('E2e testing app', () => {
    describe('E2eTestingApp', () => {
        it('.client can send a message to the server', async () => {
            (0, port_rotator_1.setStartingPort)(9100);
            const app = await (0, e2e_testing_app_1.createTestingApp)({ imports: [FooModule] });
            const res = await (0, rxjs_1.firstValueFrom)(app.client.send('foo', {}));
            expect(res).toBe('bar');
            app.teardown();
        });
    });
});
//# sourceMappingURL=e2e-testing-app.spec.js.map