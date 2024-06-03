package com.br.app.deliverydelicatessen.model

import java.util.ArrayList
import java.util.Date

data class DelicatessenOrder(
    var paymentConditionId: Int? = 0,
    var addressId: Int? = 0,
    var couponId: Int? = null,
    var requestDate: Date? = null,
    var code: String = "",
    var taxValue: Double? = 0.00,
    var establishmentId: Int = 0,
    var exchangeForCash: Double? = 0.00,
    var postalCode: String? = null,
    var instorePickup: Boolean? = null,
    var delivery: Boolean? = null,
    var paymentOnLine: Boolean? = null,
    var paymentLittleMachine: Boolean? = null,
    var paymentMoney: Boolean? = null,
    var id: Int = 0,
    var address: Address? = null,
    var paymentCondition: PaymentCondition? = null,
    var delicatessenOrderProducts: MutableList<DelicatessenOrderProduct> = ArrayList(),
    var delicatessenOrderTrackings: MutableList<DelicatessenOrderTracking> = ArrayList(),
    var establishmentBrandCreditId: Int? = null,
    var establishmentBrandDebitId: Int? = null,
    var establishmentBrandCredit: EstablishmentBrandCredit? = null,
    var establishmentBrandDebit: EstablishmentBrandDebit? = null,
    var coupon: Coupon? = null,
)