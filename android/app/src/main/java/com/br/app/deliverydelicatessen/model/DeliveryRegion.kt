package com.br.app.deliverydelicatessen.model

data class DeliveryRegion(
    var postalCode: String = "",
    var active: Boolean = false,
    var establishmentId: Int = 0,
    var value: Double? = 0.00,
    var id: Int = 0)