import { Establishment } from './establishment-model';
import { DeliveryRegion } from './delivery-region-model';
import { Address } from './address-model';
import { ApplicationUserDTO } from './application-user-dto-model';

export class CloseOrderDTO {
    establishmentId: number | undefined;
    postalCode : string | undefined;
    deliveryRegion: DeliveryRegion | undefined;
    establishment: Establishment | undefined;
    address : Address | undefined;
    applicationUserDTO : ApplicationUserDTO | undefined;
}
