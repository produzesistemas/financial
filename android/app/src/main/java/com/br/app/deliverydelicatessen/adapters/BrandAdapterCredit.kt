package com.br.app.deliverydelicatessen.adapters

import android.content.Context
import android.database.DataSetObserver
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.SpinnerAdapter
import android.widget.TextView
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewBrandBinding
import com.br.app.deliverydelicatessen.model.EstablishmentBrandCredit
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.BrandViewModelSelect
import com.squareup.picasso.Picasso


class BrandAdapterCredit(val context: Context,
                         private var brands: List<EstablishmentBrandCredit>) : BaseAdapter() {

    private val inflater: LayoutInflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater

    override fun registerDataSetObserver(observer: DataSetObserver?) {

    }

    override fun unregisterDataSetObserver(observer: DataSetObserver?) {

    }

    override fun getCount(): Int {
        return brands.size
    }

    override fun getItem(position: Int): Any {
        return brands[position];
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val view: View
        val vh: ItemHolder
        if (convertView == null) {
            view = inflater.inflate(R.layout.card_view_brand, parent, false)
            vh = ItemHolder(view)
            view?.tag = vh
        } else {
            view = convertView
            vh = view.tag as ItemHolder
        }
        vh.label.text = brands.get(position).brand!!.name

                    Picasso.get()
                .load(MainUtils.urlImageBrand + brands[position].brand!!.imageName)
                .into(vh.img)
        return view
    }

    override fun getViewTypeCount(): Int {
        return 1
    }

    override fun isEmpty(): Boolean {
        return true
    }

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup?): View {
        return getView(position, convertView, parent)
    }

    private class ItemHolder(row: View?) {
        val label: TextView
        val img: ImageView

        init {
            label = row?.findViewById(R.id.textViewBrand) as TextView
            img = row?.findViewById(R.id.imageView) as ImageView
        }
    }

}