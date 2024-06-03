import { DelicatessenProduct } from "./delicatessen-product-model";

export class Category {
    id: number | undefined;
    description: string | undefined;
    imageName: string | undefined;
    delicatessenProducts: DelicatessenProduct[] = [];
}
