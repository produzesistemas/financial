import { Module } from "./module-model";

export class Establishment {
    id: number | undefined;
    name: string | undefined;
    contactName: string | undefined;
    email: string | undefined;
    active: boolean | undefined;
    description: string | undefined;
    base64: string | undefined;
    district: string | undefined;
    moduleId: number | undefined;
    address: string | undefined;
    cnpj: string | undefined;
    phone: string | undefined;
    postalCode: string | undefined;
    imageName: string | undefined;
    minimumValue: number | undefined;
    instorePickup: boolean = false;
    delivery: boolean  = false;
    paymentMoney: boolean = false;
    paymentLittleMachine: boolean = false;
    paymentOnLine: boolean = false;

    public constructor(init?: Partial<Establishment>) {
        Object.assign(this, init);
    }
}
