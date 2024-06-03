package com.br.app.deliverydelicatessen.model

data class User(
    var token: String = "",
    var phone: String? = null,
    var email: String = "",
    var userName: String? = null,
    var cpf: String? = null)