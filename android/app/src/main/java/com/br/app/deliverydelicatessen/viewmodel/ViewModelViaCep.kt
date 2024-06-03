package com.br.app.deliverydelicatessen.viewmodel
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.AddressViaCep
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.ViaCepRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitViaCep
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*

class ViewModelViaCep constructor() : ViewModel() {
    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitViaCep.getInstance()
    private val _repository = ViaCepRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()

    val entity = MutableLiveData<AddressViaCep>()
    var job: Job? = null

    val loading = MutableLiveData<Boolean>()
    val complete = MutableLiveData<Boolean>()

    fun getAddressByCep(cep: String) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getAddressByCep(cep)) {
                is NetworkState.Success -> {
                    entity.postValue(response.data!!)
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

    fun setCompleteFalse() {
        complete.value = false
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