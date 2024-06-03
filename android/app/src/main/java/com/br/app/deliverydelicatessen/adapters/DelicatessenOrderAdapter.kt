package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import androidx.databinding.DataBindingUtil
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewDelicatessenOrderBinding
import com.br.app.deliverydelicatessen.databinding.CardViewProductBinding
import com.br.app.deliverydelicatessen.model.DelicatessenOrder
import com.br.app.deliverydelicatessen.model.DelicatessenProduct
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenOrderViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModel
import com.br.app.deliverydelicatessen.viewmodel.DelicatessenProductViewModelSelect
import com.squareup.picasso.Picasso
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

class DelicatessenOrderAdapter(
    private var orders: List<DelicatessenOrder>,
    var viewModelDetail: DelicatessenOrderViewModelSelect
) :
        RecyclerView.Adapter<DelicatessenOrderAdapter.RecyclerViewViewHolder>(), Filterable {

    private lateinit var order: DelicatessenOrder
    private var ordersFilter: List<DelicatessenOrder> = arrayListOf()
    val nFormat = NumberFormat.getCurrencyInstance(Locale("pt", "BR"))
    var df = SimpleDateFormat("dd/MM/yyyy")
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewDelicatessenOrderBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_delicatessen_order,
                parent,
                false)

        return RecyclerViewViewHolder(binding)
    }

    init {
        ordersFilter = orders
    }

    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(ordersFilter, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewDelicatessenOrderBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<DelicatessenOrder>, position: Int) {
            binding.textViewRequestDate.text = df.format(lst[position].requestDate)
            binding.textViewTotalValue.text = nFormat.format(getTotal(lst[position]))
            binding.textViewStatus.text = getStatus(lst[position])
            binding.cardView.setOnClickListener {
                when (it.id) {
                    R.id.cardView -> {
                        viewModelDetail.select(lst[position])
                        it?.findNavController()?.navigate(R.id.nav_order_detail)
                    }
                }
            }
        }
    }

    override fun getItemCount(): Int {
        return ordersFilter.size
    }

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val charSearch = constraint.toString()
                if (charSearch.isEmpty()) {
                    ordersFilter = orders
                } else {
                    val resultList = ArrayList<DelicatessenOrder>()
//                    for (row in orders) {
//                        if (row.description.contains(charSearch, true)
//                        ) {
//                            resultList.add(row)
//                        }
//                    }
                    ordersFilter = resultList
                }
                val filterResults = FilterResults()
                filterResults.values = ordersFilter
                return filterResults
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                ordersFilter = results?.values as List<DelicatessenOrder>
                notifyDataSetChanged()
            }

        }
    }

    fun getTotal(delicatessenOrder: DelicatessenOrder): Double {
        var total: Double = 0.00
        delicatessenOrder.delicatessenOrderProducts.forEach {
            total = total.plus((it.value * it.quantity))
        }
        if (delicatessenOrder.taxValue != null) {
            total = total.plus((delicatessenOrder.taxValue!!))
        }
        if (delicatessenOrder.couponId != null) {
            if (delicatessenOrder.coupon!!.type) {
                total =  total.minus(delicatessenOrder.coupon!!.value)
            } else {
                total =  (total * delicatessenOrder.coupon!!.value) / 100
            }
        }
        return total
    }

    fun getStatus(delicatessenOrder: DelicatessenOrder): String {
        return delicatessenOrder.delicatessenOrderTrackings.last().statusOrder!!.description
    }
}