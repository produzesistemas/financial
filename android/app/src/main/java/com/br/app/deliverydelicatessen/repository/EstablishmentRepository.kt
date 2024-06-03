package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.Establishment
import com.br.app.deliverydelicatessen.model.EstablishmentBrandCredit
import com.br.app.deliverydelicatessen.model.EstablishmentBrandDebit
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class EstablishmentRepository constructor(private val retrofitService: RetrofitService) {

    suspend fun getEstablishmentById(id: Int) : NetworkState<Establishment> {
        val response = retrofitService.getEstablishmentById(id)
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

    suspend fun getEstablishmentBrandCredit(establishmentBrandCredit: EstablishmentBrandCredit) : NetworkState<List<EstablishmentBrandCredit>> {
        val response = retrofitService.getEstablishmentBrandCredit(establishmentBrandCredit)
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

    suspend fun getEstablishmentBrandDebit(establishmentBrandDebit: EstablishmentBrandDebit) : NetworkState<List<EstablishmentBrandDebit>> {
        val response = retrofitService.getEstablishmentBrandDebit(establishmentBrandDebit)
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