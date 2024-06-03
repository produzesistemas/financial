package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.DelicatessenOrder
import com.br.app.deliverydelicatessen.utils.Event

class DelicatessenOrderViewModelSelect : ViewModel() {
    val selected = MutableLiveData<Event<DelicatessenOrder>>()
    fun select(item: DelicatessenOrder) {
        selected.value = Event(item)
    }


}