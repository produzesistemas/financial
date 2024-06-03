package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.DeliveryRegion
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState


class DeliveryRegionRepository constructor(private val retrofitService: RetrofitService) {

     suspend fun getAvailability(filter: DeliveryRegion) : NetworkState<DeliveryRegion> {
        val response = retrofitService.getAvailability(filter)
        return if (response.isSuccessful) {
            val responseBody = response.body()
            if (responseBody != null) {
                NetworkState.Success(responseBody)
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }


}