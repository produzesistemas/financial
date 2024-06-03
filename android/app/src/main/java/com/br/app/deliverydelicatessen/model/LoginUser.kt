package com.br.app.deliverydelicatessen.model

data class LoginUser(val email: String,
                     val code: String,
                     var phone: String,
                     var name: String,
                     var cpf: String
)