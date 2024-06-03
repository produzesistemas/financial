package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.ApplicationUserDTO
import com.br.app.deliverydelicatessen.model.LoginUser
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.AccountRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.Event
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*

class AccountViewModel constructor() : ViewModel() {
    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val _repository = AccountRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()
    val account = MutableLiveData<ApplicationUserDTO?>()
    var job: Job? = null
    val loading = MutableLiveData<Boolean>()
    val complete = MutableLiveData<Event<Boolean>>()

    fun getAccount(token: String) {
        loading.value = true
        viewModelScope.launch {
            when (val response = _repository.getAccount(token)) {
                is NetworkState.Success -> {
                    account.postValue(response.data!!)
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 401) {
                        loading.value = false
                        onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401, 1)
                    }

                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400, 1)
                    }
                }
            }
        }
    }

    fun save(loginUser: LoginUser, token: String) {
        loading.value = true
        viewModelScope.launch {
            when (val response = _repository.save(token, loginUser)) {
                is NetworkState.Success -> {
                    complete.value = Event(true)
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 401) {
                        loading.value = false
                        onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401, 1)
                    }

                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400, 1)
                    }

                }
            }
        }
    }
    private fun onError(message: String, code: Int, operation: Int) {
        responseBody.code = code
        responseBody.message = message
        responseBody.operation = operation
        _errorMessage.postValue(responseBody)
        loading.value = false
    }

    override fun onCleared() {
        super.onCleared()
        job?.cancel()
    }


}