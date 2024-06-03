package com.br.app.deliverydelicatessen.ui.products

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.SearchView
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import android.view.*
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.get
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.activityViewModels
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.adapters.CategoryAdapter
import com.br.app.deliverydelicatessen.adapters.ProductAdapter
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentProductsBinding
import com.br.app.deliverydelicatessen.model.Category
import com.br.app.deliverydelicatessen.model.CategoryDTO
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.model.ShoppingCart
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.ui.components.AlertDialogMessageGeneric
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.br.app.deliverydelicatessen.viewmodel.CategoryViewModel
import com.br.app.deliverydelicatessen.viewmodel.CategoryViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModel
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel
import com.br.app.deliverydelicatessen.viewmodel.ShoppingCartViewModel
import com.google.android.material.snackbar.Snackbar
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.Executors

class ProductsFragment : Fragment() {

    private val viewModelCategory: CategoryViewModelSelect by activityViewModels()
    private val viewModelDetail: DelicatessenProductViewModelSelect by activityViewModels()
    private lateinit var viewModel: CategoryViewModel
    private lateinit var viewModelProduct: DelicatessenProductViewModel
    private val viewModelShoppingCart: ShoppingCartViewModel by activityViewModels()
    private lateinit var binding: FragmentProductsBinding
    private lateinit var adapterProduct: ProductAdapter
    private lateinit var adapterCategory: CategoryAdapter
    private lateinit var viewModelMain: MainViewModel
    private var datasource: DataSourceConfig? = null
    private var dataSourceShoppingCart: DataSourceShoppingCart? = null
    private var dataSourceUser: DataSourceUser? = null
    private var shoppingCarts: ArrayList<ShoppingCart>? = ArrayList()
    private lateinit var config: Config
    private var user: User = User()
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
                LayoutInflater.from(context),
                R.layout.fragment_products,
                container,
                false
        )
        return binding.root
    }


    @SuppressLint("ResourceType")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setHasOptionsMenu(true);
        datasource = context?.let { DataSourceConfig(it) }
        dataSourceShoppingCart = context?.let { DataSourceShoppingCart(it) }
        dataSourceUser = context?.let { DataSourceUser(it) }
        config = datasource?.get()!!
        user = dataSourceUser?.get()!!

        viewModel = ViewModelProvider(this)[CategoryViewModel::class.java]
        viewModelProduct = ViewModelProvider(this)[DelicatessenProductViewModel::class.java]
        adapterProduct = ProductAdapter(arrayListOf(), viewModelDetail)

        activity?.run {
            viewModelMain = ViewModelProvider(this)[MainViewModel::class.java]
        } ?: throw Throwable("invalid activity")

        binding.bottomNavView.setOnItemSelectedListener {
            when (it.itemId) {
                R.id.navigation_account -> {
                    view?.findNavController()?.navigate(R.id.nav_account)
                    return@setOnItemSelectedListener true
                }

                R.id.navigation_order -> {
                    view?.findNavController()?.navigate(R.id.nav_order)
                    return@setOnItemSelectedListener true
                }

                R.id.navigation_shopping_cart -> {
                var total = dataSourceShoppingCart!!.getTotalValue()
                if ( total == 0.0) {
                    view.let {v ->
                        MainUtils.snackCenter(v.getRootView(), this.resources.getString(R.string.validation_shopping_cart_empty), Snackbar.LENGTH_LONG)
                    }
                    return@setOnItemSelectedListener true
                } else {
//                    changeActivity()
                    view?.findNavController()?.navigate(R.id.nav_shopping_cart)
                }
                    return@setOnItemSelectedListener true
                }

            }
            false
        }
        dataSourceShoppingCart!!.getTotalValue()?.let {
            binding.bottomNavView.menu[0].title = nFormat.format(it)
        }

        binding.imageView.setOnClickListener{
            getPromotions(config.id)
        }

        binding.imageButton.setOnClickListener{
            var config = datasource?.get()!!
            if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {

                if (binding.editTextSearch.text.isEmpty()) {
                    binding.editTextSearch?.error = requireActivity().resources.getString(R.string.validation_search_description)
                    binding.editTextSearch?.requestFocus()
                    return@setOnClickListener
                }
                getByDescription(config.id, binding.editTextSearch.text.toString())
            } else {
                val manager: FragmentManager = (this as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(R.string.label_warning.toString(),R.string.validation_connection.toString())
                dialog?.show(manager, "dialog")
            }

        }

        viewModel.categoryDTO.observe(viewLifecycleOwner) {
            if (it.categorys.isEmpty()) {
                val manager: FragmentManager = (context as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(requireActivity().resources.getString(R.string.label_warning),requireActivity().resources.getString(R.string.validation_category_not_found))
                dialog?.show(manager, "dialog")
            } else {
                val o = MainUtils.getStatusOpeningHours(it.openingHours.sortedBy { o -> o.weekday })
                if (o != null) {
                    viewModelMain.updateActionBarStatus(o)
                } else {
                    viewModelMain.updateActionBarStatus(null)
                }

                loadCategory(it.categorys)
                if (it.imageName.isNotEmpty()) {
                    loadBanner(it.imageName)
                }

            }
            binding.progressBar.visibility = View.GONE
        }

        viewModelProduct.delicatessenProducts.observe(viewLifecycleOwner) {
            if (it.isEmpty()) {
                val manager: FragmentManager = (context as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(requireActivity().resources.getString(R.string.label_warning),requireActivity().resources.getString(R.string.validation_products_not_found))
                dialog?.show(manager, "dialog")
            } else {
                loadProducts(it as MutableList<DelicatessenProduct>)
            }
            binding.progressBar.visibility = View.GONE
        }

        viewModel.errorMessage.observe(viewLifecycleOwner) {
            if (it.code == 400) {
                val manager: FragmentManager = (context as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(requireActivity().resources.getString(R.string.label_warning),it.message)
                dialog?.show(manager, "dialog")
            }
            if (it.code == 401) {
                val manager: FragmentManager = (context as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(requireActivity().resources.getString(R.string.label_warning),it.message)
                dialog?.show(manager, "dialog")
                
            }
        }

        viewModelProduct.errorMessage.observe(viewLifecycleOwner) {
            if (it.code == 400) {
                val manager: FragmentManager = (context as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(requireActivity().resources.getString(R.string.label_warning),it.message)
                dialog?.show(manager, "dialog")
            }
        }

        viewModelCategory.selected.observe(viewLifecycleOwner) { item ->
            if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
                item.getContentIfNotHandled()?.let {
                    getByCategory(config.id, it.id)
                }

            } else {
                val manager: FragmentManager = (this as AppCompatActivity).supportFragmentManager
                val dialog = AlertDialogMessageGeneric(R.string.label_warning.toString(),R.string.validation_connection.toString())
                dialog?.show(manager, "dialog")
            }
        }

        viewModelDetail.selected.observe(viewLifecycleOwner) { item ->
                item.getContentIfNotHandled()?.let { product ->
                    shoppingCarts = dataSourceShoppingCart?.getAll()
                    var vl : Double = if (product.promotion) {
                        product.promotionValue!!
                    } else {
                        product.value!!
                    }
                    var shoppingCart = ShoppingCart(
                        product.imageName,
                        product.description,
                        "",
                        1.00,
                        product.id,
                        vl)
                    if (shoppingCarts!!.isEmpty()) {
                        shoppingCarts!!.add(shoppingCart)
                        dataSourceShoppingCart?.insert(shoppingCarts!!)
                    } else {
                        var existShoppingCart = shoppingCarts!!.find { it.delicatessenProductId == shoppingCart.delicatessenProductId }
                        if (existShoppingCart != null) {
                            shoppingCart.quantity = existShoppingCart.quantity?.plus(1)
                            shoppingCarts!!.remove(existShoppingCart)
                            shoppingCarts!!.add(shoppingCart)
                            dataSourceShoppingCart?.deleteAll()
                            dataSourceShoppingCart?.insert(shoppingCarts!!)
                        } else {
                            shoppingCarts?.add(shoppingCart)
                            dataSourceShoppingCart?.deleteAll()
                            dataSourceShoppingCart?.insert(shoppingCarts!!)
                        }
                    }
//                    dataSourceShoppingCart!!.getTotalValue()?.let { viewModelShoppingCart.updateValue(it) }
                    dataSourceShoppingCart!!.getTotalValue()?.let {
                        binding.bottomNavView.menu[0].title = nFormat.format(it)
                    }

//                    binding.bottomNavView.menu[0].title = requireActivity().resources.getString(R.string.validation_category_not_found)

                }
        }

        viewModelShoppingCart.go.observe(viewLifecycleOwner) { item ->
            item.getContentIfNotHandled()?.let {
                if (it) {
                    view?.findNavController()?.navigate(R.id.nav_shopping_cart)
                }
            }
        }


        viewModel.loading.observe(viewLifecycleOwner, Observer {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        })

        viewModelProduct.loading.observe(viewLifecycleOwner, Observer {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        })

        activity?.onBackPressedDispatcher?.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                activity!!.finish()
            }
        })

        getInitial(config.id)
        }

    private fun getInitial(establishmentId: Int) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            val filter = CategoryDTO(establishmentId)
            viewModel.getInitial(filter)
        } else {
            val manager: FragmentManager = (this as AppCompatActivity).supportFragmentManager
            val dialog = AlertDialogMessageGeneric(R.string.label_warning.toString(),R.string.validation_connection.toString())
            dialog?.show(manager, "dialog")
        }
    }

        private fun loadCategory(categorys: MutableList<Category>) {
        adapterCategory = CategoryAdapter(categorys, viewModelCategory)
        binding.recyclerViewCategory.apply {
            adapter = adapterCategory
            layoutManager = LinearLayoutManager(context, RecyclerView.HORIZONTAL, false)
        }
    }

    private fun loadBanner(imageName: String) {
        binding.imageView.visibility = View.VISIBLE
        binding.recyclerViewProducts.visibility = View.GONE
        val executor = Executors.newSingleThreadExecutor()
        val handler = Handler(Looper.getMainLooper())
        var image: Bitmap? = null

        // Only for Background process (can take time depending on the Internet speed)
        executor.execute {

            // Image URL
            val imageURL = MainUtils.urlImageEstablishment + imageName

            // Tries to get the image and post it in the ImageView
            // with the help of Handler
            try {
                val `in` = java.net.URL(imageURL).openStream()
                image = BitmapFactory.decodeStream(`in`)

                // Only for making changes in UI
                handler.post {
                    binding.imageView.setImageBitmap(image)
                }
            }

            // If the URL doesnot point to
            // image or any other kind of failure
            catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun getByCategory(establishmentId: Int, categoryId: Int) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            val filter = DelicatessenProduct("","","","",false,false,establishmentId,categoryId,0.0,0.0,0 )
            viewModelProduct.getByCategory(filter);
        } else {
            val manager: FragmentManager = (this as AppCompatActivity).supportFragmentManager
            val dialog = AlertDialogMessageGeneric(R.string.label_warning.toString(),R.string.validation_connection.toString())
            dialog?.show(manager, "dialog")
        }
    }

    private fun getByDescription(establishmentId: Int, description: String) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            val filter = DelicatessenProduct("",description,"","",false,false,establishmentId,0,0.0,0.0,0 )
            viewModelProduct.getByDescription(filter);
        } else {
            val manager: FragmentManager = (this as AppCompatActivity).supportFragmentManager
            val dialog = AlertDialogMessageGeneric(R.string.label_warning.toString(),R.string.validation_connection.toString())
            dialog?.show(manager, "dialog")
        }
    }

    private fun getPromotions(establishmentId: Int) {
        if (context?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            val filter = DelicatessenProduct("","","","",false,false,establishmentId,0, 0.0,0.0,0 )
            viewModelProduct.getPromotions(filter);
        } else {
            val manager: FragmentManager = (this as AppCompatActivity).supportFragmentManager
            val dialog = AlertDialogMessageGeneric(R.string.label_warning.toString(),R.string.validation_connection.toString())
            dialog?.show(manager, "dialog")
        }
    }

    private fun loadProducts(products: MutableList<DelicatessenProduct>) {
        adapterProduct = ProductAdapter(products, viewModelDetail)
        binding.recyclerViewProducts.visibility = View.VISIBLE
        binding.recyclerViewProducts.apply {
            adapter = adapterProduct
            layoutManager = LinearLayoutManager(context)
        }
        binding.imageView.visibility = View.GONE
        binding.recyclerViewProducts.visibility = View.VISIBLE
    }


}



