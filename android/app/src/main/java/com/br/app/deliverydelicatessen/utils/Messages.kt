package com.br.app.deliverydelicatessen.utils

import android.app.Activity
import android.view.Gravity
import android.widget.TextView
import android.widget.Toast
import com.br.app.deliverydelicatessen.R


object Messages {

    fun Toast.success(message: String, activity: Activity)
    {
        val layout = activity.layoutInflater.inflate (
            R.layout.custom_toast_success,
            activity.findViewById(R.id.cl_customToastContainer)
        )

        val textView = layout.findViewById<TextView>(R.id.textViewMessage)
        textView.text = message

        this.apply {
            setGravity(Gravity.CENTER, 0, 40)
            duration = Toast.LENGTH_LONG
            view = layout
            show()
        }
    }

    fun Toast.error(message: String, activity: Activity)
    {
        val layout = activity.layoutInflater.inflate (
            R.layout.custom_toast_error,
            activity.findViewById(R.id.cl_customToastContainer)
        )

        val textView = layout.findViewById<TextView>(R.id.textViewMessage)
        textView.text = message

        this.apply {
            setGravity(Gravity.CENTER, 0, 40)
            duration = Toast.LENGTH_LONG
            view = layout
            show()
        }
    }


}