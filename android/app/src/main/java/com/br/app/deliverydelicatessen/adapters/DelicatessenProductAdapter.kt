package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewDelicatessenProductBinding
import com.br.app.deliverydelicatessen.model.DelicatessenOrderProduct
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.squareup.picasso.Picasso
import java.text.NumberFormat
import java.util.*

class DelicatessenProductAdapter(
    private var products: List<DelicatessenOrderProduct>) :
        RecyclerView.Adapter<DelicatessenProductAdapter.RecyclerViewViewHolder>() {

    private lateinit var product: DelicatessenProduct
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewDelicatessenProductBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_delicatessen_product,
                parent,
                false)

        return RecyclerViewViewHolder(binding)
    }


    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(products, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewDelicatessenProductBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<DelicatessenOrderProduct>, position: Int) {
            binding.textViewDescription.text = lst[position].delicatessenProduct!!.description
            binding.textViewQuantity.text = lst[position].quantity.toInt().toString()
            if (lst[position].delicatessenProduct!!.imageName !== null) {
                Picasso.get()
                    .load(MainUtils.urlImageProduct + lst[position].delicatessenProduct!!.imageName)
                    .into(binding.imageView)
            }

            if (lst[position].delicatessenProduct!!.promotion) {
                binding.constraintLayoutPromotion.visibility = View.VISIBLE
                binding.textViewValuePromotional.text = nFormat.format(lst[position].delicatessenProduct!!.promotionValue)
                binding.textViewValueIn.text = nFormat.format(lst[position].value)
            } else {
                binding.constraintLayout.visibility = View.VISIBLE
                binding.textViewValue.text = nFormat.format(lst[position].value)
            }
            binding.textViewSubtotal.text = nFormat.format(lst[position].value * lst[position].quantity!!)

        }
    }

    override fun getItemCount(): Int {
        return products.size
    }

}