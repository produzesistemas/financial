export class CurrentAccount {
    id: number | undefined;
    agency: string | undefined;
    bank: string | undefined;
    account: string | undefined;
    bankNumber: number | undefined;
    openingBalance: number | undefined;
    createdBy: string | undefined;
    changedBy: string | undefined;
    createDate: Date | undefined;
    updateDate: Date | undefined;

    public constructor(init?: Partial<CurrentAccount>) {
        Object.assign(this, init);
    }

    static fromJson(jsonData: any): CurrentAccount {
        return Object.assign(new CurrentAccount(), jsonData);
    }
}
