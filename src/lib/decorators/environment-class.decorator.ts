import { loadEnvFile } from "node:process";
import "reflect-metadata";

export function EnvironmentClass(envFileKey?: string) {

    return function (ctr: any) {
        return class extends ctr {
            constructor() {
                super();

                if(envFileKey) {
                    loadEnvFile(process.env[envFileKey]);
                }

                const instance = new ctr();
                Object.entries(instance).forEach(([key, _value]) => {
                    const value = process.env[key] || _value;

                    if (!value) {
                        console.warn(`${ctr.name} MISSING ENV VAR ${key}`);
                    }

                    instance[key] = process.env[key];
                });
                return { ...instance };
            }
        } as typeof ctr;
    };
}