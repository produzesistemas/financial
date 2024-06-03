package com.br.app.deliverydelicatessen.database

import android.content.ContentValues
import android.content.Context
import android.database.SQLException
import android.database.sqlite.SQLiteDatabase
import com.br.app.deliverydelicatessen.model.ShoppingCart
import java.lang.reflect.Array.getDouble
import java.util.*

class DataSourceShoppingCart constructor(context: Context){
    private val dbHelper = SqliteHelper(context)
    private var database: SQLiteDatabase? = null
    private lateinit var shoppingCart: ShoppingCart
    private var shoppingCarts: ArrayList<ShoppingCart>? = null
    @Throws(SQLException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    private fun close() {
        dbHelper.close()
    }

    fun insert(shoppingCarts: List<ShoppingCart>)
    {
        try {
            open()
            shoppingCarts.forEach {
                val values = ContentValues().apply {
                    put("delicatessenProductId", it.delicatessenProductId)
                    put("description", it.description)
                    put("quantity", it.quantity)
                    put("value", it.value)
                    put("obs", it.obs)
                    put("imageName", it.imageName)
                }
                database?.insert("ShoppingCart", null, values)
            }

        }
            catch (e: Exception) {
            } finally {
                close()
            }
    }

    fun deleteAll() {
        try {
            open()
            database!!.delete("ShoppingCart", "", null)
        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
    }

    fun getAll(): ArrayList<ShoppingCart> {
        shoppingCarts = ArrayList()
        shoppingCart = ShoppingCart()
        try {
            open()
            val cursor = database?.rawQuery("select * from ShoppingCart", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    shoppingCart = ShoppingCart()
                    shoppingCart.delicatessenProductId = getInt(getColumnIndexOrThrow("delicatessenProductId"))
                    shoppingCart.description = getString(getColumnIndexOrThrow("description"))
                    shoppingCart.obs = getString(getColumnIndexOrThrow("obs"))
                    shoppingCart.imageName = getString(getColumnIndexOrThrow("imageName"))
                    shoppingCart.quantity = getDouble(getColumnIndexOrThrow("quantity"))
                    shoppingCart.value = getDouble(getColumnIndexOrThrow("value"))
                    shoppingCarts!!.add(shoppingCart)
                }

            }
        } catch (e: java.lang.Exception) {
        } finally {
            database!!.close()
        }
        return shoppingCarts as ArrayList<ShoppingCart>
    }

    fun getTotalValue(): Double? {
        var totalValue = 0.0
        try {
            open()
            val cursor = database?.rawQuery("select * from ShoppingCart", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    var sub = getDouble(getColumnIndexOrThrow("value")) * getDouble(
                        getColumnIndexOrThrow("quantity"))
                    totalValue = totalValue + sub
                }

            }
        } catch (e: java.lang.Exception) {
        } finally {
            close()
        }
        return totalValue
    }

}