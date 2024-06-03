package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewProductBinding
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModel
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModelSelect
import com.squareup.picasso.Picasso
import java.text.NumberFormat
import java.util.*

class ProductAdapter(
    private var products: List<DelicatessenProduct>,
    var viewModelDetail: DelicatessenProductViewModelSelect) :
        RecyclerView.Adapter<ProductAdapter.RecyclerViewViewHolder>(), Filterable {

    private lateinit var product: DelicatessenProduct
    private var productsFilter: List<DelicatessenProduct> = arrayListOf()
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewProductBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_product,
                parent,
                false)

        return RecyclerViewViewHolder(binding)
    }

    init {
        productsFilter = products
    }

    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(productsFilter, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewProductBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<DelicatessenProduct>, position: Int) {
            binding.textViewDescription.text = lst[position].description
            binding.textViewDetail.text = lst[position].detail

            if (lst[position].imageName !== null) {
                Picasso.get()
                    .load(MainUtils.urlImageProduct + lst[position].imageName)
                    .into(binding.imageView)
            }

            if (lst[position].promotion) {
                binding.constraintLayoutPromotion.visibility = View.VISIBLE
                binding.textViewValuePromotional.text = nFormat.format(lst[position].promotionValue)
                binding.textViewValueIn.text = nFormat.format(lst[position].value)
            } else {
                binding.constraintLayout.visibility = View.VISIBLE
                binding.textViewValue.text = nFormat.format(lst[position].value)
            }

            binding.btnShoppingCart.setOnClickListener {
                product = lst[position]
                        viewModelDetail.select(product)
                }
        }
    }

    override fun getItemCount(): Int {
        return productsFilter.size
    }

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val charSearch = constraint.toString()
                if (charSearch.isEmpty()) {
                    productsFilter = products
                } else {
                    val resultList = ArrayList<DelicatessenProduct>()
                    for (row in products) {
                        if (row.description.contains(charSearch, true)
                        ) {
                            resultList.add(row)
                        }
                    }
                    productsFilter = resultList
                }
                val filterResults = FilterResults()
                filterResults.values = productsFilter
                return filterResults
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                productsFilter = results?.values as List<DelicatessenProduct>
                notifyDataSetChanged()
            }

        }
    }

}