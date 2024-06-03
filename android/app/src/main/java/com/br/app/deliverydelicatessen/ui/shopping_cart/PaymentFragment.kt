package com.br.app.deliverydelicatessen.ui.shopping_cart

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Bundle
import android.view.*
import android.widget.AdapterView
import androidx.activity.OnBackPressedCallback
import androidx.browser.customtabs.CustomTabsIntent
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.adapters.BrandAdapterCredit
import com.br.app.deliverydelicatessen.adapters.BrandAdapterDebit
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceDelivery
import com.br.app.deliverydelicatessen.database.DataSourceLastAddress
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentPaymentBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.Coupon
import com.br.app.deliverydelicatessen.model.DelicatessenOrder
import com.br.app.deliverydelicatessen.model.DelicatessenOrderProduct
import com.br.app.deliverydelicatessen.model.DeliveryRegion
import com.br.app.deliverydelicatessen.model.DeliveryRegionSearch
import com.br.app.deliverydelicatessen.model.Establishment
import com.br.app.deliverydelicatessen.model.EstablishmentBrandCredit
import com.br.app.deliverydelicatessen.model.EstablishmentBrandDebit
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.utils.MoneyTextWatcher
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.br.app.deliverydelicatessen.viewmodel.BrandViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.CouponViewModel
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenOrderViewModel
import com.br.app.deliverydelicatessen.viewmodel.DeliveryRegionViewModel
import com.br.app.deliverydelicatessen.viewmodel.EstablishmentViewModel
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.br.app.deliverydelicatessen.viewmodel.ShoppingCartViewModel
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.*


class PaymentFragment : Fragment(){
    private lateinit var binding: FragmentPaymentBinding
    private var dataSourceShoppingCart: DataSourceShoppingCart? = null
    private var dataSourceConfig: DataSourceConfig? = null
    private var dataSourceAddress: DataSourceAddress? = null
    private var dataSourceLastAddress: DataSourceLastAddress? = null
    private var dataSourceUser: DataSourceUser? = null
    private var dataSourceDelivery: DataSourceDelivery? = null
    private var user: User = User()
    private var isDelivery = true
    private var couponCurrent: Coupon = Coupon()
    private var filter: Coupon = Coupon()
    private lateinit var deliveryRegion: DeliveryRegion
    private var order: DelicatessenOrder = DelicatessenOrder()
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    private lateinit var viewModelDeliveryRegion: DeliveryRegionViewModel
    private lateinit var viewModelCoupon: CouponViewModel
    private lateinit var viewModelAddress: AddressViewModel
    private val viewModelShoppingCart: ShoppingCartViewModel by activityViewModels()
    private val viewModelBrandViewModelSelect: BrandViewModelSelect by activityViewModels()
    private lateinit var viewModelEstablishment: EstablishmentViewModel
    private lateinit var viewModelDelicatessenOrderViewModel: DelicatessenOrderViewModel
    private lateinit var viewModelLogin: LoginViewModel
    private lateinit var deliveryRegionSearch: DeliveryRegionSearch
    private lateinit var config: Config
    private var lastAddress: Address = Address()
    private lateinit var adapterBrandCredit: BrandAdapterCredit
    private lateinit var adapterBrandDebit: BrandAdapterDebit
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_payment,
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
        dataSourceAddress = context?.let { DataSourceAddress(it) }
        dataSourceLastAddress = context?.let { DataSourceLastAddress(it) }
            dataSourceConfig = context?.let { DataSourceConfig(it) }
            dataSourceDelivery = context?.let { DataSourceDelivery(it) }
            isDelivery = dataSourceDelivery!!.get()
        user = dataSourceUser?.get()!!
        config = dataSourceConfig?.get()!!
            deliveryRegionSearch = dataSourceAddress!!.get()


