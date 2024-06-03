package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.*
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class DelicatessenProductRepository constructor(private val retrofitService: RetrofitService) {

    suspend fun getByCategory(filter: DelicatessenProduct) : NetworkState<List<DelicatessenProduct>> {
        val response = retrofitService.getByCategory(filter)
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

    suspend fun getByDescription(filter: DelicatessenProduct) : NetworkState<List<DelicatessenProduct>> {
        val response = retrofitService.getByDescription(filter)
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

    suspend fun getPromotions(filter: DelicatessenProduct) : NetworkState<List<DelicatessenProduct>> {
        val response = retrofitService.getPromotions(filter)
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