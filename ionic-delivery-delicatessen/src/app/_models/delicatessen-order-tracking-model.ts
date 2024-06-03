import { StatusOrder } from "./status-order-model";

export class DelicatessenOrderTracking {
    delicatessenOrderId: number | undefined;
    statusOrderId: number | undefined;
    followupDate: Date | undefined;
    quantity: number | undefined;
    id: number | undefined;
    statusOrder: StatusOrder | undefined;
}
