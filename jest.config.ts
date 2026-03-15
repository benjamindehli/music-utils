/// <reference types="jest" />
import type { Config } from "jest";

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["<rootDir>/setup-jest.ts"]
};

export default config;
