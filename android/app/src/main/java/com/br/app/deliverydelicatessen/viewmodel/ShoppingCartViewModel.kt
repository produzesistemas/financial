package com.br.app.deliverydelicatessen.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.utils.Event

class ShoppingCartViewModel : ViewModel() {

    val update = MutableLiveData<Event<Double>>()
    val go = MutableLiveData<Event<Boolean>>()
    val goBack = MutableLiveData<Event<Boolean>>()
    val clear = MutableLiveData<Event<Boolean>>()

    fun updateValue(_value: Double) {
        update.value = Event(_value)
    }

    fun onShoppingCart(_value: Boolean) {
        go.value = Event(_value)
    }

    fun onClear(_value: Boolean) {
        clear.value = Event(_value)
        goBack.value = Event(_value)
    }
}