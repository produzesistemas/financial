package com.br.app.deliverydelicatessen.model

data class CloseOrderDTO(
    var postalCode: String = "",
    var establishmentId: Int = 0,
    var deliveryRegion: DeliveryRegion? = null,
    var address: Address? = null,
    var applicationUserDTO: ApplicationUserDTO? = null,
    var establishment: Establishment? = null,
)