import { DelicatessenProduct } from "./delicatessen-product-model";

export class DelicatessenOrderProduct {
    delicatessenOrderId: number | undefined;
    delicatessenProductId: number | undefined;
    value: number | undefined;
    quantity: number | undefined;
    id: number | undefined;
    delicatessenProduct: DelicatessenProduct | undefined;
}
