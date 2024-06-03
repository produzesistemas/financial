export class CenterCost {
    id: number | undefined;
    description: string | undefined;
    code: string | undefined;
    active: boolean | undefined;
    createdBy: string | undefined;
    changedBy: string | undefined;
    createDate: Date | undefined;
    updateDate: Date | undefined;

    public constructor(init?: Partial<CenterCost>) {
        Object.assign(this, init);
    }

    static fromJson(jsonData: any): CenterCost {
        return Object.assign(new CenterCost(), jsonData);
    }
}
