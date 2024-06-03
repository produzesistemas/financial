package com.br.app.deliverydelicatessen.utils

import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import com.br.app.deliverydelicatessen.viewmodel.ViewModelViaCep
import java.util.*

class TextWatcherViaCep internal constructor(editTextValue: EditText, viewModelViaCepDetail: ViewModelViaCep) : TextWatcher {
 private val mEditTextValue = editTextValue
 private val mViewModelViaCepDetail = viewModelViaCepDetail
    override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

    }

    override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

    }

    override fun afterTextChanged(p0: Editable?) {

        mEditTextValue.removeTextChangedListener(this)
        if (p0 != null) {
            if (p0.filterNot { it === '-' }.trim().length === 8) {
                getAddressByCep(p0!!.filterNot { it === '-' }.trim() as String)
            }
        }
        mEditTextValue.addTextChangedListener(this)
    }

    private fun getAddressByCep(cep: String) {
        mViewModelViaCepDetail.getAddressByCep(cep)
    }
}