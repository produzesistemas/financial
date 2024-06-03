package com.br.app.deliverydelicatessen.model

import java.util.Date

data class DelicatessenOrderTracking(
    var delicatessenOrderId: Int = 0,
    var statusOrderId: Int = 0,
    var followupDate: Date? = null,
    var statusOrder: StatusOrder? = null,
) {
}