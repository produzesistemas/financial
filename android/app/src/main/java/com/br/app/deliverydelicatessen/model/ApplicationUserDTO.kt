package com.br.app.deliverydelicatessen.model

data class ApplicationUserDTO (
    var phone: String,
    var name: String,
    var cpf: String,
    var token: String,
    var email: String)