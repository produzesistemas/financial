package com.br.app.deliverydelicatessen.ui.account

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import androidx.activity.OnBackPressedCallback
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.adapters.AccountAddressAdapter
import com.br.app.deliverydelicatessen.adapters.AddressAdapter
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentAddressBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel
import com.google.android.material.snackbar.Snackbar
import java.lang.Exception
import java.util.*

class AccountAddressFragment : Fragment(){
    private lateinit var binding: FragmentAddressBinding
    private lateinit var adapterAddress: AccountAddressAdapter
    private var dataSourceAddress: DataSourceAddress? = null
    private var dataSourceShoppingCart: DataSourceShoppingCart? = null
    private var user: User = User()
    private var dataSourceUser: DataSourceUser? = null
    private val viewModelSelect: AddressViewModelSelect by activityViewModels()
    private lateinit var viewModelAddress: AddressViewModel
    private lateinit var viewModelLogin: LoginViewModel
    private val viewModelMain: MainViewModel by activityViewModels()
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_address,
            container,
            false
        )

        return binding.root
    }




    @SuppressLint("ResourceType")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        try {
        setHasOptionsMenu(true)
            dataSourceUser = context?.let { DataSourceUser(it) }
            dataSourceAddress = context?.let { DataSourceAddress(it) }
            dataSourceShoppingCart = context?.let { DataSourceShoppingCart(it) }
            user = dataSourceUser?.get()!!
            viewModelAddress = ViewModelProvider(this)[AddressViewModel::class.java]
            viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]

            adapterAddress = AccountAddressAdapter(arrayListOf())
            binding.progressBar.visibility = View.GONE
            binding.bottomNavView.setOnItemSelectedListener {
                when (it.itemId) {
                    R.id.navigation_go_back -> {
                        view?.findNavController()?.navigate(R.id.nav_account)
                        return@setOnItemSelectedListener true
                    }
                }
                false
            }

            viewModelAddress.lstAddress.observe(viewLifecycleOwner) {
                load(it!! as ArrayList<Address>)
            }

            viewModelAddress.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelAddress.errorMessage.observe(viewLifecycleOwner) {
                if (it.code == 400) {
                    view?.let {v ->
                        MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                    }
                }
                if (it.code == 401) {
                    viewModelLogin.refreshToken(user.token)
                }
            }

            viewModelAddress.deleted.observe(viewLifecycleOwner) {
                if (it) {
                    if (user.token.isNotEmpty()) {
                        getAddress(user.token)
                    }
                }
            }

            viewModelLogin.newToken.observe(viewLifecycleOwner) { event ->
                event.getContentIfNotHandled()?.let {
                    dataSourceUser?.deleteAll()
                    var token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                    dataSourceUser?.insert(token)
                    user = dataSourceUser?.get()!!
                    getAddress(user.token)
                }
            }

            if (user.token.isNotEmpty()) {
                getAddress(user.token)
            }

            activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    view?.findNavController()?.navigate(R.id.nav_account)
                }
            })

        }  catch (e: Exception) {
            val exc = e.message
        }

    }

    private fun load(lstAddress: ArrayList<Address>) {
        if (lstAddress.isEmpty()) {
            binding.linearLayoutNothing.visibility = View.VISIBLE
        } else {
            binding.linearLayoutNothing.visibility = View.GONE
        }
        adapterAddress = AccountAddressAdapter(lstAddress)
        binding.recyclerViewAddress.apply {
            adapter = adapterAddress
            layoutManager = LinearLayoutManager(context)
        }
    }

    private fun getAddress(token: String) {
        viewModelAddress.getAddress(token)
    }

    }


