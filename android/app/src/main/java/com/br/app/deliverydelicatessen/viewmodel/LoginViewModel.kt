package com.br.app.deliverydelicatessen.viewmodel
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.ApplicationUserDTO
import com.br.app.deliverydelicatessen.model.GoogleUser
import com.br.app.deliverydelicatessen.model.LoginUser
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.repository.LoginRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.Event
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*
class LoginViewModel constructor() : ViewModel() {

    private val _errorMessage = MutableLiveData<ResponseBody>()
    private val _errorMessageRegister = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    val errorMessageRegister: LiveData<ResponseBody>
        get() = _errorMessageRegister

    private val retrofitService = RetrofitService.getInstance()
    private val loginRepository = LoginRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()
    var job: Job? = null

    val loading = MutableLiveData<Boolean>()
    val token = MutableLiveData<ApplicationUserDTO>()
    val newToken = MutableLiveData<Event<ApplicationUserDTO>>()
    val tokenCoupon = MutableLiveData<Event<ApplicationUserDTO>>()
    val completeRegister = MutableLiveData<Boolean>()
    val msgRegister = MutableLiveData<String>()

    fun registerClientByEmail(loginUser: LoginUser) {
        loading.value = true
        viewModelScope.launch {
            when (val response = loginRepository.registerClientByEmail(loginUser)) {
                is NetworkState.Success -> {
                    loading.value = false
                    msgRegister.value = response.data!!
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onErrorRegister(response.response.errorBody()!!.string(), 400)
                    }
                    if (response.response.code() == 503) {
                        loading.value = false
                        onErrorRegister("", 503)
                    }
                }
            }
        }
    }

    fun loginByCode(loginUser: LoginUser) {
        loading.value = true
        viewModelScope.launch {
            when (val response = loginRepository.loginByCode(loginUser)) {
                is NetworkState.Success -> {
                    token.value = response.data!!
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400)
                    }
                }
            }
        }
    }

    fun registerGoogle(googleUser: GoogleUser) {
        loading.value = true
        viewModelScope.launch {
            when (val response = loginRepository.registerGoogle(googleUser)) {
                is NetworkState.Success -> {
                    token.value = response.data!!
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400)
                    }
                }
            }
        }
    }

    fun refreshToken(accessToken: String) {
        var withOutSpaces = accessToken.replace("bearer", "").filterNot { it.isWhitespace() }
        loading.value = true
        viewModelScope.launch {
            when (val response = loginRepository.refreshToken(withOutSpaces)) {
                is NetworkState.Success -> {
                    loading.value = false
                    newToken.value = Event(response.data!!)
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400)
                    }
                    if (response.response.code() == 503) {
                        loading.value = false
                        onErrorRegister("", 503)
                    }
                }
            }
        }
    }

    fun refreshTokenCoupon(accessToken: String) {
        var withOutSpaces = accessToken.replace("bearer", "").filterNot { it.isWhitespace() }
        loading.value = true
        viewModelScope.launch {
            when (val response = loginRepository.refreshToken(withOutSpaces)) {
                is NetworkState.Success -> {
                    loading.value = false
                    tokenCoupon.value = Event(response.data!!)
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400)
                    }
                    if (response.response.code() == 503) {
                        loading.value = false
                        onErrorRegister("", 503)
                    }
                }
            }
        }
    }


    fun closeRegister() {
        completeRegister.value = true
    }


    private fun onError(message: String, code: Int) {
        responseBody.code = code
        responseBody.message = message
        _errorMessage.postValue(responseBody)
        loading.value = false
    }

    private fun onErrorRegister(message: String, code: Int) {
        responseBody.code = code
        responseBody.message = message
        _errorMessageRegister.postValue(responseBody)
        loading.value = false
    }

    override fun onCleared() {
        super.onCleared()
        job?.cancel()
    }

}