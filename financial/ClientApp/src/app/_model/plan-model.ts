import { Module } from "./module-model";

export class Plan {
    id: number | undefined;
    qtdMonth: number | undefined;
    moduleId: number | undefined;
    description: string | undefined;
    value: number | undefined;
    module: Module | undefined;

}
