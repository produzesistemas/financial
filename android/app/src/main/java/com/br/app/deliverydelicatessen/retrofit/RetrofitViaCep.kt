package com.br.app.deliverydelicatessen.retrofit
import com.br.app.deliverydelicatessen.model.AddressViaCep
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface RetrofitViaCep {

    @Headers("Content-Type:application/json")
    @GET("{cep}/json")
    suspend fun getAddressByCep(@Path("cep") cep:String): Response<AddressViaCep>

    companion object {
        private const val BASE_URL: String = "https://viacep.com.br/ws/"
        var retrofitService: RetrofitViaCep? = null
        fun getInstance() : RetrofitViaCep {
            if (retrofitService == null) {
                val gson = GsonBuilder()
                    .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                    .create()

                val gsonConverterFactory = GsonConverterFactory.create(gson)
                val interceptor: HttpLoggingInterceptor = HttpLoggingInterceptor().apply {
                    this.level = HttpLoggingInterceptor.Level.BODY
                }

                val client: OkHttpClient = OkHttpClient.Builder().apply {
                    this.addInterceptor(interceptor)
                        .connectTimeout(60, TimeUnit.SECONDS)
                        .readTimeout(60, TimeUnit.SECONDS)
                        .writeTimeout(60, TimeUnit.SECONDS)
                }.build()
                val retrofit = Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(gsonConverterFactory)
                    .build()
                retrofitService = retrofit.create(RetrofitViaCep::class.java)
            }
            return retrofitService!!
        }

    }
}