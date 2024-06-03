package com.br.app.deliverydelicatessen.model

data class EstablishmentBrandDebit(
    var active: Boolean = false,
    var establishmentId: Int = 0,
    var brandId: Int = 0,
    var id: Int = 0,
    var brand: Brand? = null)