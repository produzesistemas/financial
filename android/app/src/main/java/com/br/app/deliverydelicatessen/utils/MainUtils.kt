package com.br.app.deliverydelicatessen.utils

import android.annotation.SuppressLint
import android.content.Context
import android.location.Address
import android.location.Geocoder
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiInfo
import android.net.wifi.WifiManager
import android.os.Build
import android.util.Log
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import com.br.app.deliverydelicatessen.model.DelicatessenOrderTracking
import com.br.app.deliverydelicatessen.model.OpeningHours
import com.google.android.material.snackbar.Snackbar
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*


object MainUtils {

    const val IMAGE_QUALITY = 25
    var urlImageEstablishment = "https://www.produzesistemas.com.br/Files/Establishment/"
    var urlImageProduct = "https://www.produzesistemas.com.br/Files/Product/"
    var urlImageCategory = "https://www.produzesistemas.com.br/Files/Category/"
    var urlImageBrand = "https://www.produzesistemas.com.br/Files/Brand/"
    var urlBase = "https://www.produzesistemas.com.br/"

    private val currentDate: Date
        get() = Calendar.getInstance().time
    val currentOnlyDateStr: String
        get() {
            val sdf = SimpleDateFormat("dd/MM/yyyy")
            return sdf.format(Date())
        }

    fun formatHour(date: Date?): String {
        val df = SimpleDateFormat("HH:mm")
        return df.format(date)
    }

    fun formatDate(date: Date?): String {
        val df = SimpleDateFormat("dd/MM/yyyy")
        return df.format(date)
    }

    fun formatDateGlobal(date: Date?): String {
        val df = SimpleDateFormat("yyyy-MM-dd")
        return df.format(date)
    }

    fun getMonth(mes: Int): String {
        var nomeMes = ""
        nomeMes = when (mes) {
            1 -> "Jan"
            2 -> "Fev"
            3 -> "Mar"
            4 -> "Abr"
            5 -> "Mai"
            6 -> "Jun"
            7 -> "Jul"
            8 -> "Ago"
            9 -> "Set"
            10 -> "Out"
            11 -> "Nov"
            12 -> "Dez"
            else -> "Mês inválido"
        }
        return nomeMes
    }

    private val dias = arrayOf(
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-Feira",
        "Sábado"
    )

    fun getWeekName(day: Int): String {
        return dias[day]
    }

    fun getAbbreviatedWeekName(day: Int): String {
        return dias[day - 1].substring(0,3)
    }
    fun getMonthInt(mes: String?): Int {
        var nomeMes = 0
        nomeMes = when (mes) {
            "Jan" -> 1
            "Fev" -> 2
            "Mar" -> 3
            "Abr" -> 4
            "Mai" -> 5
            "Jun" -> 6
            "Jul" -> 7
            "Ago" -> 8
            "Set" -> 9
            "Out" -> 10
            "Nov" -> 11
            "Dez" -> 12
            else -> 0
        }
        return nomeMes
    }

    fun isOnline(context: Context): Boolean {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            val capabilities = connectivityManager.getNetworkCapabilities(connectivityManager.activeNetwork)
            capabilities !=null &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
        } else {
            @Suppress("DEPRECATION")
            return false
        }
    }

    fun snackCenter(view: View, message: String, duration: Int) {
        val snack: Snackbar = view?.let {
            Snackbar
                .make(it, message, duration)
        }!!
        val viewS = snack.view
        val params = viewS.layoutParams as FrameLayout.LayoutParams
        params.gravity = Gravity.CENTER
        viewS.layoutParams = params
        snack.show()
    }

    fun statusIsCancel(delicatessenOrderTrackings: List<DelicatessenOrderTracking>) : Boolean {
        var isCancel = false
        if (delicatessenOrderTrackings.sortedByDescending { it.followupDate }.first().statusOrderId == 3) {
            isCancel = true
        }
        return isCancel
    }

    fun getAddress(latitude: Double, longitude: Double, context: Context): Address? {
//        val result = StringBuilder()
        try {
            val geocoder = Geocoder(context, Locale.getDefault())
            val addresses: List<*>? = geocoder.getFromLocation(latitude, longitude, 1)
            if (addresses!!.isNotEmpty()) {
                return addresses[0] as Address
//                result.append(address.locality).append("\n")
//                result.append(address.postalCode)
            }
        } catch (e: IOException) {
            Log.e("tag", e.message!!)
        }
//        return result.toString()
        return null
    }


    @SuppressLint("SimpleDateFormat")
    fun getStatusOpeningHours(openingHours: List<OpeningHours>): OpeningHours? {
        val sdf = SimpleDateFormat("HH:mm")
        for (openingHour in openingHours) {
            val calendarCurrent: Calendar = GregorianCalendar()
            calendarCurrent.setTime(currentDate)
            calendarCurrent.add(Calendar.HOUR, -3)
            if (calendarCurrent.get(Calendar.DAY_OF_WEEK) == (openingHour.weekday + 1)) {
                val currentTime = sdf.format(calendarCurrent.time)
                if (currentTime.compareTo(openingHour.startTime) > 0 && currentTime.compareTo(openingHour.endTime) < 0) {
                    return openingHour
                }
            }
        }
        return null
    }
}