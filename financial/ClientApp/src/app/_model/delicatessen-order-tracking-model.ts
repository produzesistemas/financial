import { StatusOrder } from 'src/app/_model/status-order-model';
export class DelicatessenOrderTracking {
    id: number | undefined;
    statusOrderId: number | undefined;
    delicatessenOrderId: number | undefined;
    statusOrder: StatusOrder | undefined;
    followupDate: Date | undefined;
}
