import { Category } from "./category-model";
export class DelicatessenProduct {
    id: number | undefined;
    description: string | undefined;
    imageName: string | undefined;
    detail: string | undefined;
    categoryId: number | undefined;
    unitOfMeasurementId: number | undefined;
    promotion: boolean | undefined;
    active: boolean | undefined;
    value: number | undefined;
    promotionValue?: number;
    code: string | undefined;
    category: Category | undefined;
}
