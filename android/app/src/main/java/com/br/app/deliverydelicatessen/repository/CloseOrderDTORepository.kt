package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.CloseOrderDTO
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class CloseOrderDTORepository constructor(private val retrofitService: RetrofitService) {

    suspend fun getCloseOrderDTO(token: String, closeOrderDTO: CloseOrderDTO) : NetworkState<CloseOrderDTO> {
        val response = retrofitService.getCloseOrderDTO(token, closeOrderDTO)
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