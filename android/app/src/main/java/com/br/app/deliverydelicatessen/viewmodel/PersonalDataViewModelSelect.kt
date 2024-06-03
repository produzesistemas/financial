package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.ApplicationUserDTO
import com.br.app.deliverydelicatessen.utils.Event

class PersonalDataViewModelSelect : ViewModel() {
    val selected = MutableLiveData<Event<ApplicationUserDTO>>()
    fun select(item: ApplicationUserDTO) {
        selected.value = Event(item)
    }


}