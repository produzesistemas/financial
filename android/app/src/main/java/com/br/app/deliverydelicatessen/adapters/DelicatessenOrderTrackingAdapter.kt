package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewTrackingBinding
import com.br.app.deliverydelicatessen.model.DelicatessenOrderTracking
import java.text.SimpleDateFormat

class DelicatessenOrderTrackingAdapter(
    private var trackings: List<DelicatessenOrderTracking>) :
        RecyclerView.Adapter<DelicatessenOrderTrackingAdapter.RecyclerViewViewHolder>() {
    var df = SimpleDateFormat("dd/MM/yyyy")
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewTrackingBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_tracking,
                parent,
                false)

        return RecyclerViewViewHolder(binding)
    }


    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(trackings, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewTrackingBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<DelicatessenOrderTracking>, position: Int) {
            binding.textViewStatus.text = lst[position].statusOrder!!.description
            binding.textViewfollowupDate.text = df.format(lst[position].followupDate)
        }
    }

    override fun getItemCount(): Int {
        return trackings.size
    }

}