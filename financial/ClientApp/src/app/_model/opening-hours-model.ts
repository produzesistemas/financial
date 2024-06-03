export class OpeningHours {
    id: number | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
    establishmentId: number | undefined;
    weekday: number | undefined;
    active: boolean | undefined;

    public constructor(init?: Partial<OpeningHours>) {
        Object.assign(this, init);
    }
}
