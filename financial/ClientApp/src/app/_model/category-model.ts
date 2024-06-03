export class Category {
    id: number | undefined;
    description: string | undefined;
    imageName: string | undefined;

    public constructor(init?: Partial<Category>) {
        Object.assign(this, init);
    }
}
