package com.br.app.deliverydelicatessen.model

data class AddressViaCep(var logradouro: String = "",
                         var complemento: String = "",
                         var bairro: String = "",
                         var localidade: String = "",
                         var uf: String = ""){
    constructor():this("","","","","")

}
