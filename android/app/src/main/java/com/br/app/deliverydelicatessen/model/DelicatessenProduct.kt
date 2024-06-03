package com.br.app.deliverydelicatessen.model

data class DelicatessenProduct(
    var imageName: String = "",
    var description: String = "",
    var detail: String = "",
    var code: String = "",
    var active: Boolean = false,
    var promotion: Boolean = false,
    var establishmentId: Int = 0,
    var categoryId: Int = 0,
    var value: Double? = 0.00,
    var promotionValue: Double? = 0.00,
    var id: Int = 0)