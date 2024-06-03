package com.br.app.deliverydelicatessen.ui.about

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.FragmentAboutBinding
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel


class FragmentAbout : Fragment() {
    private lateinit var binding: FragmentAboutBinding
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = DataBindingUtil.inflate(
            LayoutInflater.from(context),
            R.layout.fragment_about,
            container,
            false
        )
        binding.versaoTextView.text = getPackageVersion()

        binding.circleImageView.setOnClickListener {
            getOpenFacebookIntent()?.let { it1 -> startActivity(it1) }
        };

        return binding.root
    }

    private fun getPackageVersion(): String? {
        try {
            val pInfo = requireContext().packageManager.getPackageInfo(requireContext().packageName, 0)
            return pInfo.versionName
        } catch (e: PackageManager.NameNotFoundException) {
            //e.printStackTrace();
        }
        return "0.0"
    }

    private fun getOpenFacebookIntent(): Intent? {
        return try {
            requireContext().packageManager.getPackageInfo("com.facebook.katana", 0)
            Intent(Intent.ACTION_VIEW, Uri.parse("fb://page/101776697900227"))
        } catch (e: Exception) {
            Intent(Intent.ACTION_VIEW, Uri.parse("https://www.facebook.com/produzeservicos"))
        }
    }
}