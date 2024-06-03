package com.br.app.deliverydelicatessen.database

import android.content.ContentValues
import android.content.Context
import android.database.SQLException
import android.database.sqlite.SQLiteDatabase
import com.br.app.deliverydelicatessen.model.Config
import com.br.app.deliverydelicatessen.model.DeliveryRegionSearch
import java.lang.Exception
import java.util.*

class DataSourceDelivery constructor(context: Context){
    private val dbHelper = SqliteHelper(context)
    private var database: SQLiteDatabase? = null
    private lateinit var config: Config

    @Throws(SQLException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    private fun close() {
        dbHelper.close()
    }

    fun get(): Boolean {
        var isDelivery = false
        try {
            open()
            val cursor = database?.rawQuery("select * from Delivery", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    if (getInt(getColumnIndexOrThrow("isDelivery")) == 0) {
                        isDelivery = false
                    } else {
                        isDelivery = true
                    }

                }
            }

        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
        return isDelivery
    }

    fun insert(isDelivery: Boolean)
    {
        try {
            open()
            val values = ContentValues().apply {
                if (isDelivery) {
                    put("isDelivery", 1)
                } else {
                    put("isDelivery", 0)
                }

            }
            database?.insert("Delivery", null, values)
        }
        catch (e: Exception) {
        } finally {
            close()
        }
    }

    fun deleteAll() {
        try {
            open()
            database!!.delete("Delivery", "", null)
        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
    }
}