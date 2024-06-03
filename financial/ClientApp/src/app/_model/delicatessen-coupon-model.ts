export class DelicatessenCoupon {
    id: number | undefined;
    description: string | undefined;
    code: string | undefined;
    quantity: number | undefined;
    clientId?: number;
    type: boolean | undefined;
    general: boolean | undefined;
    main: boolean | undefined;
    active: boolean | undefined;
    value: number | undefined;
    minimumValue: number | undefined;
    initialDate: Date | undefined;
    finalDate: Date | undefined;

    public constructor(init?: Partial<DelicatessenCoupon>) {
        Object.assign(this, init);
    }
}