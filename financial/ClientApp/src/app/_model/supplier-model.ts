export class Supplier {
    id: number | undefined;
    name: string | undefined;
    email: string | undefined;
    active: boolean | undefined;
    cnpj: string | undefined;
    contact: string | undefined;
    phone: string | undefined;
    createdBy: string | undefined;
    changedBy: string | undefined;
    createDate: Date | undefined;
    updateDate: Date | undefined;

    public constructor(init?: Partial<Supplier>) {
        Object.assign(this, init);
    }

    static fromJson(jsonData: any): Supplier {
        return Object.assign(new Supplier(), jsonData);
    }
}
