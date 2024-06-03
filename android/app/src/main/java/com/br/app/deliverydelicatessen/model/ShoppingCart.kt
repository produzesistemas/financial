package com.br.app.deliverydelicatessen.model

data class ShoppingCart(
    var imageName: String = "",
    var description: String = "",
    var obs: String = "",
    var quantity: Double? = 0.00,
    var delicatessenProductId: Int = 0,
    var value: Double = 0.00)