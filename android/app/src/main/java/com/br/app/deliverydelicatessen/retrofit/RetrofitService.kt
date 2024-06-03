package com.br.app.deliverydelicatessen.retrofit
import com.br.app.deliverydelicatessen.model.*
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface RetrofitService {

    @Headers("Content-Type:application/json")
    @POST("deliveryRegion/getAvailability")
    suspend fun getAvailability(@Body filter: DeliveryRegion): Response<DeliveryRegion>
    @POST("category/getInitialCategorys")
    suspend fun getInitialCategorys(@Body filter: CategoryDTO): Response<CategoryDTO>
    @POST("delicatessenProduct/getByCategory")
    suspend fun getByCategory(@Body filter: DelicatessenProduct): Response<List<DelicatessenProduct>>
    @POST("delicatessenProduct/getByDescription")
    suspend fun getByDescription(@Body filter: DelicatessenProduct): Response<List<DelicatessenProduct>>
    @POST("delicatessenProduct/getPromotions")
    suspend fun getPromotions(@Body filter: DelicatessenProduct): Response<List<DelicatessenProduct>>
    @POST("account/registerClientByEmail")
    suspend fun registerClientByEmail(@Body loginUser: LoginUser): Response<String>
    @POST("account/loginByCode")
    suspend fun loginByCode(@Body loginUser: LoginUser): Response<ApplicationUserDTO>
    @POST("account/registerGoogle")
    suspend fun registerGoogle(@Body googleUser: GoogleUser): Response<ApplicationUserDTO>
    @POST("address/save")
    suspend fun saveAddress(@Header("Authorization") token: String, @Body address: Address): Response<Void>
    @GET("address/getAll")
    suspend fun getAllAddress(@Header("Authorization") token: String): Response<List<Address>>
    @GET("establishment/{id}")
    suspend fun getEstablishmentById(@Path("id") id:Int): Response<Establishment>
    @GET("delicatessenOrder/{id}")
    suspend fun getDelicatessenOrderById(@Path("id") id:Int): Response<DelicatessenOrder>
    @Headers("Content-Type:application/json")
    @POST("account/refreshToken")
    suspend fun refreshToken(@Body loginUser: LoginUser): Response<ApplicationUserDTO>
    @POST("DelicatessenOrder/save")
    suspend fun saveDelicatessenOrder(@Header("Authorization") token: String, @Body delicatessenOrder: DelicatessenOrder): Response<Void>
    @POST("address/delete")
    suspend fun deleteAddress(@Header("Authorization") token: String, @Body address: Address): Response<Void>
    @POST("delicatessenOrder/getByUser")
    suspend fun getAllOrdersByUser(@Header("Authorization") token: String, @Body delicatessenOrder: DelicatessenOrder): Response<List<DelicatessenOrder>>
    @GET("account/getAccount")
    suspend fun getAccount(@Header("Authorization") token: String): Response<ApplicationUserDTO>
    @POST("account/update")
    suspend fun updateAccount(@Header("Authorization") token: String, @Body loginUser: LoginUser): Response<Void>
    @POST("establishmentBrand/getCreditByEstablishment")
    suspend fun getEstablishmentBrandCredit(@Body establishmentBrandCredit: EstablishmentBrandCredit): Response<List<EstablishmentBrandCredit>>
    @POST("establishmentBrand/getDebitByEstablishment")
    suspend fun getEstablishmentBrandDebit(@Body establishmentBrandDebit: EstablishmentBrandDebit): Response<List<EstablishmentBrandDebit>>
    @POST("closeOrderDTO/getCloseOrderDTO")
    suspend fun getCloseOrderDTO(@Header("Authorization") token: String, @Body closeOrderDTO: CloseOrderDTO): Response<CloseOrderDTO>
    @POST("coupon/getByCodigo")
    suspend fun getByCode(@Header("Authorization") token: String, @Body filter: Coupon): Response<Coupon?>
    @POST("delicatessenOrder/cancelByClient")
    suspend fun cancelByClient(@Header("Authorization") token: String, @Body delicatessenOrder: DelicatessenOrder): Response<Void>
    companion object {
        private const val BASE_URL: String = "https://produzesistemas.com.br/api/"

        var retrofitService: RetrofitService? = null
        fun getInstance() : RetrofitService {
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
                retrofitService = retrofit.create(RetrofitService::class.java)
            }
            return retrofitService!!
        }

    }
}