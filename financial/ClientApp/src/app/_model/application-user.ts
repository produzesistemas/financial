export class ApplicationUser {
    id: string | undefined;
    email: string | undefined;
    userName: string | undefined;

    public constructor(init?: Partial<ApplicationUser>) {
        Object.assign(this, init);
    }
}
