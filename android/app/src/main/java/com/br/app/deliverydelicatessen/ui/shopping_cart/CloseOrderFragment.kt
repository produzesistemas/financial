package com.br.app.deliverydelicatessen.ui.shopping_cart

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.*
import androidx.activity.OnBackPressedCallback
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.findNavController
import com.br.app.deliverydelicatessen.MainActivity
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceDelivery
import com.br.app.deliverydelicatessen.database.DataSourceLastAddress
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentCloseOrderBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.ApplicationUserDTO
import com.br.app.deliverydelicatessen.model.CloseOrderDTO
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.DeliveryRegionSearch
import com.br.app.deliverydelicatessen.model.Establishment
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.CloseOrderDTOViewModel
import com.br.app.deliverydelicatessen.viewmodel.PersonalDataViewModelSelect
import com.google.android.material.snackbar.Snackbar
import java.lang.Exception
import java.text.NumberFormat
import java.util.*

class CloseOrderFragment : Fragment(){
    private lateinit var binding: FragmentCloseOrderBinding
    private var dataSourceShoppingCart: DataSourceShoppingCart? = null
    private var dataSourceConfig: DataSourceConfig? = null
    private var dataSourceDelivery: DataSourceDelivery? = null
    private var dataSourceAddress: DataSourceAddress? = null
    private var dataSourceLastAddress: DataSourceLastAddress? = null
    private var dataSourceUser: DataSourceUser? = null
    private var user: User = User()
    private var lastAddress: Address = Address()
    private var filter: CloseOrderDTO = CloseOrderDTO()
    private lateinit var personalData: ApplicationUserDTO
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
private lateinit var viewModelCloseOrderDTO: CloseOrderDTOViewModel
    private lateinit var viewModelLogin: LoginViewModel
    private val viewModelSelect: AddressViewModelSelect by activityViewModels()
    private val viewModelPersonalDataSelect: PersonalDataViewModelSelect by activityViewModels()
    private lateinit var deliveryRegionSearch: DeliveryRegionSearch
    private lateinit var config: Config
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_close_order,
            container,
            false
        )

        return binding.root
    }


    @SuppressLint("ResourceType")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        try {
        dataSourceShoppingCart = context?.let { DataSourceShoppingCart(it) }
        dataSourceUser = context?.let { DataSourceUser(it) }
        dataSourceAddress = context?.let { DataSourceAddress(it) }
        dataSourceLastAddress = context?.let { DataSourceLastAddress(it) }
        dataSourceConfig = context?.let { DataSourceConfig(it) }
            dataSourceDelivery = context?.let { DataSourceDelivery(it) }
            viewModelCloseOrderDTO = ViewModelProvider(this)[CloseOrderDTOViewModel::class.java]

            viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]
        user = dataSourceUser?.get()!!
        config = dataSourceConfig?.get()!!
            deliveryRegionSearch = dataSourceAddress!!.get()

            if (deliveryRegionSearch.postalCode.isEmpty() && user.token.isEmpty()) {
                changeActivity()
            }

        binding.progressBar.visibility = View.GONE

            binding.bottomNavView.setOnItemSelectedListener { menuItem ->
                when (menuItem.itemId) {
                    R.id.navigation_payment -> {
                        if (binding.radioGroupDeliveryOptions.checkedRadioButtonId == -1) {
                            view?.let { v ->
                                MainUtils.snackCenter(
                                    v.getRootView(),
                                    this.resources.getString(R.string.validation_delivery_options),
                                    Snackbar.LENGTH_LONG
                                )
                            }
                            return@setOnItemSelectedListener true
                        } else {
                            if (binding.radioButtonDelivery.isChecked) {
                                if (validate()) {
                                    return@setOnItemSelectedListener true
                                }
                                dataSourceDelivery!!.deleteAll()
                                dataSourceDelivery!!.insert(true)
                            }
                            if (binding.radioButtonInStorePickup.isChecked) {
                                dataSourceDelivery!!.deleteAll()
                                dataSourceDelivery!!.insert(false)
                            }
                        }


                        dataSourceLastAddress?.deleteAll()
                        dataSourceLastAddress?.insert(lastAddress)
                        view?.findNavController()?.navigate(R.id.nav_payment)
                        return@setOnItemSelectedListener true
                    }

                    R.id.navigation_change_postal_code -> {
                        dataSourceAddress?.deleteAll()
                        changeActivity()
                    }
                }
                false
            }

            binding.radioGroupDeliveryOptions.setOnCheckedChangeListener { _, checkedId ->
                when (checkedId) {
                    R.id.radioButtonDelivery -> {
                        binding.linearLayoutAddress.visibility = View.VISIBLE
                    }
                    R.id.radioButtonInStorePickup -> {
                        binding.textViewTaxValue.text = nFormat.format(0.0)
                        binding.textViewValueTotal.text =
                            nFormat.format(0.0.plus(dataSourceShoppingCart?.getTotalValue()!!))
                        binding.linearLayoutAddress.visibility = View.GONE
                    }

                }
            }

            binding.btnNewAddress.setOnClickListener {
                view?.findNavController()?.navigate(R.id.nav_new_address)
            }

            binding.btnEditAddress.setOnClickListener {
                viewModelSelect.select(lastAddress)
                view?.findNavController()?.navigate(R.id.nav_edit_address)
            }

            binding.btnEditPersonalData.setOnClickListener {
                viewModelPersonalDataSelect.select(personalData)
                view?.findNavController()?.navigate(R.id.nav_personal_data)
            }

        binding.textViewTotalShopping.text = nFormat.format(dataSourceShoppingCart?.getTotalValue())

            viewModelCloseOrderDTO.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelLogin.loading.observe(viewLifecycleOwner) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelCloseOrderDTO.closeOrder.observe(viewLifecycleOwner) {
                if (it != null) {
                    it.establishment?.let { it1 -> loadDeliveryOptions(it1) }
                    personalData = it.applicationUserDTO!!
                    loadPersonalData(personalData)
                    if (it.address != null) {
                        lastAddress = it.address!!
                        loadAddress(lastAddress)
                        binding.btnNewAddress.visibility = View.GONE
                        binding.btnEditAddress.visibility = View.VISIBLE
                    } else {
                        binding.btnEditAddress.visibility = View.GONE
                        binding.btnNewAddress.visibility = View.VISIBLE
                    }
                    if (it.deliveryRegion?.value == null) {
                        binding.textViewTaxValue.text = nFormat.format(0.0)
                        binding.textViewValueTotal.text =
                            nFormat.format(0.0.plus(dataSourceShoppingCart?.getTotalValue()!!))
                    } else {
                        binding.textViewTaxValue.text = nFormat.format(it.deliveryRegion?.value)
                        binding.textViewValueTotal.text =
                            nFormat.format(it.deliveryRegion?.value?.plus(dataSourceShoppingCart?.getTotalValue()!!))
                    }

                }
            }

            viewModelLogin.newToken.observe(viewLifecycleOwner) { event ->
                event.getContentIfNotHandled()?.let {
                    dataSourceUser?.deleteAll()
                    val token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                    dataSourceUser?.insert(token)
                    user = dataSourceUser?.get()!!
                    getCloseOrderDTO(user.token)
                }
            }

            viewModelCloseOrderDTO.errorMessage.observe(viewLifecycleOwner) {
                if (it.code == 401) {
                    viewModelLogin.refreshToken(user.token)
                }
                if (it.code == 400) {
                    view?.let {v ->
                        MainUtils.snackCenter(v.getRootView(), it.message, Snackbar.LENGTH_LONG)
                    }
                }
            }

            activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    view.findNavController().navigate(R.id.nav_shopping_cart)
                }
            })

            getCloseOrderDTO(user.token)

        }  catch (e: Exception) {
            val exc = e.message
        }

    }

    private fun getCloseOrderDTO(token: String) {
        filter.establishmentId = dataSourceConfig?.get()!!.id
        filter.postalCode = dataSourceAddress?.get()!!.postalCode
        viewModelCloseOrderDTO.getCloseOrderDTO(token, filter)
    }

    private fun validate() : Boolean {
        if (lastAddress.id == 0) {
            view?.let { MainUtils.snackCenter(it.getRootView(), this.resources.getString(R.string.validation_address_mandatory), Snackbar.LENGTH_LONG) }
            return true
        } else {
            return false
        }
    }

    private fun loadAddress(address: Address) {
        binding.textViewId.text = address.id.toString()
        binding.textViewStreet.text = address.street
        binding.textViewDistrict.text = address.district
        binding.textViewReference.text = address.reference
        binding.textViewPostalCode.text = address.postalCode.substring(0,5) + "-" + address.postalCode.substring(5,8)
        binding.textViewCity.text = address.city
        binding.textViewUf.text = address.uf
    }

    private fun loadPersonalData(applicationUserDTO: ApplicationUserDTO) {
        binding.textViewName.text = applicationUserDTO.name
        binding.textViewPhone.text = applicationUserDTO.phone
        binding.textViewCpf.text = applicationUserDTO.cpf
    }

    private fun changeActivity() {
        activity?.let{
            val intent = Intent (it, MainActivity::class.java)
            it.startActivity(intent)
        }
    }

    private fun loadDeliveryOptions(establishment: Establishment) {
        if (establishment.delivery == false) {
            binding.radioButtonDelivery.visibility = View.GONE
        }
        if (establishment.instorePickup == false) {
            binding.radioButtonInStorePickup.visibility = View.GONE
        }

        if (establishment.delivery == false && establishment.instorePickup == true) {
            binding.radioButtonInStorePickup.isChecked = true
        }

        if (establishment.delivery == true && establishment.instorePickup == false) {
            binding.radioButtonDelivery.isChecked = true
        }
    }

    }


