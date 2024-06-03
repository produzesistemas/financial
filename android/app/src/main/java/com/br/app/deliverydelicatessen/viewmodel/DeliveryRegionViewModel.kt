package com.br.app.deliverydelicatessen.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.DeliveryRegion
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.DeliveryRegionRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*
import java.net.UnknownHostException

class DeliveryRegionViewModel constructor() : ViewModel() {

    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val deliveryRegionRepository = DeliveryRegionRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()

    var job: Job? = null

    val loading = MutableLiveData<Boolean>()
    val complete = MutableLiveData<Boolean>()
    val deliveryRegion = MutableLiveData<DeliveryRegion>()

    fun getAvailability(filter: DeliveryRegion) {
        try {
            loading.value = true
            viewModelScope.launch {
                when (val response = deliveryRegionRepository.getAvailability(filter)) {
                    is NetworkState.Success -> {
                        loading.value = false
                        deliveryRegion.value = response.data!!
                    }
                    is NetworkState.Error -> {
                        if (response.response.code() == 400) {
                            loading.value = false
                            onError(response.response.errorBody()!!.string(), 400)
                        }
                        if (response.response.code() == 401) {
                            loading.value = false
                            onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401)
                        }
                        if (response.response.code() == 503) {
                            loading.value = false
                            onError("", 503)
                        }
                    }
                }
            }
        }  catch (e: UnknownHostException) {
        e.message?.let { Log.e("Exception: %s", it) }
    }

    }



    private fun onError(message: String, code: Int) {
        responseBody.code = code
        responseBody.message = message
        _errorMessage.postValue(responseBody)
        loading.value = false
    }

    override fun onCleared() {
        super.onCleared()
        job?.cancel()
    }

}