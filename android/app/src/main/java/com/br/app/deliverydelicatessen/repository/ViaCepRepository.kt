package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.AddressViaCep
import com.br.app.deliverydelicatessen.retrofit.RetrofitViaCep
import com.br.app.deliverydelicatessen.utils.NetworkState


class ViaCepRepository constructor(private val retrofitService: RetrofitViaCep) {

    suspend fun getAddressByCep(cep: String) : NetworkState<AddressViaCep> {
        val response = retrofitService.getAddressByCep(cep)
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