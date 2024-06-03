package com.br.app.deliverydelicatessen

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.navigation.ui.AppBarConfiguration
import android.view.View
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.ViewModelProvider
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceConfig
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.ActivityMainBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.DeliveryRegion
import com.br.app.deliverydelicatessen.model.DeliveryRegionSearch
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.ui.components.AlertDialogMessageGeneric
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.utils.Mask
import com.br.app.deliverydelicatessen.viewmodel.DeliveryRegionViewModel
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.material.snackbar.Snackbar
import java.net.UnknownHostException

class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private var datasource: DataSourceConfig? = null
    private var datasourceUser: DataSourceUser? = null
    private var dataSourceAddress: DataSourceAddress? = null
    private lateinit var viewModel: DeliveryRegionViewModel
    private lateinit var fusedLocationClient: FusedLocationProviderClient
//    private var geocoderAddress: android.location.Address? = null
    private lateinit var config: Config
    private lateinit var user: User
    private lateinit var deliveryRegionSearch: DeliveryRegionSearch
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        try {
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        datasource = DataSourceConfig(this)
        datasourceUser = DataSourceUser(this)
        dataSourceAddress = DataSourceAddress(this)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        config = datasource?.get()!!
        deliveryRegionSearch = dataSourceAddress!!.get()
        user = datasourceUser!!.get()


        if (deliveryRegionSearch.postalCode.isNotEmpty() && user.token.isNotEmpty()) {
            startActivity(Intent(this, ProductsActivity::class.java))
            finish()
        }

        if (deliveryRegionSearch.postalCode.isNotEmpty() && user.token.isEmpty()) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }

        viewModel = ViewModelProvider(this)[DeliveryRegionViewModel::class.java]
        binding.progressBar.visibility = View.GONE
        binding.editTextPostalCode.addTextChangedListener(Mask.insert("#####-###", binding.editTextPostalCode))
        binding.linearLayoutPostalCode.visibility = View.GONE

        binding.btnVerify.setOnClickListener {
            if (this?.let { it1 -> MainUtils.isOnline(it1) }!!) {
                if (binding.editTextPostalCode.text.isEmpty()) {
                    binding.editTextPostalCode?.error = this.resources.getString(R.string.validation_postal_code)
                    binding.editTextPostalCode?.requestFocus()
                    return@setOnClickListener
                }
                onAvailability(binding.editTextPostalCode.text.toString(), config.id)
            } else {
                MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), this.resources.getString(R.string.validation_connection), Snackbar.LENGTH_LONG)
            }

        }



        binding.btnPermision.setOnClickListener {
            requestGpsPermission()
        }

        binding.btnJump.setOnClickListener {
            binding.linearLayoutGps.visibility = View.GONE
            binding.linearLayoutPostalCode.visibility = View.VISIBLE
        }

        binding.btnGoBack.setOnClickListener {
            binding.linearLayoutGps.visibility = View.VISIBLE
            binding.linearLayoutPostalCode.visibility = View.GONE
        }

        viewModel.deliveryRegion.observe(this) {
            if (it.postalCode === null) {
                MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), this!!.resources.getString(R.string.msg_deliver_region_not_found), Snackbar.LENGTH_LONG)
                binding.btnPermision.isEnabled = true
                binding.btnJump.isEnabled = true
            } else {
                binding.btnPermision.isEnabled = true
                binding.btnJump.isEnabled = true
                deliveryRegionSearch = DeliveryRegionSearch(it.postalCode)
                dataSourceAddress!!.insert(deliveryRegionSearch)
                finishAffinity()
                startActivity(Intent(this, LoginActivity::class.java))
            }
        }

        viewModel.loading.observe(this) {
            if (it) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModel.errorMessage.observe(this) {
            MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), it.message, Snackbar.LENGTH_LONG)
        }
        } catch (e: Exception) {
            e.message?.let { Log.e("Exception: %s", it) }
        }

    }

    private fun onAvailability(postalCode: String, establishmentId: Int){
        try {
        val filter = DeliveryRegion(postalCode.replace("-",""),false,establishmentId,0.0,0)
        viewModel.getAvailability(filter)
    } catch (e: UnknownHostException) {
        e.message?.let { Log.e("Exception: %s", it) }
    }
    }

    private fun isPermissionGranted(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            android.Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestGpsPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(android.Manifest.permission.ACCESS_COARSE_LOCATION, android.Manifest.permission.ACCESS_FINE_LOCATION),
            GPS_PERMISSION_CODE
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == GPS_PERMISSION_CODE) {
            if (grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.checkSelfPermission(
                        this,
                        Manifest.permission.ACCESS_FINE_LOCATION
                    ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                        this,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    ) != PackageManager.PERMISSION_GRANTED
                ) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return
                }
                fusedLocationClient.lastLocation
                    .addOnSuccessListener {
                        if (it != null) {
                            var geocoderAddress = MainUtils.getAddress(it.latitude, it.longitude, this)!!
                            if (geocoderAddress != null) {
                                onAvailability(geocoderAddress!!.postalCode, config.id)
                            } else {
                                MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), this.resources.getString(R.string.validation_address_not_found), Snackbar.LENGTH_LONG)
                            }
                        } else {
                            MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), this.resources.getString(R.string.validation_address_not_found), Snackbar.LENGTH_LONG)

                        }

                    }
            } else {
                MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), this.resources.getString(R.string.label_permission_denied), Snackbar.LENGTH_LONG)
            }
        }
    }

    companion object {
        private const val GPS_PERMISSION_CODE = 1000
    }

    private fun disableControlsJump() {
        binding.btnVerify.isEnabled = false
        binding.btnGoBack.isEnabled = false
        binding.editTextPostalCode.isEnabled = false
        binding.btnPermision.isEnabled = false
        binding.btnJump.isEnabled = false
    }

    private fun enableControlsJump() {
        binding.btnVerify.isEnabled = true
        binding.btnGoBack.isEnabled = true
        binding.editTextPostalCode.isEnabled = true
        binding.btnPermision.isEnabled = false
        binding.btnJump.isEnabled = false
    }


}