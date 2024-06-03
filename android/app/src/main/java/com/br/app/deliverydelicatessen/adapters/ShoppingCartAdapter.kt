package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.database.DataSourceShoppingCart
import com.br.app.deliverydelicatessen.databinding.CardViewShoppingCartBinding
import com.br.app.deliverydelicatessen.model.ShoppingCart
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.ShoppingCartViewModel
import com.squareup.picasso.Picasso
import java.text.NumberFormat
import java.util.*

class ShoppingCartAdapter(
    private var shoppingCarts: List<ShoppingCart>,
    var viewModelShoppingCart: ShoppingCartViewModel,
    private var dataSourceShoppingCart: DataSourceShoppingCart?
) :
        RecyclerView.Adapter<ShoppingCartAdapter.RecyclerViewViewHolder>(), Filterable {
    private var productsFilter: List<ShoppingCart> = arrayListOf()
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewShoppingCartBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_shopping_cart,
                parent,
                false)

        return RecyclerViewViewHolder(binding)
    }

    init {
        productsFilter = shoppingCarts
    }

    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(productsFilter, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewShoppingCartBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<ShoppingCart>, position: Int) {
            binding.textViewDescription.text = lst[position].description
            if (lst[position].imageName !== null) {
                Picasso.get()
                    .load(MainUtils.urlImageProduct + lst[position].imageName)
                    .into(binding.imageView)
            }

                binding.constraintLayout.visibility = View.VISIBLE
                binding.textViewValue.text = nFormat.format(lst[position].value)
            binding.textViewSubtotal.text = nFormat.format(lst[position].value * lst[position].quantity!!)
                binding.textViewQuantity.text = lst[position].quantity?.toInt().toString()

            if (lst[position].quantity?.toInt() == 1) {
                binding.btnDecrement.isEnabled = false
                binding.btnDecrement.isClickable  = false
            } else {
                binding.btnDecrement.isEnabled = true
                binding.btnDecrement.isClickable  = true
            }

            binding.btnIncrement.setOnClickListener {
                increment(lst[position])
            }

            binding.btnDecrement.setOnClickListener {
                decrement(lst[position])
            }

        }
    }

    internal fun increment(shoppingCart: ShoppingCart) {
        shoppingCarts.find { it!!.delicatessenProductId == shoppingCart.delicatessenProductId }?.quantity =
            shoppingCart.quantity?.plus(1)
        notifyDataSetChanged()
        dataSourceShoppingCart?.deleteAll()
        dataSourceShoppingCart?.insert(shoppingCarts)
        dataSourceShoppingCart!!.getTotalValue()?.let { viewModelShoppingCart.updateValue(it) }
    }

    internal fun decrement(shoppingCart: ShoppingCart) {
        shoppingCarts.find { it!!.delicatessenProductId == shoppingCart.delicatessenProductId }?.quantity =
            shoppingCart.quantity?.minus(1)
        notifyDataSetChanged()
        dataSourceShoppingCart?.deleteAll()
        dataSourceShoppingCart?.insert(shoppingCarts)
        dataSourceShoppingCart!!.getTotalValue()?.let { viewModelShoppingCart.updateValue(it) }
    }

    override fun getItemCount(): Int {
        return productsFilter.size
    }

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val charSearch = constraint.toString()
                if (charSearch.isEmpty()) {
                    productsFilter = shoppingCarts
                } else {
                    val resultList = ArrayList<ShoppingCart>()
                    for (row in shoppingCarts) {
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
                productsFilter = results?.values as List<ShoppingCart>
                notifyDataSetChanged()
            }

        }
    }

}