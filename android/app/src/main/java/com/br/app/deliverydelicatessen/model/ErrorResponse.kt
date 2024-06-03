package com.br.app.deliverydelicatessen.model

import com.fasterxml.jackson.annotation.JsonProperty

data class ErrorResponse(
    @JsonProperty("Message") val Message: String,
    @JsonProperty("Code") val Code: Int
)