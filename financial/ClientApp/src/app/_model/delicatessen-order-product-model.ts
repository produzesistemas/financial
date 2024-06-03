import { DelicatessenProduct } from './delicatessen-product-model';

export class DelicatessenOrderProduct {
    id: number | undefined;
    delicatessenOrderId: number | undefined;
    delicatessenProductId: number | undefined;
    quantity: number | undefined;
    value: number | undefined;
    obs: string | undefined;
    description: string | undefined;
    delicatessenProduct: DelicatessenProduct | undefined;
}
