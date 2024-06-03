package com.br.app.deliverydelicatessen.model

import java.util.ArrayList

data class CategoryDTO(
    var establishmentId: Int = 0,
    var imageName: String = "",
    var categorys: MutableList<Category> = ArrayList(),
    var openingHours: MutableList<OpeningHours> = ArrayList()
)