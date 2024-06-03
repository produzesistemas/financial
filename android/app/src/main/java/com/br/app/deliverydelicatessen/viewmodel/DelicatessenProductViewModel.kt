package com.br.app.deliverydelicatessen.viewmodel
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.DelicatessenProductRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*

class DelicatessenProductViewModel constructor() : ViewModel() {
    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val _repository = DelicatessenProductRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()
    var job: Job? = null
    val delicatessenProducts = MutableLiveData<List<DelicatessenProduct>>()
    val loading = MutableLiveData<Boolean>()

    fun getByCategory(filter: DelicatessenProduct) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getByCategory(filter)) {
                is NetworkState.Success -> {
                    delicatessenProducts.postValue(response.data!!)
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

    fun getByDescription(filter: DelicatessenProduct) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getByDescription(filter)) {
                is NetworkState.Success -> {
                    delicatessenProducts.postValue(response.data!!)
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400, 1)
                    }
                }
            }
        }
    }

    fun getPromotions(filter: DelicatessenProduct) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getPromotions(filter)) {
                is NetworkState.Success -> {
                    delicatessenProducts.postValue(response.data!!)
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