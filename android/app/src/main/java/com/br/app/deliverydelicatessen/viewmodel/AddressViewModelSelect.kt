package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.utils.Event

class AddressViewModelSelect : ViewModel() {
    val saveOrUpdate = MutableLiveData<Event<Address>>()
    val selected = MutableLiveData<Event<Address>>()
    fun toSaveOrUpdate(item: Address) {
        saveOrUpdate.value = Event(item)
    }

    fun select(item: Address) {
        selected.value = Event(item)
    }


}