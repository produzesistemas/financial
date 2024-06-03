package com.br.app.deliverydelicatessen.model

data class Address(
    var id: Int = 0,
    var establishmentId: Int? = 0,
    var street: String = "",
                   var reference: String = "",
                   var postalCode: String = "",
                   var district: String = "",
                    var city: String = "",
                   var uf: String = ""){
    constructor():this(0,null,"","","","", "", "")

}
