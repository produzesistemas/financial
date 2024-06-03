package com.br.app.deliverydelicatessen.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.DelicatessenOrder
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.DelicatessenOrderRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.Event
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*

class DelicatessenOrderViewModel constructor() : ViewModel() {
    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val _repository = DelicatessenOrderRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()
    var job: Job? = null
    val loading = MutableLiveData<Boolean>()
    val complete = MutableLiveData<Event<Boolean>>()

    val orders = MutableLiveData<List<DelicatessenOrder>>()
    val order = MutableLiveData<DelicatessenOrder>()
    fun save(delicatessenOrder: DelicatessenOrder, token: String) {
        loading.value = true
        viewModelScope.launch {
            when (val response = _repository.save(token, delicatessenOrder)) {
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

    fun cancelByClient(delicatessenOrder: DelicatessenOrder, token: String) {
        loading.value = true
        viewModelScope.launch {
            when (val response = _repository.cancelByClient(token, delicatessenOrder)) {
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

    fun getAllOrders(token: String, delicatessenOrder: DelicatessenOrder) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getAllOrders(token, delicatessenOrder)) {
                is NetworkState.Success -> {
                    orders.postValue(response.data!!)
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400, 1)
                    }
                    if (response.response.code() == 401) {
                        loading.value = false
                        onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401, 1)
                    }
                }
            }
        }
    }

    fun getDelicatessenOrderById(id: Int) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getDelicatessenOrderById(id)) {
                is NetworkState.Success -> {
                    order.postValue(response.data!!)
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 401) {
                        loading.value = false
                        onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401, 5)
                    }

                    if (response.response.code() == 400) {
                        loading.value = false
                        onError("Falha na tentativa.", 400, 5)
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