package com.br.app.deliverydelicatessen.model

data class PaymentCondition (
    var description: String = "",
    var id: Int = 0) {
    constructor():this("")

    override fun toString(): String {
        return description
    }
}