import "reflect-metadata";

export function EnvironmentClass(envFileKey?: string) {

    return function (ctr: any) {
        return class extends ctr {
            constructor() {
                super();
                const instance = new ctr();
                for (const key in instance) {
                    const value = process.env[key];

                    if (!value) {
                        console.warn(`${ctr.name} MISSING ENV VAR ${key}`);
                    }

                    instance[key] = process.env[key];
                }
                return { ...instance };
            }
        } as typeof ctr;
    };
}