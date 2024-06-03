package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.*
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class AddressRepository constructor(private val retrofitService: RetrofitService) {

//    suspend fun getLastAddress(token: String, deliveryRegion: DeliveryRegion) : NetworkState<Address?> {
//        val response = retrofitService.getLastAddress(token, deliveryRegion)
//        return if (response.isSuccessful) {
//            val responseBody = response.body()
//            if (responseBody != null) {
//                NetworkState.Success(responseBody)
//            } else {
//                NetworkState.Error(response)
//            }
//        } else {
//            NetworkState.Error(response)
//        }
//    }

    suspend fun getAllAddress(token: String) : NetworkState<List<Address>> {
        val response = retrofitService.getAllAddress(token)
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

    suspend fun save(token: String, address: Address) : NetworkState<Any> {
        val response = retrofitService.saveAddress(token, address)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(address)
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }

    suspend fun delete(token: String, address: Address) : NetworkState<Any> {
        val response = retrofitService.deleteAddress(token, address)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(address)
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }

}