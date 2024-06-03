package com.br.app.deliverydelicatessen.viewmodel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.EstablishmentBrandCredit
import com.br.app.deliverydelicatessen.model.EstablishmentBrandDebit
import com.br.app.deliverydelicatessen.utils.Event

class BrandViewModelSelect : ViewModel() {
    val selectedCredit = MutableLiveData<Event<EstablishmentBrandCredit>>()
    val selectedDebit = MutableLiveData<Event<EstablishmentBrandDebit>>()
    fun selectCredit(item: EstablishmentBrandCredit) {
        selectedCredit.value = Event(item)
    }

    fun selectDebit(item: EstablishmentBrandDebit) {
        selectedDebit.value = Event(item)
    }


}