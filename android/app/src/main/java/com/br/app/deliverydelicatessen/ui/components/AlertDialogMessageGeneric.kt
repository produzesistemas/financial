package com.br.app.deliverydelicatessen.ui.components

import android.app.Dialog
import android.os.Bundle
import android.view.*
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.DialogFragment
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.FragmentAlertdialogMessageBinding

class AlertDialogMessageGeneric (private val title: String, private val message: String
)  : DialogFragment() {

    private lateinit var binding: FragmentAlertdialogMessageBinding
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(
                inflater,
                R.layout.fragment_alertdialog_message,
                container,
                false
        )
        binding.textViewTitle.text = title
        binding.textViewMessage.text = message
        binding.btnConfirm.setOnClickListener {
            dismiss()
        }
        return binding.root
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val dialog = super.onCreateDialog(savedInstanceState)
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        return dialog
    }

    override fun onResume() {
        // Get existing layout params for the window
        val params: ViewGroup.LayoutParams = dialog!!.window!!.attributes
        // Assign window properties to fill the parent
        params.width = WindowManager.LayoutParams.MATCH_PARENT
        params.height = WindowManager.LayoutParams.WRAP_CONTENT
        dialog!!.window!!.attributes = params as WindowManager.LayoutParams
        dialog!!.window?.setBackgroundDrawableResource(R.drawable.custom_dialog_fragment)
        super.onResume()
    }

}