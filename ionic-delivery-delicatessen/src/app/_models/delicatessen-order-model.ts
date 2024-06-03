import { Address } from "./address-model";
import { Coupon } from "./coupon-model";
import { DelicatessenOrderProduct } from "./delicatessen-order-product-model";
import { DelicatessenOrderTracking } from "./delicatessen-order-tracking-model";
import { EstablishmentBrandCredit } from "./establishment-brand-credit-model";
import { EstablishmentBrandDebit } from "./establishment-brand-debit-model";
import { PaymentCondition } from "./payment-condition-model";

export class DelicatessenOrder {
    paymentConditionId: number | undefined;
    addressId: number | undefined;
    couponId: number | undefined;
    requestDate: Date | undefined;
    code: string | undefined;
    taxValue: number | undefined;
    exchangeForCash: number | undefined;
    establishmentId: number | undefined;
    postalCode: string | undefined;
    instorePickup: boolean | undefined;
    address: Address | undefined;
    delivery: boolean | undefined;
    paymentOnLine: boolean | undefined;
    paymentLittleMachine: boolean | undefined;
    paymentMoney: boolean | undefined;
    id: number | undefined;
    paymentCondition: PaymentCondition | undefined;
    delicatessenOrderProducts: DelicatessenOrderProduct[] = [];
    delicatessenOrderTrackings: DelicatessenOrderTracking[] = [];
    establishmentBrandCreditId: number | undefined;
    establishmentBrandDebitId: number | undefined;
    establishmentBrandCredit: EstablishmentBrandCredit[] = [];
    establishmentBrandDebit: EstablishmentBrandDebit[] = [];
    coupon: Coupon | undefined;
}
