package com.br.app.deliverydelicatessen.ui.order

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.*
import androidx.lifecycle.Observer
import androidx.navigation.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.adapters.DelicatessenOrderTrackingAdapter
import com.br.app.deliverydelicatessen.adapters.DelicatessenProductAdapter
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentDelicatessenOrderDetailBinding
import com.br.app.deliverydelicatessen.model.DelicatessenOrder
import com.br.app.deliverydelicatessen.model.DelicatessenOrderTracking
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenOrderViewModel
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenOrderViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class DelicatessenOrderFragmentDetail : Fragment(){
    private val viewModelDetail: DelicatessenOrderViewModelSelect by activityViewModels()
    private lateinit var viewModel: DelicatessenOrderViewModel
    private lateinit var viewModelLogin: LoginViewModel
    private lateinit var binding: FragmentDelicatessenOrderDetailBinding
    var df = SimpleDateFormat("dd/MM/yyyy")
    val nFormat: NumberFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    private var orderBase: DelicatessenOrder = DelicatessenOrder()
    private var user: User = User()
    private var dataSourceUser: DataSourceUser? = null
    private lateinit var adapterProduct: DelicatessenProductAdapter
    private lateinit var adapterTracking: DelicatessenOrderTrackingAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_delicatessen_order_detail,
            container,
            false
        )

        return binding.root
    }


    @SuppressLint("ResourceType", "FragmentLiveDataObserve")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setHasOptionsMenu(true)
        dataSourceUser = context?.let { DataSourceUser(it) }
        user = dataSourceUser?.get()!!
        viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]
        viewModel = ViewModelProvider(this)[DelicatessenOrderViewModel::class.java]
        binding.bottomNavView.setOnItemSelectedListener {
            when (it.itemId) {
                R.id.navigation_go_back -> {
                    view.findNavController().navigate(R.id.nav_order)
                    return@setOnItemSelectedListener true
                }

                R.id.navigation_cancel -> {
                    cancelByClient(orderBase, user.token)
                    return@setOnItemSelectedListener true
                }


            }

                false
            }
        binding.progressBar.visibility = View.GONE
        binding.linearLayoutCash.visibility = View.GONE
        viewModelDetail.selected.observe(viewLifecycleOwner) { item ->
            item.getContentIfNotHandled()?.let {
                getById(it)
             }
        }

        viewModel.errorMessage.observe(this, Observer {
            if (it.code == 401) {
                viewModelLogin.refreshToken(user.token)
            }
            if (it.code == 400) {
                view.let {v ->
                    MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                }
            }
        })

        viewModelLogin.newToken.observe(viewLifecycleOwner) { event ->
            event.getContentIfNotHandled()?.let {
                dataSourceUser?.deleteAll()
                val token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                dataSourceUser?.insert(token)
                user = dataSourceUser?.get()!!
                cancelByClient(orderBase, user.token)
            }
        }

        viewModel.loading.observe(this, Observer {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        })

        viewModel.complete.observe(this, Observer {event ->
            event.getContentIfNotHandled()?.let {
                if (it) {
                    view.findNavController().popBackStack()
                }
            }
        })

        viewModel.order.observe(this, Observer {
            if (it !== null) {
                orderBase = it
                load(it)
            }
        })

        viewModelLogin.loading.observe(viewLifecycleOwner, Observer {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        })

        activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                view?.findNavController()?.navigate(R.id.nav_order)
         }
        })

    }

    private fun load(delicatessenOrder: DelicatessenOrder) {
        binding.textViewRequestDate.text = df.format(delicatessenOrder.requestDate)
        binding.textViewStatus.text = getStatus(delicatessenOrder)
        binding.textViewTotalValue.text = nFormat.format(getTotal(delicatessenOrder))
        binding.textViewTotalProducts.text = nFormat.format(getTotalProducts(delicatessenOrder))
        binding.textViewTaxValue.text = nFormat.format(delicatessenOrder.taxValue)
        binding.textViewPaymentCondition.text = delicatessenOrder.paymentCondition!!.description
        if (delicatessenOrder.paymentMoney == true) {
            if (delicatessenOrder.exchangeForCash!! > 0.0) {
                binding.textViewCash.text = nFormat.format(delicatessenOrder.exchangeForCash)
                binding.linearLayoutCash.visibility = View.VISIBLE
            }
            binding.textViewPaymentOption.text = this.resources.getString(R.string.label_payment_money)
        }

        if (delicatessenOrder.couponId != null) {
            binding.linearLayoutCoupon.visibility = View.VISIBLE
            binding.textViewCodeCoupon.text = delicatessenOrder.coupon!!.code + " - " + delicatessenOrder.coupon!!.description

        }

        if (delicatessenOrder.paymentLittleMachine == true) {
            binding.linearLayoutBrand.visibility = View.VISIBLE
            if (delicatessenOrder.establishmentBrandCreditId != null) {
                binding.textViewBrand.text = delicatessenOrder.establishmentBrandCredit!!.brand!!.name
            }
            if (delicatessenOrder.establishmentBrandDebitId != null) {
                binding.textViewBrand.text = delicatessenOrder.establishmentBrandDebit!!.brand!!.name
            }

            binding.textViewPaymentOption.text = this.resources.getString(R.string.label_payment_little_machine)
        }

        if (delicatessenOrder.paymentOnLine == true) {
            binding.textViewPaymentOption.text = this.resources.getString(R.string.label_payment_online)
        }

        if (delicatessenOrder.delivery == true) {
            binding.textViewDeliveryOption.text = this.resources.getString(R.string.label_delivery)
        }

        if (delicatessenOrder.instorePickup == true) {
            binding.textViewDeliveryOption.text = this.resources.getString(R.string.label_in_store_pickup)
        }

        adapterProduct = DelicatessenProductAdapter(delicatessenOrder.delicatessenOrderProducts)
        binding.recyclerView.apply {
            adapter = adapterProduct
            layoutManager = LinearLayoutManager(context)
        }

        adapterTracking = DelicatessenOrderTrackingAdapter(delicatessenOrder.delicatessenOrderTrackings)
        binding.recyclerViewTracking.apply {
            adapter = adapterTracking
            layoutManager = LinearLayoutManager(context)
        }

        if (MainUtils.statusIsCancel(delicatessenOrder.delicatessenOrderTrackings)) {
            binding.bottomNavView.menu.removeItem(R.id.navigation_cancel)
            }

    }

    private fun getById(delicatessenOrder: DelicatessenOrder) {
           lifecycleScope.launch {
                viewModel.getDelicatessenOrderById(delicatessenOrder.id)
            }
    }

    private fun cancelByClient(delicatessenOrder: DelicatessenOrder, token: String) {
        var order = DelicatessenOrder();
        order.id = delicatessenOrder.id
        lifecycleScope.launch {
            viewModel.cancelByClient(order, token)
        }
    }

    private fun getTotal(delicatessenOrder: DelicatessenOrder): Double {
        var total: Double = 0.00
        delicatessenOrder.delicatessenOrderProducts.forEach {
            total = total.plus((it.value * it.quantity))
        }
        if (delicatessenOrder.taxValue != null) {
            total = total.plus((delicatessenOrder.taxValue!!))
        }

        if (delicatessenOrder.couponId != null) {
            if (delicatessenOrder.coupon!!.type) {
                total =  total.minus(delicatessenOrder.coupon!!.value)
            } else {
                total =  (total * delicatessenOrder.coupon!!.value) / 100
            }
        }

        return total
    }

    private fun getTotalProducts(delicatessenOrder: DelicatessenOrder): Double {
        var total: Double = 0.00
        delicatessenOrder.delicatessenOrderProducts.forEach {
            total = total.plus((it.value * it.quantity))
        }
        return total
    }

    private fun getStatus(delicatessenOrder: DelicatessenOrder): String {
        return delicatessenOrder.delicatessenOrderTrackings.last().statusOrder!!.description
    }
}