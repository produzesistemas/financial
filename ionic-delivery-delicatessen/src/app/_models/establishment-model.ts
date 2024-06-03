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
    delivery: boolean | undefined;
    instorePickup: boolean | undefined;
    paymentLittleMachine: boolean | undefined;
    paymentMoney: boolean | undefined;
    paymentOnLine: boolean | undefined;
    

    public constructor(init?: Partial<Establishment>) {
        Object.assign(this, init);
    }
}
