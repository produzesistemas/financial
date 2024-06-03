package com.br.app.deliverydelicatessen.model

import java.util.ArrayList
import java.util.Date

data class Coupon(
    var code: String = "",
    var description: String = "",
    var value: Double = 0.00,
    var minimumValue: Double = 0.00,
    var establishmentId: Int = 0,
    var quantity: Int = 0,
    var id: Int = 0,
    var type: Boolean = false,
    var main: Boolean? = null,
    var active: Boolean = false,
    var general: Boolean = false,
    var initialDate: Date? = null,
    var finalDate: Date? = null,
    var clientId: String = ""
)