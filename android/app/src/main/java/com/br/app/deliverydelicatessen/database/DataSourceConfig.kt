package com.br.app.deliverydelicatessen.database

import android.content.ContentValues
import android.content.Context
import android.database.SQLException
import android.database.sqlite.SQLiteDatabase
import com.br.app.deliverydelicatessen.model.Config
import java.lang.Exception
import java.util.*

class DataSourceConfig constructor(context: Context){
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

    fun get(): Config {
        config = Config()
        try {
            open()
            val cursor = database?.rawQuery("select * from Config", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    config.id = getInt(getColumnIndexOrThrow("id"))
                }
            }

        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
        return config
    }


}