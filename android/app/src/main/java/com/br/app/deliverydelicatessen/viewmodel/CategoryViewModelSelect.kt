package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.Category
import com.br.app.deliverydelicatessen.utils.Event

class CategoryViewModelSelect : ViewModel() {
    val selected = MutableLiveData<Event<Category>>()
    fun select(category: Category) {
        selected.value = Event(category)
    }

}