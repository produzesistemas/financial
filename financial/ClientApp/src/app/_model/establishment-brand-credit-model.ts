import { Brand } from "./brand-model";

export class EstablishmentBrandCredit {
    id: number | undefined;
    brandId: number | undefined;
    establishmentId: number | undefined;
    active: boolean | undefined;
    isSelected: boolean | undefined;
    brand?: Brand = new Brand();
}
