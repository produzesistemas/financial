package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewCategoryBinding
import com.br.app.deliverydelicatessen.model.Category
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.CategoryViewModelSelect
import com.squareup.picasso.Picasso

class CategoryAdapter(
    private var lstStatus: List<Category>,
    var viewModelSelect: CategoryViewModelSelect
) :
        RecyclerView.Adapter<CategoryAdapter.RecyclerViewViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewCategoryBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_category,
                parent,
                false)
        return RecyclerViewViewHolder(binding)
    }

    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(lstStatus, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewCategoryBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<Category>, position: Int) {
            binding.textViewStatus.text = lst[position].description
            if (lst[position].imageName !== null) {
                Picasso.get()
                    .load(MainUtils.urlImageCategory + lst[position].imageName)
                    .into(binding.imageView)
            }
            binding.cardView.setOnClickListener{
                lst[position].let { viewModelSelect.select(lst[position]) }
            }

            binding.imageView.setOnClickListener{
                lst[position].let { viewModelSelect.select(lst[position]) }
            }

            }
        }

    override fun getItemCount(): Int {
        return lstStatus.size
    }
}