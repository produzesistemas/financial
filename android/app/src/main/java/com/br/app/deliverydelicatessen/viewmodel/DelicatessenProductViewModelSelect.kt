package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.model.ShoppingCart
import com.br.app.deliverydelicatessen.utils.Event

class DelicatessenProductViewModelSelect : ViewModel() {
    val selected = MutableLiveData<Event<DelicatessenProduct>>()
    fun select(item: DelicatessenProduct) {
        selected.value = Event(item)
    }


}