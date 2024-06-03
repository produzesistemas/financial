package com.br.app.deliverydelicatessen.ui.account

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import androidx.activity.OnBackPressedCallback
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentAccountBinding
import com.br.app.deliverydelicatessen.model.ApplicationUserDTO
import com.br.app.deliverydelicatessen.model.LoginUser
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.br.app.deliverydelicatessen.viewmodel.AccountViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch

class AccountFragment : Fragment() {
    private lateinit var viewModelAccount: AccountViewModel

    private lateinit var viewModelLogin: LoginViewModel
    private lateinit var binding: FragmentAccountBinding
    private var dataSourceUser: DataSourceUser? = null
    private var user: User = User()
    private var loginUser: LoginUser = LoginUser("","","","","")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_account,
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
        user = dataSourceUser?.get()!!
        viewModelAccount = ViewModelProvider(this)[AccountViewModel::class.java]
        binding.progressBar.visibility = View.GONE

        viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]

        binding.bottomNavView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.navigation_go_back -> {
                    view?.findNavController()?.navigate(R.id.nav_product)
                    return@setOnItemSelectedListener true
                }
                R.id.navigation_address -> {
                    view?.findNavController()?.navigate(R.id.nav_account_address)
                    return@setOnItemSelectedListener true
                }

            }
            false
        }

        viewModelAccount.errorMessage.observe(viewLifecycleOwner) {
            if (it.code == 401) {
                viewModelLogin.refreshToken(user.token)
            }
            if (it.code == 400) {
                view?.let {v ->
                    MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                }
            }
        }

        viewModelLogin.newToken.observe(viewLifecycleOwner) { event ->
            event.getContentIfNotHandled()?.let {
                dataSourceUser?.deleteAll()
                var token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                dataSourceUser?.insert(token)
                user = dataSourceUser?.get()!!
                getAccount(user.token)
            }
        }

        viewModelLogin.loading.observe(viewLifecycleOwner) {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModelAccount.loading.observe(viewLifecycleOwner) {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModelAccount.account.observe(viewLifecycleOwner) {
            if (it != null) {
                load(it)
            }
        }

      activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                view?.findNavController()?.navigate(R.id.nav_product)
            }
        })

        getAccount(user.token)
    }
    private fun load(applicationUserDTO: ApplicationUserDTO) {
        binding.textViewName.text = applicationUserDTO.name
        binding.textViewEmail.text = applicationUserDTO.email
        binding.textViewCpf.text = applicationUserDTO.cpf
        binding.textViewPhone.text = applicationUserDTO.phone
    }

    private fun getAccount(token: String) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelAccount.getAccount(user.token)
            }
        } else {
            view?.let { v ->
                MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }
    }
}

