package com.br.app.deliverydelicatessen.database

import android.content.ContentValues
import android.content.Context
import android.database.SQLException
import android.database.sqlite.SQLiteDatabase
import com.br.app.deliverydelicatessen.model.Address
import java.lang.Exception
import java.util.*

class DataSourceLastAddress constructor(context: Context){
    private val dbHelper = SqliteHelper(context)
    private var database: SQLiteDatabase? = null
    private lateinit var address: Address

    @Throws(SQLException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    private fun close() {
        dbHelper.close()
    }

    fun insert(address: Address)
    {
        try {
            open()
            val values = ContentValues().apply {
                put("id", address.id)
                put("postalCode", address.postalCode.filterNot { it === '-' })
                put("street", address.street)
                put("reference", address.reference)
                put("district", address.district)
                put("city", address.city)
                put("uf", address.uf)
            }
            database?.insert("LastAddress", null, values)
        }
        catch (e: Exception) {
        } finally {
            close()
        }
    }

    fun deleteAll() {
        try {
            open()
            database!!.delete("LastAddress", "", null)
        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
    }

    fun get(): Address {
        address = Address()
        try {
            open()
            val cursor = database?.rawQuery("select * from LastAddress", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    address.id = getInt(getColumnIndexOrThrow("id"))
                    address.postalCode = getString(getColumnIndexOrThrow("postalCode"))
                    address.street = getString(getColumnIndexOrThrow("street"))
                    address.reference = getString(getColumnIndexOrThrow("reference"))
                    address.district = getString(getColumnIndexOrThrow("district"))
                    address.city = getString(getColumnIndexOrThrow("city"))
                    address.uf = getString(getColumnIndexOrThrow("uf"))
                }
            }

        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
        return address
    }


}