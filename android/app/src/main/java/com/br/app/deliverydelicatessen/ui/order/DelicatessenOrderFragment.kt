package com.br.app.deliverydelicatessen.ui.order

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import android.widget.*
import androidx.activity.OnBackPressedCallback
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.adapters.DelicatessenOrderAdapter
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentDelicatessenOrderBinding
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.DelicatessenOrder
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenOrderViewModel
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenOrderViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel
import com.google.android.material.snackbar.Snackbar
import java.lang.Exception
import java.util.*
import kotlin.collections.ArrayList

class DelicatessenOrderFragment : Fragment(){
    private lateinit var binding: FragmentDelicatessenOrderBinding
    private lateinit var adapterOrders: DelicatessenOrderAdapter
    private var user: User = User()
    private var config: Config = Config()
    private var dataSourceUser: DataSourceUser? = null
    private var datasourceConfig: DataSourceConfig? = null
    private val viewModelSelect: DelicatessenOrderViewModelSelect by activityViewModels()
    private lateinit var viewModelDelicatessenOrder: DelicatessenOrderViewModel
    private lateinit var viewModelLogin: LoginViewModel
    private val viewModelMain: MainViewModel by activityViewModels()
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_delicatessen_order,
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
            datasourceConfig = context?.let { DataSourceConfig(it) }
            user = dataSourceUser?.get()!!
            config = datasourceConfig?.get()!!
            viewModelDelicatessenOrder = ViewModelProvider(this)[DelicatessenOrderViewModel::class.java]
            viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]

            adapterOrders = DelicatessenOrderAdapter(arrayListOf(), viewModelSelect)
            binding.progressBar.visibility = View.GONE
            binding.bottomNavView.setOnItemSelectedListener {
                when (it.itemId) {
                    R.id.navigation_go_back -> {
                        view?.findNavController()?.navigate(R.id.nav_product)
                        return@setOnItemSelectedListener true
                    }
                }
                false
            }

            viewModelDelicatessenOrder.orders.observe(viewLifecycleOwner) {
                load(it!! as ArrayList<DelicatessenOrder>)
            }

            viewModelDelicatessenOrder.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelDelicatessenOrder.errorMessage.observe(viewLifecycleOwner) {
                if (it.code == 400) {
                    view?.let {v ->
                        MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                    }
                }
                if (it.code == 401) {
                    viewModelLogin.refreshToken(user.token)
                }
            }

            viewModelLogin.newToken.observe(viewLifecycleOwner) { event ->
                event.getContentIfNotHandled()?.let {
                    dataSourceUser?.deleteAll()
                    var token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                    dataSourceUser?.insert(token)
                    user = dataSourceUser?.get()!!
                    val delicatessenOrder = DelicatessenOrder(
                        0,0,0,null,
                        "",0.00,config.id,0.00,
                        null,null,null,null,null,null,0,null
                    ,null, ArrayList(),ArrayList(),null,
                        null,null,null,null)
                    getOrders(user.token, delicatessenOrder)
                }
            }

            if (user.token.isNotEmpty()) {
                val delicatessenOrder = DelicatessenOrder(
                    0,0,0,null,
                    "",0.00,config.id,0.00,
                    null,null,null,null,null,null,0,null
                    ,null, ArrayList(),ArrayList(),null,
                    null,null,null,null)
                getOrders(user.token,delicatessenOrder)
            }

            activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    view?.findNavController()?.navigate(R.id.nav_product)
                }
            })

        }  catch (e: Exception) {
            val exc = e.message
        }

    }

    private fun load(lst: ArrayList<DelicatessenOrder>) {
        if (lst.isEmpty()) {
            binding.linearLayoutNothing.visibility = View.VISIBLE
        } else {
            binding.linearLayoutNothing.visibility = View.GONE
        }
        adapterOrders = DelicatessenOrderAdapter(lst, viewModelSelect)
        binding.recyclerView.apply {
            adapter = adapterOrders
            layoutManager = LinearLayoutManager(context)
        }
    }

    private fun getOrders(token: String, delicatessenOrder: DelicatessenOrder) {
        viewModelDelicatessenOrder.getAllOrders(token, delicatessenOrder)
    }

    }


