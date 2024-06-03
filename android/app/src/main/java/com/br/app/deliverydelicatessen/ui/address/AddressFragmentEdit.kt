package com.br.app.deliverydelicatessen.ui.address

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import android.widget.*
import androidx.activity.OnBackPressedCallback
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentAddressNewBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
import java.util.*

class AddressFragmentEdit : Fragment() {
    private lateinit var viewModelAddress: AddressViewModel
    private lateinit var viewModelLogin: LoginViewModel
    private val viewModelSelect: AddressViewModelSelect by activityViewModels()
    private lateinit var binding: FragmentAddressNewBinding
//    private var dataSourceAddress: DataSourceAddress? = null
    private var dataSourceUser: DataSourceUser? = null
    private var datasource: DataSourceConfig? = null
    private var user: User = User()
    private lateinit var config: Config
    private var address: Address = Address()
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_address_new,
            container,
            false
        )

        return binding.root
    }


    @SuppressLint("ResourceType")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setHasOptionsMenu(true)
        dataSourceUser = context?.let { DataSourceUser(it) }
        datasource = context?.let { DataSourceConfig(it) }
//        dataSourceAddress = context?.let { DataSourceAddress(it) }
        user = dataSourceUser?.get()!!
        config = datasource?.get()!!
        viewModelAddress = ViewModelProvider(this)[AddressViewModel::class.java]
        binding.progressBar.visibility = View.GONE

        viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]

        binding.bottomNavView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.navigation_confirm -> {
//                        address.postalCode = binding.textViewCep.text.toString().filterNot { it === '-' }.trim()
                    if (binding.editTextPublicPlace.text.isEmpty()) {
                        binding.editTextPublicPlace?.error =
                            this.resources.getString(R.string.validation_street)
                        binding.editTextPublicPlace?.requestFocus()
                        return@setOnItemSelectedListener true
                    }
                    if (binding.editTextDistrict.text.isEmpty()) {
                        binding.editTextDistrict?.error =
                            this.resources.getString(R.string.validation_district)
                        binding.editTextDistrict?.requestFocus()
                        return@setOnItemSelectedListener true
                    }

                    address.street = binding.editTextPublicPlace.text.toString()
                    address.district = binding.editTextDistrict.text.toString()
                    address.uf = binding.textViewUf.text.toString()
                    address.city = binding.textViewCity.text.toString()
                    address.reference = binding.editTextReference.text.toString()
                    address.establishmentId = config.id
                    insert(address, user.token)

                    return@setOnItemSelectedListener true
                }

            }
            false
        }

        viewModelAddress.errorMessage.observe(viewLifecycleOwner) {
            if (it.code == 401) {
                viewModelLogin.refreshToken(user.token)
            }
            if (it.code == 400) {
                view?.let {v ->
                    MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                }
            }
            enable()
        }

        viewModelLogin.newToken.observe(viewLifecycleOwner) { event ->
            event.getContentIfNotHandled()?.let {
                dataSourceUser?.deleteAll()
                var token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                dataSourceUser?.insert(token)
                user = dataSourceUser?.get()!!
                insert(address, user.token)
            }
        }

        viewModelLogin.loading.observe(viewLifecycleOwner) {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModelAddress.loading.observe(viewLifecycleOwner) {
            if (it) {
                disable()
                binding.progressBar.visibility = View.VISIBLE
            } else {
                enable()
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModelSelect.selected.observe(viewLifecycleOwner) { item ->
            item.getContentIfNotHandled()?.let {
                address = it
                load(it)
            }
        }

        viewModelAddress.complete.observe(viewLifecycleOwner) {
            if (it) {
                view?.findNavController()?.navigate(R.id.nav_close_order)
            }
        }

        activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                view?.findNavController()?.navigate(R.id.nav_close_order)
            }
        })
    }

    private fun insert(address: Address, access_token: String) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelAddress.save(address, access_token)
            }
        } else {
            view?.let { v ->
                MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }

    }

    private fun disable() {
        binding.editTextPublicPlace.isEnabled = false
        binding.editTextReference.isEnabled = false
        binding.editTextDistrict.isEnabled = false
    }

    private fun enable() {
        binding.editTextPublicPlace.isEnabled = true
        binding.editTextReference.isEnabled = true
        binding.editTextDistrict.isEnabled = true
    }

    private fun load(address: Address) {
        binding.editTextDistrict.setText(address.district)
        binding.editTextPublicPlace.setText(address.street)
        binding.textViewCity.text = address.city
        binding.textViewUf.text = address.uf
        binding.textViewCep.text = address.postalCode.substring(0,5) + "-" + address.postalCode.substring(5,8)
        binding.editTextReference.setText(address.reference)
    }

}

