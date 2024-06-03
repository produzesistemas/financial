import { DelicatessenOrderProduct } from './delicatessen-order-product-model';
import { DelicatessenOrderTracking } from './delicatessen-order-tracking-model';
import { ApplicationUser } from './application-user';
import { DelicatessenOrderEvaluation } from './delicatessen-order-evaluation-model';
import { DelicatessenCoupon } from './delicatessen-coupon-model';
import { DelicatessenPayment } from './delicatessen-payment-model';
import { Address } from './address-model';
import { ApplicationUserDTO } from './application-user-dto';
export class DelicatessenOrder {
    id: number | undefined;
    obs: string | undefined;
    expectedDeliveryDate: Date | undefined;
    addressId: number | undefined;
    couponId: number | undefined;
    orderPaymentStatusId: number | undefined;
    paymentConditionId: number | undefined;
    establishmentId: number | undefined;
    taxValue: number | undefined;
    applicationUserId: string | undefined;
    requestDate: Date | undefined;

    coupon: DelicatessenCoupon | undefined;
    applicationUser: ApplicationUser | undefined;
    applicationUserDTO: ApplicationUserDTO | undefined;
    delicatessenOrderProducts: DelicatessenOrderProduct[] = [];
    delicatessenOrderTrackings: DelicatessenOrderTracking[] = [];
    orderEvaluations: DelicatessenOrderEvaluation[] = [];
    payment: DelicatessenPayment = new DelicatessenPayment();
    address: Address = new Address();

    phoneNumber: string | undefined;
    name: string | undefined;
    cpf: string | undefined;
    instorePickup: boolean | undefined;
    delivery: boolean | undefined;
    paymentOnline: boolean | undefined;
    paymentLittleMachine: boolean | undefined;
    paymentMoney: boolean | undefined;
    exchangeForCash: number | undefined;

}
