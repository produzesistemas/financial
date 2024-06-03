package com.br.app.deliverydelicatessen.ui.account

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import androidx.activity.OnBackPressedCallback
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentPersonalDataBinding
import com.br.app.deliverydelicatessen.model.LoginUser
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.utils.Mask
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.br.app.deliverydelicatessen.viewmodel.AccountViewModel
import com.br.app.deliverydelicatessen.viewmodel.PersonalDataViewModelSelect
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch

class PersonalDataFragment : Fragment() {
    private lateinit var viewModelPersonalData: AccountViewModel
    private val viewModelPersonalDataSelect: PersonalDataViewModelSelect by activityViewModels()

    private lateinit var viewModelLogin: LoginViewModel
    private lateinit var binding: FragmentPersonalDataBinding
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
            R.layout.fragment_personal_data,
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
        viewModelPersonalData = ViewModelProvider(this)[AccountViewModel::class.java]
        binding.progressBar.visibility = View.GONE

        viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]

        binding.bottomNavView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.navigation_confirm -> {
                    if (binding.editTextName.text.isEmpty()) {
                        binding.editTextName?.error =
                            this.resources.getString(R.string.validation_name)
                        binding.editTextName?.requestFocus()
                        return@setOnItemSelectedListener true
                    }
                    if (binding.editTextPhone.text.isEmpty()) {
                        binding.editTextPhone?.error =
                            this.resources.getString(R.string.validation_phone)
                        binding.editTextPhone?.requestFocus()
                        return@setOnItemSelectedListener true
                    }

                    loginUser.name = binding.editTextName.text.toString()
                    loginUser.phone = binding.editTextPhone.text.toString()
                    loginUser.cpf = binding.editTextCpf.text.toString()
                    insert(loginUser, user.token)

                    return@setOnItemSelectedListener true
                }

            }
            false
        }

        viewModelPersonalData.errorMessage.observe(viewLifecycleOwner) {
            if (it.code == 401) {
                viewModelLogin.refreshToken(user.token)
            }
            if (it.code == 400) {
                view?.let {v ->
                    MainUtils.snackCenter(v, it.message, Snackbar.LENGTH_LONG)
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
                insert(loginUser, user.token)
            }
        }

        viewModelLogin.loading.observe(viewLifecycleOwner) {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModelPersonalData.loading.observe(viewLifecycleOwner) {
            if (it) {
                disable()
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModelPersonalData.complete.observe(viewLifecycleOwner) { complete ->
            complete.getContentIfNotHandled()?.let {
                if (it) {
                    view.findNavController().navigate(R.id.nav_close_order)
                }
            }
        }

        viewModelPersonalDataSelect.selected.observe(viewLifecycleOwner) { item ->
            item.getContentIfNotHandled()?.let {
                if (it.name != null) {
                    loginUser.name = it.name
                }
                if (it.cpf != null) {
                    loginUser.cpf = it.cpf
                }
                if (it.phone != null) {
                    loginUser.phone = it.phone
                }
                load(loginUser)
            }
        }
            binding.editTextPhone.addTextChangedListener(Mask.insert("(##)#####-####", binding.editTextPhone))
            binding.editTextCpf.addTextChangedListener(Mask.insert("###.###.###-##", binding.editTextCpf))

        activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                view.findNavController().navigate(R.id.nav_close_order)
            }
        })
    }

    private fun insert(loginUser: LoginUser, accessToken: String) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelPersonalData.save(loginUser, accessToken)
            }
        } else {
            view?.let { v ->
                MainUtils.snackCenter(v, R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }

    }

    private fun disable() {
        binding.editTextCpf.isEnabled = false
        binding.editTextName.isEnabled = false
        binding.editTextPhone.isEnabled = false
    }

    private fun enable() {
        binding.editTextCpf.isEnabled = true
        binding.editTextName.isEnabled = true
        binding.editTextPhone.isEnabled = true
    }

    private fun load(loginUser: LoginUser) {
        binding.editTextCpf.setText(loginUser.cpf)
        binding.editTextName.setText(loginUser.name)
        binding.editTextPhone.setText(loginUser.phone)
    }
}

