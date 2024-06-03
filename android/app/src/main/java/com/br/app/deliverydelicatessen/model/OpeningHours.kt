package com.br.app.deliverydelicatessen.model

import java.util.*

data class OpeningHours(
    var startTime: String = "",
    var endTime: String = "",
    var weekday: Int = 0,
    var active: Boolean = false,
    var applicationUserId: String = "",
    var establishmentId: Int = 0,
    var createDate: Date = Date(),
    var id: Int = 0)