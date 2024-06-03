package com.br.app.deliverydelicatessen.ui.shopping_cart

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import android.widget.*
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.adapters.ShoppingCartAdapter
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentShoppingCartBinding
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.ShoppingCart
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.EstablishmentViewModel
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel
import com.br.app.deliverydelicatessen.viewmodel.ShoppingCartViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
import java.lang.Exception
import java.text.NumberFormat
import java.util.*

class ShoppingCartFragment : Fragment(){
    private val viewModelShoppingCart: ShoppingCartViewModel by activityViewModels()
    private lateinit var binding: FragmentShoppingCartBinding
    private var dataSourceShoppingCart: DataSourceShoppingCart? = null
    private var dataSourceUser: DataSourceUser? = null
    private var dataSourceConfig: DataSourceConfig? = null
    private lateinit var viewModelMain: MainViewModel
    private lateinit var adapterShoppingCart: ShoppingCartAdapter
    private var shoppingCarts: ArrayList<ShoppingCart>? = ArrayList()
    private lateinit var viewModelEstablishment: EstablishmentViewModel
    private var user: User = User()
    private lateinit var config: Config
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_shopping_cart,
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
        dataSourceShoppingCart = context?.let { DataSourceShoppingCart(it) }
            dataSourceUser = context?.let { DataSourceUser(it) }
            dataSourceConfig = context?.let { DataSourceConfig(it) }
            config = dataSourceConfig?.get()!!
            user = dataSourceUser?.get()!!
        activity?.run {
            viewModelMain = ViewModelProvider(this)[MainViewModel::class.java]
        } ?: throw Throwable("invalid activity")
            viewModelEstablishment = ViewModelProvider(this)[EstablishmentViewModel::class.java]
            adapterShoppingCart = ShoppingCartAdapter(arrayListOf(), viewModelShoppingCart, dataSourceShoppingCart)
        binding.bottomNavView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.navigation_clear -> {
                    val manager: FragmentManager = (context as AppCompatActivity).supportFragmentManager
                    val dialog = AlertDialogClear(requireActivity().resources.getString(R.string.msg_clear),viewModelShoppingCart)
                    dialog?.show(manager, "dialog")
                    return@setOnItemSelectedListener true
                }

                R.id.navigation_close_order -> {
                        view?.findNavController()?.navigate(R.id.nav_close_order)
                    return@setOnItemSelectedListener true
                }

                R.id.navigation_go_back -> {
                    view?.findNavController()?.navigate(R.id.nav_product)
                    return@setOnItemSelectedListener true
                }
            }
            false
        }
        dataSourceShoppingCart?.let { load(it.getAll()) }

        viewModelShoppingCart.goBack.observe(viewLifecycleOwner) {
                it.getContentIfNotHandled()?.let {
                    view?.findNavController()?.navigate(R.id.nav_product)
                }
            }

            viewModelEstablishment.entity.observe(viewLifecycleOwner) {
                if (it != null) {
                    if (it.minimumValue != null) {
                        binding.textViewMinimumValue.text = nFormat.format(it.minimumValue)
                    }
                }
            }
            viewModelEstablishment.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    view?.findNavController()?.navigate(R.id.nav_product)
                    // in here you can do logic when backPress is clicked
                }
            })
            getEstablishment(config.id)
        }  catch (e: Exception) {
            val exc = e.message
        }

    }

    private fun load(shoppingCarts: ArrayList<ShoppingCart>) {
        adapterShoppingCart = ShoppingCartAdapter(shoppingCarts, viewModelShoppingCart, dataSourceShoppingCart)
        binding.recyclerViewProducts.visibility = View.VISIBLE
        binding.recyclerViewProducts.apply {
            adapter = adapterShoppingCart
            layoutManager = LinearLayoutManager(context)
        }

    }

    private fun getEstablishment(id: Int) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelEstablishment.getEstablishmentById(id)
            }
        }
        else {
            view?.let { v ->
                MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }
    }

    }


