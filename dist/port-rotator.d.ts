export declare const CONFIG_PATH: string;
export declare const LOCK_PATH: string;
export declare function getNextPort(context?: string): Promise<number>;
export declare function setStartingPort(port: number, context?: string): void;
