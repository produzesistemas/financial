package com.br.app.deliverydelicatessen.database

import android.content.ContentValues
import android.content.Context
import android.database.SQLException
import android.database.sqlite.SQLiteDatabase
import com.br.app.deliverydelicatessen.model.User
import java.lang.Exception
import java.util.*

class DataSourceUser constructor(context: Context){
    private val dbHelper = SqliteHelper(context)
    private var database: SQLiteDatabase? = null
    private lateinit var user: User

    @Throws(SQLException::class)
    fun open() {
        database = dbHelper.writableDatabase
    }

    private fun close() {
        dbHelper.close()
    }

    fun insert(user: User)
    {
        try {
            open()
            val values = ContentValues().apply {
                put("phone", user.phone)
                put("token", "bearer " + user.token)
                put("cpf", user.cpf)
                put("userName", user.userName)
                put("email", user.userName)
            }
            database?.insert("User", null, values)
        }
            catch (e: Exception) {
            } finally {
                close()
            }
    }

    fun deleteAll() {
        try {
            open()
            database!!.delete("User", "", null)
        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
    }

    fun get(): User {
        user = User()
        try {
            open()
            val cursor = database?.rawQuery("select * from User", null)
            with(cursor) {
                while (this?.moveToNext()!!) {
                    user.phone = getString(getColumnIndexOrThrow("phone"))
                    user.userName = getString(getColumnIndexOrThrow("userName"))
                    user.cpf = getString(getColumnIndexOrThrow("cpf"))
                    user.email = getString(getColumnIndexOrThrow("email"))
                    user.token = getString(getColumnIndexOrThrow("token"))
                }
            }

        } catch (e: Exception) {
        } finally {
            database!!.close()
        }
        return user
    }


}