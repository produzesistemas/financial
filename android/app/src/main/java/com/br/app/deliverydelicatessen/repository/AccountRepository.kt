package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.*
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class AccountRepository constructor(private val retrofitService: RetrofitService) {

    suspend fun getAccount(token: String) : NetworkState<ApplicationUserDTO?> {
        val response = retrofitService.getAccount(token)
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

   suspend fun save(token: String, loginUser: LoginUser) : NetworkState<Any> {
        val response = retrofitService.updateAccount(token, loginUser)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(loginUser)
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }


}