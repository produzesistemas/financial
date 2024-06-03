package com.br.app.deliverydelicatessen.database

import android.content.ContentValues
import android.content.Context
import android.database.SQLException
import android.database.sqlite.SQLiteDatabase
import com.br.app.deliverydelicatessen.model.Address
import com.br.app.deliverydelicatessen.model.DeliveryRegionSearch
import java.lang.Exception
import java.util.*

class DataSourceAddress constructor(context: Context){
    private val dbHelper = SqliteHelper(context)
    private var database: SQLiteDatabase? = null
    private lateinit var address: DeliveryRegionSearch

    @Throws(SQLException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    private fun close() {
        dbHelper.close()
    }

    fun insert(address: DeliveryRegionSearch)
    {
        try {
            open()
            val values = ContentValues().apply {
                put("postalCode", address.postalCode.filterNot { it === '-' })
            }
            database?.insert("Address", null, values)
        }
            catch (e: Exception) {
            } finally {
                close()
            }
    }

    fun deleteAll() {
        try {
            open()
            database!!.delete("Address", "", null)
        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
    }

    fun get(): DeliveryRegionSearch {
        address = DeliveryRegionSearch()
        try {
            open()
            val cursor = database?.rawQuery("select * from Address", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    address.postalCode = getString(getColumnIndexOrThrow("postalCode"))
                }
            }

        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
        return address
    }


}