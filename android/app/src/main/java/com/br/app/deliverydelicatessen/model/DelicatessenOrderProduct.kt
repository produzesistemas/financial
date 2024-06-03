package com.br.app.deliverydelicatessen.model

data class DelicatessenOrderProduct(
    var delicatessenOrderId: Int = 0,
    var delicatessenProductId: Int = 0,
    var id: Int = 0,
    var value: Double = 0.00,
    var quantity: Double = 0.00,
    var delicatessenProduct: DelicatessenProduct? = null,
) {
}