        binding.progressBar.visibility = View.GONE
        viewModelDeliveryRegion = ViewModelProvider(this)[DeliveryRegionViewModel::class.java]
        viewModelCoupon = ViewModelProvider(this)[CouponViewModel::class.java]
        viewModelAddress = ViewModelProvider(this)[AddressViewModel::class.java]
        viewModelEstablishment = ViewModelProvider(this)[EstablishmentViewModel::class.java]
        viewModelDelicatessenOrderViewModel = ViewModelProvider(this)[DelicatessenOrderViewModel::class.java]
        viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]
            val mLocale = Locale("pt", "BR")
            binding.editTextChangeMoney.addTextChangedListener(MoneyTextWatcher(binding.editTextChangeMoney, mLocale))
        binding.bottomNavView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.navigation_confirm -> {
                    if (binding.radioGroupPaymentOptions.checkedRadioButtonId == -1) {
                        view?.let { v ->
                            MainUtils.snackCenter(
                                v.getRootView(),
                                this.resources.getString(R.string.validation_payment_options),
                                Snackbar.LENGTH_LONG
                            )
                        }
                        return@setOnItemSelectedListener true
                    } else {
                        if (binding.radioButtonOnLine.isChecked) {
                            order.paymentOnLine = true
                            order.paymentMoney = false
                            order.paymentLittleMachine = false
                        }

                        if (binding.radioButtonMoney.isChecked) {
                            order.paymentConditionId = 1
                            order.paymentMoney = true
                            order.paymentOnLine = false
                            order.paymentLittleMachine = false
                            if (binding.editTextChangeMoney.text.isNotEmpty()) {
                                var vl: String =
                                    binding.editTextChangeMoney.text.toString().trim { it <= ' ' }
                                vl = vl.trim { it <= ' ' }
                                vl = vl.replace(".", "")
                                vl = vl.replace(",", ".")
                                vl = vl.replace("\\s".toRegex(), "")
                                order.exchangeForCash = vl.toDouble()
                            }
                        }

                        if (binding.radioButtonLittleMachine.isChecked) {
                            if (binding.radioGroupCardType.checkedRadioButtonId == -1) {
                                view?.let { v ->
                                    MainUtils.snackCenter(
                                        v.getRootView(),
                                        this.resources.getString(R.string.validation_card_type),
                                        Snackbar.LENGTH_LONG
                                    )
                                }
                                return@setOnItemSelectedListener true
                            }

                                if (binding.radioButtonCredit.isChecked) {
                                    if (order.establishmentBrandCreditId == 0) {
                                        view?.let { v ->
                                            MainUtils.snackCenter(
                                                v.getRootView(),
                                                this.resources.getString(R.string.validation_brand_card),
                                                Snackbar.LENGTH_LONG
                                            )
                                        }
                                        return@setOnItemSelectedListener true
                                    }
                                    order.paymentConditionId = 2
                                }
                                if (binding.radioButtonDebit.isChecked) {
                                    if (order.establishmentBrandDebitId == 0) {
                                        view?.let { v ->
                                            MainUtils.snackCenter(
                                                v.getRootView(),
                                                this.resources.getString(R.string.validation_brand_card),
                                                Snackbar.LENGTH_LONG
                                            )
                                        }
                                        return@setOnItemSelectedListener true
                                    }
                                    order.paymentConditionId = 3
                                }
                                order.paymentLittleMachine = true
                                order.paymentMoney = false
                                order.paymentOnLine = false

                        }
                    }

                    if (isDelivery) {
                        order.delivery = true
                        order.instorePickup = false
                        if (deliveryRegion.value == null) {
                            order.taxValue = 0.0
                        } else {
                            order.taxValue = deliveryRegion.value!!
                        }
                        lastAddress = dataSourceLastAddress!!.get()
                        if (lastAddress.id == 0) {
                            view.findNavController().navigate(R.id.nav_close_order)
                        }
                        order.addressId = lastAddress.id
                    } else {
                        order.delivery = false
                        order.instorePickup = true
                        order.taxValue = 0.0
                        order.addressId = null
                    }
                    order.establishmentId = config.id
                    order.delicatessenOrderProducts = ArrayList()
                    dataSourceShoppingCart?.getAll()?.forEach {
                        var delicatessenOrderProduct: DelicatessenOrderProduct =
                            DelicatessenOrderProduct()
                        delicatessenOrderProduct.delicatessenProductId = it.delicatessenProductId
                        delicatessenOrderProduct.value = it.value
                        delicatessenOrderProduct.quantity = it.quantity!!
                        order.delicatessenOrderProducts.add(delicatessenOrderProduct)
                    }
                    if (couponCurrent.id > 0) {
                        order.couponId = couponCurrent.id
                    }

                    save(user.token, order)
                    return@setOnItemSelectedListener true
                }
            }
            false
        }

            binding.imageButton.setOnClickListener{
                if (binding.editTextCoupon.text.isEmpty()) {
                    binding.editTextCoupon?.error =
                        this.resources.getString(R.string.label_coupon)
                    binding.editTextCoupon?.requestFocus()
                    return@setOnClickListener
                }

                filter.code = binding.editTextCoupon.text.toString()
                filter.establishmentId = config.id
                getCouponByCode(user.token,filter)

            }

            viewModelCoupon.coupon.observe(viewLifecycleOwner) {
                if (it != null) {
                    couponCurrent = it
                    setCoupon(couponCurrent)
                } else {
                    view.let { v ->
                        MainUtils.snackCenter(v.getRootView(), this.resources.getString(R.string.validation_coupon), Snackbar.LENGTH_LONG)
                    }
                }
            }

            viewModelCoupon.errorMessage.observe(viewLifecycleOwner) {
                if (it.code == 401) {
                    viewModelLogin.refreshTokenCoupon(user.token)
                }
                if (it.code == 400) {
                    view.let { v ->
                        MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                    }
                }
                if (it.code == 200) {
                    view.let { v ->
                        MainUtils.snackCenter(v.getRootView(), this.resources.getString(R.string.validation_coupon), Snackbar.LENGTH_LONG)
                    }
                }
            }


            binding.radioGroupPaymentOptions.setOnCheckedChangeListener { group, checkedId ->
                when (checkedId) {
                    R.id.radioButtonOnLine -> {
                        binding.cardViewChangeMoney.visibility = View.GONE
                        binding.linearLayoutCardType.visibility = View.GONE
//                        binding.cardViewOnline.visibility = View.VISIBLE
//                        val url = "https://developers.android.com"
//                        val intent = CustomTabsIntent.Builder()
//                            .build()
//                        context?.let { intent.launchUrl(it, Uri.parse(url)) }
                    }
                    R.id.radioButtonLittleMachine -> {
                        binding.cardViewChangeMoney.visibility = View.GONE
                        binding.cardViewOnline.visibility = View.GONE
                        binding.linearLayoutCardType.visibility = View.VISIBLE
                    }
                    R.id.radioButtonMoney -> {
                        binding.cardViewChangeMoney.visibility = View.VISIBLE
                        binding.cardViewOnline.visibility = View.GONE
                        binding.linearLayoutCardType.visibility = View.GONE
                    }
                }
            }

            binding.radioGroupCardType.setOnCheckedChangeListener { group, checkedId ->
                when (checkedId) {
                    R.id.radioButtonCredit -> {
                        val establishmentBrandCredit = EstablishmentBrandCredit(false,config.id,0,0,null)
                        loadBrandsCredit(establishmentBrandCredit)
                    }
                    R.id.radioButtonDebit -> {
                        val establishmentBrandDebit = EstablishmentBrandDebit(false,config.id,0,0,null)
                        loadBrandsDebit(establishmentBrandDebit)
                    }

                }
            }

        viewModelDeliveryRegion.deliveryRegion.observe(viewLifecycleOwner) {
            if (it.value == null) {
                binding.textViewValueTotal.text = nFormat.format(0.0.plus(loadShoppingCart()))
            } else {
                binding.textViewValueTotal.text = nFormat.format(it.value?.plus(loadShoppingCart()))
            }
            deliveryRegion = it
         }

        viewModelDeliveryRegion.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelCoupon.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

        viewModelEstablishment.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

        viewModelEstablishment.entity.observe(viewLifecycleOwner) {
                loadPaymentOptions(it)
            }

        viewModelEstablishment.lstCredit.observe(viewLifecycleOwner) {
                adapterBrandCredit = BrandAdapterCredit(requireContext(),it)
            binding.spinnerBrandCredit.adapter = adapterBrandCredit
            binding.relativeLayoutCredit.visibility = View.VISIBLE
            binding.relativeLayoutDebit.visibility = View.GONE
            }

            viewModelEstablishment.lstDebit.observe(viewLifecycleOwner) {
                adapterBrandDebit = BrandAdapterDebit(requireContext(),it)
                binding.spinnerBrandDebit.adapter = adapterBrandDebit
                binding.relativeLayoutCredit.visibility = View.GONE
                binding.relativeLayoutDebit.visibility = View.VISIBLE
            }

            viewModelDelicatessenOrderViewModel.complete.observe(viewLifecycleOwner) { event->
                event.getContentIfNotHandled()?.let {
                    dataSourceShoppingCart?.deleteAll()
                    viewModelShoppingCart.onClear(true)
                    view.findNavController().navigate(R.id.nav_product)
                }
            }

            viewModelDelicatessenOrderViewModel.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelDelicatessenOrderViewModel.errorMessage.observe(viewLifecycleOwner) {
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
                    save(user.token, order)
                }
            }

            viewModelLogin.tokenCoupon.observe(viewLifecycleOwner) { event ->
                event.getContentIfNotHandled()?.let {
                    dataSourceUser?.deleteAll()
                    var token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                    dataSourceUser?.insert(token)
                    user = dataSourceUser?.get()!!
                    getCouponByCode(user.token,filter)
                }
            }

            activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    view?.findNavController()?.navigate(R.id.nav_close_order)
                }
            })

            binding.textViewValue.text = nFormat.format(loadShoppingCart())
            binding.textViewTaxValue.text = nFormat.format(0.0)
            binding.textViewValueTotal.text = nFormat.format(loadShoppingCart())

            binding.spinnerBrandCredit.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                    var establishmentBrandCredit = binding.spinnerBrandCredit.selectedItem as EstablishmentBrandCredit
                    order.establishmentBrandDebitId = null
                    order.establishmentBrandCreditId = establishmentBrandCredit.id
                }

                override fun onNothingSelected(parent: AdapterView<*>) {
                    // Do nothing
                }
            }

            binding.spinnerBrandDebit.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                    var establishmentBrandDebit = binding.spinnerBrandDebit.selectedItem as EstablishmentBrandDebit
                    order.establishmentBrandCreditId = null
                    order.establishmentBrandDebitId = establishmentBrandDebit.id
                }

                override fun onNothingSelected(parent: AdapterView<*>) {
                    // Do nothing
                }
            }

            if (isDelivery) {
                val deliveryRegion: DeliveryRegion = DeliveryRegion(deliveryRegionSearch.postalCode, false, config.id, 0.0, 0)
                getDeliveryRegion(deliveryRegion)
            }
            getEstablishment(config.id)

        }  catch (e: Exception) {
            val exc = e.message
        }

    }

    private fun getDeliveryRegion(deliveryRegion: DeliveryRegion){
        deliveryRegion.establishmentId = dataSourceConfig?.get()!!.id
        viewModelDeliveryRegion.getAvailability(deliveryRegion)
    }

    private fun loadShoppingCart() : Double{
        return dataSourceShoppingCart?.getTotalValue()!!
    }

    private fun save(token: String, delicatessenOrder: DelicatessenOrder) {
        viewModelDelicatessenOrderViewModel.save(delicatessenOrder, token)
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



    private fun loadPaymentOptions(establishment: Establishment) {
        if (establishment.paymentLittleMachine == false) {
            binding.radioButtonLittleMachine.visibility = View.GONE
        }
        if (establishment.paymentMoney == false) {
            binding.radioButtonMoney.visibility = View.GONE
        }
        if (establishment.paymentOnLine == false) {
            binding.radioButtonOnLine.visibility = View.GONE
        }

        if (establishment.paymentLittleMachine == true &&
            establishment.paymentMoney == false &&
            establishment.paymentOnLine == false) {
            binding.radioButtonLittleMachine.isChecked = true
            binding.linearLayoutCardType.visibility = View.VISIBLE
        }

        if (establishment.paymentLittleMachine == false &&
            establishment.paymentMoney == true &&
            establishment.paymentOnLine == false) {
            binding.radioButtonMoney.isChecked = true
            binding.cardViewChangeMoney.visibility = View.VISIBLE
        }

        if (establishment.paymentLittleMachine == false &&
            establishment.paymentMoney == false &&
            establishment.paymentOnLine == true) {
            binding.radioButtonOnLine.isChecked = true
            binding.cardViewOnline.visibility = View.VISIBLE
        }

    }

    private fun loadBrandsCredit(establishmentBrand: EstablishmentBrandCredit) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelEstablishment.getEstablishmentBrandCredit(establishmentBrand)
            }
        }
        else {
            view?.let { v ->
                MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }
    }

    private fun loadBrandsDebit(establishmentBrand: EstablishmentBrandDebit) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelEstablishment.getEstablishmentBrandDebit(establishmentBrand)
            }
        }
        else {
            view?.let { v ->
                MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }
    }

    private fun getCouponByCode(token:String, filter: Coupon) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelCoupon.getByCode(token,filter)
            }
        }
        else {
            view?.let { v ->
                MainUtils.snackCenter(v.getRootView(), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
            }
        }
    }

    private fun setCoupon(coupon: Coupon) {
        if (dataSourceDelivery!!.get()) {
            if (coupon.type) {
                if (deliveryRegion.value == null) {
                    binding.textViewValueTotal.text = nFormat.format(0.0.plus(loadShoppingCart()) - coupon.value)
                } else {
                    binding.textViewValueTotal.text = nFormat.format(
                        deliveryRegion.value?.plus(loadShoppingCart())
                            ?.minus(coupon.value))
                }
            } else {
                if (deliveryRegion.value == null) {
                    binding.textViewValueTotal.text = nFormat.format((0.0.plus(loadShoppingCart()) * coupon.value) / 100)
                } else {
                    binding.textViewValueTotal.text = nFormat.format(
                        (deliveryRegion.value?.plus(loadShoppingCart())!! * coupon.value) / 100)
                }
            }
        } else {
            if (coupon.type) {
                    binding.textViewValueTotal.text = nFormat.format(0.0.plus(loadShoppingCart()) - coupon.value)
            } else {
                    binding.textViewValueTotal.text = nFormat.format((0.0.plus(loadShoppingCart()) * coupon.value) / 100)
            }
        }

        binding.textViewLabelCoupon.visibility = View.GONE
        binding.relativeLayoutCoupon.visibility = View.GONE
        binding.linearLayoutSetCoupon.visibility = View.VISIBLE
        binding.textViewCodeCoupon.text = coupon.code + " - " + coupon.description
        view?.let { v ->
            MainUtils.snackCenter(v.getRootView(), this.resources.getString(R.string.msg_coupon), Snackbar.LENGTH_LONG)
        }
    }

    }


