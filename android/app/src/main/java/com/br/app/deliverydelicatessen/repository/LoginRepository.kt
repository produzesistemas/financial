package com.br.app.deliverydelicatessen.repository

import com.br.app.deliverydelicatessen.model.ApplicationUserDTO
import com.br.app.deliverydelicatessen.model.GoogleUser
import com.br.app.deliverydelicatessen.model.LoginUser
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState

class LoginRepository constructor(private val retrofitService: RetrofitService) {

    suspend fun registerClientByEmail(loginUser: LoginUser) : NetworkState<String?> {
        val response = retrofitService.registerClientByEmail(loginUser)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(response.body())
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }

    suspend fun loginByCode(loginUser: LoginUser) : NetworkState<ApplicationUserDTO> {
        val response = retrofitService.loginByCode(loginUser)
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

    suspend fun registerGoogle(googleUser: GoogleUser) : NetworkState<ApplicationUserDTO> {
        val response = retrofitService.registerGoogle(googleUser)
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

    suspend fun refreshToken(accessToken: String) : NetworkState<ApplicationUserDTO?> {
        val loginUser = LoginUser("",accessToken,"","", "")
        val response = retrofitService.refreshToken(loginUser)
        return if (response.isSuccessful) {
            if (response.code() == 200) {
                NetworkState.Success(response.body())
            } else {
                NetworkState.Error(response)
            }
        } else {
            NetworkState.Error(response)
        }
    }


}