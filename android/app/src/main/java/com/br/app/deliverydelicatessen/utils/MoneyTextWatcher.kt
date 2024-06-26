package com.br.app.deliverydelicatessen.utils

import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText
import java.math.BigDecimal
import java.text.NumberFormat
import java.util.*

class MoneyTextWatcher internal constructor(editTextValue: EditText, mLocale: Locale) : TextWatcher {
 private val mEditTextValue = editTextValue
    val locale = mLocale

    override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

    }

    override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

    }

    override fun afterTextChanged(p0: Editable?) {

        mEditTextValue.removeTextChangedListener(this)

        var vl: String = p0.toString().trim()
        vl = vl.replace(".", "")
        vl = vl.replace(",", ".")
        vl = vl.replace("\\s".toRegex(), "")

        val parsed = parseToBigDecimal(vl, locale!!)
        var formatted = NumberFormat.getCurrencyInstance(locale).format(parsed)

        formatted = formatted.replace("R$", "")

        mEditTextValue.setText(formatted)
        mEditTextValue.setSelection(formatted.length)
        mEditTextValue.addTextChangedListener(this)
    }

    private fun parseToBigDecimal(value: String, locale: Locale): BigDecimal? {
        val replaceable = String.format("[%s,.\\s]", NumberFormat.getCurrencyInstance(locale).currency.symbol)
        val cleanString = value.replace(replaceable.toRegex(), "")
        return BigDecimal(cleanString).setScale(
                2, BigDecimal.ROUND_FLOOR).divide(BigDecimal(100), BigDecimal.ROUND_FLOOR
        )
    }
}