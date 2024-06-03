package com.br.app.deliverydelicatessen

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.View
import android.widget.TextView
import com.google.android.material.navigation.NavigationView
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import androidx.drawerlayout.widget.DrawerLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.cardview.widget.CardView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel
import com.br.app.deliverydelicatessen.viewmodel.ShoppingCartViewModel
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import java.lang.Exception
import java.text.NumberFormat
import java.util.Locale

class ProductsActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var viewModelMain: MainViewModel
    private lateinit var viewModelShoppingCart: ShoppingCartViewModel
    private lateinit var viewModelAddress: AddressViewModel
    private var dataSourceAddress: DataSourceAddress? = null
    private var dataSourceUser: DataSourceUser? = null
    private var dataSourceShoppingCart: DataSourceShoppingCart? = null
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    private lateinit var auth: FirebaseAuth
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            setContentView(R.layout.activity_products)
            val toolbar: Toolbar = findViewById(R.id.toolbar)
            val textViewPostalCode: TextView = toolbar.findViewById(R.id.textViewPostalCode)
             val textViewStatus: TextView = toolbar.findViewById(R.id.textViewStatus);
            setSupportActionBar(toolbar)
            supportActionBar?.setDisplayShowTitleEnabled(false)
            val drawerLayout: DrawerLayout = findViewById(R.id.drawer_layout)
            val navView: NavigationView = findViewById(R.id.nav_view)
            dataSourceAddress = DataSourceAddress(this)
            dataSourceUser = DataSourceUser(this)
            dataSourceShoppingCart = DataSourceShoppingCart(this)
            viewModelShoppingCart = ViewModelProvider(this)[ShoppingCartViewModel::class.java]
            viewModelAddress = ViewModelProvider(this)[AddressViewModel::class.java]
            val navController = findNavController(R.id.nav_host_fragment)
            appBarConfiguration = AppBarConfiguration(setOf(
                R.id.nav_product
            ), drawerLayout)
            setupActionBarWithNavController(navController, appBarConfiguration)
            navView.setupWithNavController(navController)
            FirebaseApp.initializeApp(this)
            auth = Firebase.auth
            auth = FirebaseAuth.getInstance()
            navView.menu.findItem(R.id.navigation_logout).setOnMenuItemClickListener {
                signOut()
                true
            }

            navView.menu.findItem(R.id.navigation_change_postal_code).setOnMenuItemClickListener {
                changePostalCode()
                true
            }

            navView.menu.findItem(R.id.navigation_exit_app).setOnMenuItemClickListener {
                finishAffinity()
                true
            }
            viewModelMain = ViewModelProvider(this)[MainViewModel::class.java]
            var deliverRegion = dataSourceAddress!!.get()
            if (deliverRegion.postalCode != null)
                {
                    viewModelMain.updateActionBarTitle(deliverRegion.postalCode)
                }
            viewModelMain.title.observe(this, Observer {
                textViewPostalCode.text = it.substring(0,5) + "-" + it.substring(5,8)
            })

            viewModelMain.openingHour.observe(this, Observer {
                if (it == null) {
                    textViewStatus.text = "Fechado"
                    textViewStatus.setTextColor(ContextCompat.getColor(this, R.color.red))
                } else {
                    textViewStatus.text = "Aberto até às " + it.endTime.substring(0,2) + ":" + it.endTime.substring(2,4)
                    textViewStatus.setTextColor(ContextCompat.getColor(this, R.color.green_variant))
                }

            })

//            viewModelShoppingCart.update.observe(this, Observer {
//                it.getContentIfNotHandled()?.let { vl ->
////                    editTextShoppingCart.text = nFormat.format(vl)
//                }
//            })

            viewModelShoppingCart.clear.observe(this, Observer { booleanEvent ->
                booleanEvent.getContentIfNotHandled()?.let {
                    dataSourceShoppingCart!!.deleteAll()
                    dataSourceShoppingCart!!.getTotalValue()?.let { viewModelShoppingCart.updateValue(it) }
                }
            })

            dataSourceShoppingCart!!.getTotalValue()?.let { viewModelShoppingCart.updateValue(it) }

        } catch (e: Exception) {
            e.message?.let { Log.e("Exception: %s", it) }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    private fun signOut() {
        dataSourceUser?.deleteAll()
        auth.signOut()
        finishAffinity()
        startActivity(Intent(this, LoginActivity::class.java))
    }

    private fun changePostalCode() {
        dataSourceAddress?.deleteAll()
        finishAffinity()
        startActivity(Intent(this, MainActivity::class.java))
    }




}