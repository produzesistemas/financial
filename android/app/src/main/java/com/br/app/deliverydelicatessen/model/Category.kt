package com.br.app.deliverydelicatessen.model

data class Category(
    var description: String = "",
    var active: Boolean = false,
    var imageName: String = "",
    var establishmentId: Int = 0,
    var id: Int = 0)