package com.br.app.deliverydelicatessen.viewmodel
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.CategoryDTO
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.model.DeliveryRegion
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.AddressRepository
import com.br.app.deliverydelicatessen.repository.CategoryRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.Event
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*

class AddressViewModel constructor() : ViewModel() {
    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val _repository = AddressRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()
    val lastAddress = MutableLiveData<Address?>()
    val lstAddress = MutableLiveData<List<Address>>()
    var job: Job? = null
    val loading = MutableLiveData<Boolean>()
    val complete = MutableLiveData<Boolean>()
    val deleted = MutableLiveData<Boolean>()

//    fun getLastAddress(token: String, deliveryRegion: DeliveryRegion) {
//        loading.value = true
//        viewModelScope.launch {
//            Log.d("Thread Inside", Thread.currentThread().name)
//            when (val response = _repository.getLastAddress(token, deliveryRegion)) {
//                is NetworkState.Success -> {
//                    lastAddress.postValue(response.data!!)
//                    loading.value = false
//                }
//                is NetworkState.Error -> {
//                    if (response.response.code() == 200) {
//                        loading.value = false
//                        lastAddress.postValue(null)
//                    }
//
//                    if (response.response.code() == 401) {
//                        loading.value = false
//                        onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401, 1)
//                    }
//
//                    if (response.response.code() == 400) {
//                        loading.value = false
//                        onError(response.response.errorBody()!!.string(), 400, 1)
//                    }
//                }
//            }
//        }
//    }

    fun save(newAddress: Address, token: String) {
        loading.value = true
        viewModelScope.launch {
            when (val response = _repository.save(token, newAddress)) {
                is NetworkState.Success -> {
                    complete.value = true
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

    fun getAddress(token: String) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getAllAddress(token)) {
                is NetworkState.Success -> {
                    lstAddress.postValue(response.data!!)
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

    fun delete(address: Address, token: String) {
        loading.value = true
        viewModelScope.launch {
            when (val response = _repository.delete(token, address)) {
                is NetworkState.Success -> {
                    deleted.value = true
                    loading.value = false
                }
                is NetworkState.Error -> {
                    if (response.response.code() == 401) {
                        loading.value = false
                        onError("Sessão expirada! Para sua segurança efetue novamente o login.", 401, 2)
                    }

                    if (response.response.code() == 400) {
                        loading.value = false
                        onError(response.response.errorBody()!!.string(), 400, 2)
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