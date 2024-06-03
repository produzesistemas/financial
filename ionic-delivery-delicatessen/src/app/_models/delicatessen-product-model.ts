import { Category } from "./category-model";

export class DelicatessenProduct {
    id: number | undefined;
    imageName: string | undefined;
    description: string | undefined;
    detail: string | undefined;
    code: string | undefined;
    value: number | undefined;
    promotionValue: number | undefined;
    establishmentId: number | undefined;
    categoryId: number | undefined;
    promotion: boolean | undefined;
    category: Category | undefined;
}
