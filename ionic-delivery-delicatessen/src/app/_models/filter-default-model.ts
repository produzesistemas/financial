
export class FilterDefaultModel {
    name: string | undefined;
    id: number | undefined;
    establishmentId: number | undefined;
    sizePage: number | undefined;
    public constructor(init?: Partial<FilterDefaultModel>) {
        Object.assign(this, init);
    }

    static fromJson(jsonData: any): FilterDefaultModel {
        return Object.assign(new FilterDefaultModel(), jsonData);
    }
}
