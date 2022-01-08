import { ModuleMetadata } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TestingModule } from '@nestjs/testing';
export declare class E2eTestingApp {
    private server;
    private clientApp;
    module: TestingModule;
    client: ClientProxy;
    init(moduleMetadata?: ModuleMetadata): Promise<void>;
    teardown(): Promise<void>;
}
export declare function createTestingApp(moduleMetadata?: ModuleMetadata): Promise<E2eTestingApp>;
