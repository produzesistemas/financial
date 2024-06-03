package com.br.app.deliverydelicatessen.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.FragmentManager
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.br.app.deliverydelicatessen.R
import com.br.app.deliverydelicatessen.databinding.CardViewAddressBinding
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.ui.address.AlertDialogDelete
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModel
import com.br.app.deliverydelicatessen.viewmodel.AddressViewModelSelect
import com.br.app.deliverydelicatessen.viewmodel.MainViewModel

class AddressAdapter(
    private var lstAddress: List<Address>,
    var viewModelMain: MainViewModel,
    var viewModel: AddressViewModel,
    var viewModelSelect: AddressViewModelSelect
) :
        RecyclerView.Adapter<AddressAdapter.RecyclerViewViewHolder>() {
    private var positionSelected: Int = 0
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerViewViewHolder {
        val binding: CardViewAddressBinding = DataBindingUtil.inflate(
                LayoutInflater.from(parent.context),
                R.layout.card_view_address,
                parent,
                false)

        return RecyclerViewViewHolder(binding)
    }

    override fun getItemCount(): Int {
        return lstAddress.size
    }

    override fun onBindViewHolder(holder: RecyclerViewViewHolder, position: Int) {
        holder.bind(lstAddress, position)
    }

    inner class RecyclerViewViewHolder(
        private val binding: CardViewAddressBinding) :
            RecyclerView.ViewHolder(binding.root) {

        fun bind(lst: List<Address>, position: Int) {
            binding.textViewPostalCode.text = lst[position].postalCode.substring(0,5) + "-" + lst[position].postalCode.substring(5,8)
            binding.textViewCity.text = lst[position].city
            binding.textViewUf.text = lst[position].uf
            binding.textViewDistrict.text = lst[position].district
            binding.textViewReference.text = lst[position].reference
            binding.textViewStreet.text = lst[position].street

            binding.btnDelete.setOnClickListener {
                    val manager: FragmentManager = (itemView.context as AppCompatActivity).supportFragmentManager
                    val dialog = AlertDialogDelete(viewModel, lst[position])
                    dialog?.show(manager, "dialog")
            }

            binding.btnEdit.setOnClickListener {
                viewModelSelect.select(lst[position])
                it?.findNavController()?.navigate(R.id.nav_new_address)
            }

            binding.btnUncheck.setOnClickListener{
//                positionSelected = position
                lst[position].let { viewModelMain.updateActionBarTitle(lst[position].postalCode.filterNot { it === '-' }) }
                positionSelected = position
                notifyDataSetChanged()
            }
            if (positionSelected !== position) {
                binding.cardView.setBackgroundResource(R.drawable.custom_background_panel_white)
                binding.btnUncheck.visibility = View.VISIBLE
                binding.btnCheck.visibility = View.GONE
            } else {
                binding.cardView.setBackgroundResource(R.drawable.custom_background_selected)
                binding.btnUncheck.visibility = View.GONE
                binding.btnCheck.visibility = View.VISIBLE
                binding.btnDelete.visibility = View.GONE
            }
            if (lst[position].id == 0) {
                binding.btnDelete.visibility = View.GONE
            }
        }
    }


}