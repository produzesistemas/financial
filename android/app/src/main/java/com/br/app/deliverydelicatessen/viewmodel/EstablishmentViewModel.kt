package com.br.app.deliverydelicatessen.viewmodel
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.br.app.deliverydelicatessen.model.Establishment
import com.br.app.deliverydelicatessen.model.EstablishmentBrandCredit
import com.br.app.deliverydelicatessen.model.EstablishmentBrandDebit
import com.br.app.deliverydelicatessen.model.ResponseBody
import com.br.app.deliverydelicatessen.repository.EstablishmentRepository
import com.br.app.deliverydelicatessen.retrofit.RetrofitService
import com.br.app.deliverydelicatessen.utils.NetworkState
import kotlinx.coroutines.*

class EstablishmentViewModel constructor() : ViewModel() {
    private val _errorMessage = MutableLiveData<ResponseBody>()
    val errorMessage: LiveData<ResponseBody>
        get() = _errorMessage

    private val retrofitService = RetrofitService.getInstance()
    private val _repository = EstablishmentRepository(retrofitService)
    private var responseBody: ResponseBody = ResponseBody()

    val entity = MutableLiveData<Establishment>()
    val lstCredit = MutableLiveData<List<EstablishmentBrandCredit>>()
    val lstDebit = MutableLiveData<List<EstablishmentBrandDebit>>()
    var job: Job? = null

    val loading = MutableLiveData<Boolean>()

    fun getEstablishmentById(id: Int) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getEstablishmentById(id)) {
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

    fun getEstablishmentBrandCredit(establishmentBrandCredit: EstablishmentBrandCredit) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getEstablishmentBrandCredit(establishmentBrandCredit)) {
                is NetworkState.Success -> {
                    lstCredit.postValue(response.data!!)
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

    fun getEstablishmentBrandDebit(establishmentBrandDebit: EstablishmentBrandDebit) {
        loading.value = true
        viewModelScope.launch {
            Log.d("Thread Inside", Thread.currentThread().name)
            when (val response = _repository.getEstablishmentBrandDebit(establishmentBrandDebit)) {
                is NetworkState.Success -> {
                    lstDebit.postValue(response.data!!)
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