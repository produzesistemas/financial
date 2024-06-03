package com.br.app.deliverydelicatessen.viewmodel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.br.app.deliverydelicatessen.model.OpeningHours

class MainViewModel : ViewModel() {

    val title: MutableLiveData<String> by lazy {
        MutableLiveData<String>()
    }

    val openingHour: MutableLiveData<OpeningHours> by lazy {
        MutableLiveData<OpeningHours>()
    }

    fun updateActionBarTitle(_title: String) {
        title.postValue(_title)
    }

    fun updateActionBarStatus(oH: OpeningHours?) {
        openingHour.postValue(oH)
    }
}