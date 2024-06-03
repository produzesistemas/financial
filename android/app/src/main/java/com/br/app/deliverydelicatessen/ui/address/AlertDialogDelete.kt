package com.br.app.deliverydelicatessen.ui.address

import android.app.Dialog
import android.os.Bundle
import android.view.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.lifecycleScope
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentAlertdialogDeleteBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch

class AlertDialogDelete (private var viewModel: AddressViewModel, private val address: Address
)  : DialogFragment() {

    private lateinit var binding: FragmentAlertdialogDeleteBinding
    private var datasource: DataSourceUser? = null
    private var user: User = User()
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(
                inflater,
                R.layout.fragment_alertdialog_delete,
                container,
                false
        )
        datasource = context?.let { DataSourceUser(it) }
        user = datasource?.get()!!
        binding.textViewMessage.text = address.street
        binding.btnConfirm.setOnClickListener {
            if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
                delete(address)
                dismiss()
            } else {
                view?.let {v ->
                    MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
                }
            }
        }
        binding.btnCancel.setOnClickListener {
            dismiss()
        }
        return binding.root
    }

    private fun delete(address: Address) {
        lifecycleScope.launch {
            viewModel.delete(address, user.token)
        }
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

        dialog!!.getWindow()?.setBackgroundDrawableResource(R.drawable.custom_dialog_fragment);
        // Call super onResume after sizing
        super.onResume()
    }

}