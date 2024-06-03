package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.*
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class DelicatessenOrderRepository constructor(private val retrofitService: RetrofitService) {

    suspend fun save(token: String, delicatessenOrder: DelicatessenOrder) : NetworkState<Any> {
        val response = retrofitService.saveDelicatessenOrder(token, delicatessenOrder)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(delicatessenOrder)
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }

    suspend fun getAllOrders(token: String, delicatessenOrder: DelicatessenOrder) : NetworkState<List<DelicatessenOrder>> {
        val response = retrofitService.getAllOrdersByUser(token, delicatessenOrder)
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

    suspend fun getDelicatessenOrderById(id: Int) : NetworkState<DelicatessenOrder> {
        val response = retrofitService.getDelicatessenOrderById(id)
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

    suspend fun cancelByClient(token: String, delicatessenOrder: DelicatessenOrder) : NetworkState<Any> {
        val response = retrofitService.cancelByClient(token, delicatessenOrder)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(delicatessenOrder)
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }
}