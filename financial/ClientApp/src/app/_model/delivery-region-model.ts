export class DeliveryRegion {
    id: number | undefined;
    postalCode: string | undefined;
    value: number | undefined;

    public constructor(init?: Partial<DeliveryRegion>) {
        Object.assign(this, init);
    }
}
