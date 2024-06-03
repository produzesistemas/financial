package com.br.app.deliverydelicatessen.model

data class Establishment(
    var name: String = "",
    var cnpj: String = "",
    var description: String = "",
    var address: String = "",
    var phone: String = "",
    var instorePickup: Boolean? = null,
    var delivery: Boolean? = null,
    var paymentOnLine: Boolean? = null,
    var paymentLittleMachine: Boolean? = null,
    var paymentMoney: Boolean? = null,
    var minimumValue: Double? = null)
