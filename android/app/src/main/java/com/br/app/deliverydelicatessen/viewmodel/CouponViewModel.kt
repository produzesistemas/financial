package com.br.app.deliverydelicatessen.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.Coupon
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.CouponRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*
class CouponViewModel constructor() : ViewModel() {

    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val couponRepository = CouponRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()

    var job: Job? = null

    val loading = MutableLiveData<Boolean>()
    val complete = MutableLiveData<Boolean>()
    val coupon = MutableLiveData<Coupon?>()

    fun getByCode(token:String,filter: Coupon) {
        loading.value = true
        viewModelScope.launch {
            when (val response = couponRepository.getByCode(token,filter)) {
                is NetworkState.Success -> {
                    loading.value = false
                    coupon.value = response.data!!
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
                    if (response.response.code() == 200) {
                        loading.value = false
                        onError("", 200)
                    }
                }
            }
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