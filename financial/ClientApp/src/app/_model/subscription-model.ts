import { Establishment } from "./establishment-model";
import { Plan } from "./plan-model";

export class Subscription {
    id: number | undefined;
    establishmentId: number | undefined;
    planId: number | undefined;
    subscriptionDate: Date | undefined;
    tolerance: number | undefined;
    value: number | undefined;

    establishment: Establishment | undefined;
    plan: Plan | undefined;

}
