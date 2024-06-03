package com.br.app.deliverydelicatessen.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class SqliteHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    private val createTableUser = "CREATE TABLE User (" +
            "token TEXT," +
            " email TEXT," +
            " userName TEXT," +
            " cpf TEXT," +
            " phone TEXT)"

    private val createTableConfig = "CREATE TABLE Config (" +
            "id INTEGER)"

    private val createTableDelivery = "CREATE TABLE Delivery (isDelivery INTEGER)"

    private val createTableAddress = "CREATE TABLE Address (" +
            "postalCode TEXT)"

    private val createTableLastAddress = "CREATE TABLE LastAddress (" +
            "postalCode TEXT," +
            "street TEXT," +
            "reference TEXT," +
            "district TEXT," +
            "city TEXT," +
            "uf TEXT," +
            "id INTEGER)"

    private val insertTableConfig = "INSERT INTO Config (id) VALUES (2)"

    private val createTableShopping = "CREATE TABLE ShoppingCart(" +
            "delicatessenProductId INTEGER," +
            "description TEXT," +
            "quantity REAL," +
            "value REAL," +
            "obs TEXT," +
            "imageName TEXT )"

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createTableUser)
        db.execSQL(createTableConfig)
        db.execSQL(createTableAddress)
        db.execSQL(createTableShopping)
        db.execSQL(insertTableConfig)
        db.execSQL(createTableLastAddress)
        db.execSQL(createTableDelivery)
    }
    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // This database is only a cache for online data, so its upgrade policy is
        // to simply to discard the data and start over
//        db.execSQL(deleteTableUser)

//        onCreate(db)
    }
    override fun onDowngrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        onUpgrade(db, oldVersion, newVersion)
    }
    companion object {
        // If you change the database schema, you must increment the database version.
        const val DATABASE_VERSION = 1
        const val DATABASE_NAME = "produze_delivery.db"
    }
}