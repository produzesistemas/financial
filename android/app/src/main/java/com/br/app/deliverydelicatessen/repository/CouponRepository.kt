package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.Coupon
import com.br.app.deliverydelicatessen.model.DeliveryRegion
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState


class CouponRepository constructor(private val retrofitService: RetrofitService) {

     suspend fun getByCode(token: String, filter: Coupon) : NetworkState<Coupon?> {
        val response = retrofitService.getByCode(token,filter)
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