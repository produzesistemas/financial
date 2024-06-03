package com.br.app.deliverydelicatessen

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.core.view.WindowCompat
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.br.app.deliverydelicatessen.database.DataSourceAddress
import com.br.app.deliverydelicatessen.database.DataSourceUser
import com.br.app.deliverydelicatessen.databinding.FragmentLoginBinding
import com.br.app.deliverydelicatessen.model.DeliveryRegionSearch
import com.br.app.deliverydelicatessen.model.GoogleUser
import com.br.app.deliverydelicatessen.model.LoginUser
import com.br.app.deliverydelicatessen.model.User
import com.br.app.deliverydelicatessen.ui.components.AlertDialogMessageGeneric
import com.br.app.deliverydelicatessen.utils.MainUtils
import com.br.app.deliverydelicatessen.viewmodel.LoginViewModel
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.Scopes
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.Scope
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.launch


class LoginActivity : AppCompatActivity() {
    private lateinit var binding: FragmentLoginBinding
    private var dataSourceUser: DataSourceUser? = null
    private lateinit var viewModelLogin: LoginViewModel
    private var user: User = User()
    private lateinit var deliveryRegionSearch: DeliveryRegionSearch
    private var dataSourceAddress: DataSourceAddress? = null
    private lateinit var auth: FirebaseAuth
    private lateinit var googleSignInClient: GoogleSignInClient
    private val reqCode:Int=123
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
        try {
            binding = FragmentLoginBinding.inflate(layoutInflater)
            setContentView(binding.root)
            supportActionBar?.setDisplayShowTitleEnabled(false)
            dataSourceUser = DataSourceUser(this)
            dataSourceAddress = DataSourceAddress(this)
            user = dataSourceUser?.get()!!

            FirebaseApp.initializeApp(this)
            auth = Firebase.auth
            auth = FirebaseAuth.getInstance()

            deliveryRegionSearch = dataSourceAddress!!.get()

            val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestScopes(Scope(Scopes.DRIVE_APPFOLDER))
                .requestServerAuthCode(getString(R.string.server_client_id))
                .requestIdToken(getString(R.string.server_client_id))
                .build()

            googleSignInClient = GoogleSignIn.getClient(this, gso)

            if (user.token.isNotEmpty()) {
                startActivity(Intent(this, ProductsActivity::class.java))
                finish()
            }

            viewModelLogin = ViewModelProvider(this)[LoginViewModel::class.java]

            binding.editTextCodeFirst.addTextChangedListener(
                EditTextWatcherFirst(
                    binding.editTextCodeFirst, binding.editTextCodeSecond
                )
            )

            binding.editTextCodeSecond.addTextChangedListener(
                EditTextWatcherSecond(
                    binding.editTextCodeSecond, binding.editTextCodeThird
                )
            )

            binding.editTextCodeThird.addTextChangedListener(
                EditTextWatcherThird(
                    binding.editTextCodeThird, binding.editTextCodeFourTh
                )
            )

            binding.editTextCodeFourTh.addTextChangedListener(
                EditTextWatcherFourth(
                    this,
                    window.decorView.findViewById(android.R.id.content),
                    viewModelLogin,
                    binding.editTextCodeFirst,
                    binding.editTextCodeSecond,
                    binding.editTextCodeThird,
                    binding.editTextCodeFourTh
                )
            )

            binding.progressBar.visibility = View.GONE

            binding.btnLoginEmail.setOnClickListener {
                if (binding.editTextEmail.text.isEmpty()) {
                    binding.editTextEmail.error =
                        this.resources.getString(R.string.validation_email)
                    binding.editTextEmail.requestFocus()
                    return@setOnClickListener
                }
                val loginUser =
                    LoginUser(binding.editTextEmail.text.toString(), "", "", "", "")
                onReceiveCode(loginUser)
            }

            binding.btnResendCode.setOnClickListener {
                if (binding.editTextEmail.text.isEmpty()) {
                    binding.linearLayoutInfoLogin.visibility = View.VISIBLE
                    binding.linearLayoutCode.visibility = View.GONE
                    enableReceiveCode()
                    return@setOnClickListener
                }
                val loginUser =
                    LoginUser(binding.editTextEmail.text.toString(), "", "", "", "")
                onReceiveCode(loginUser)
            }


            binding.btnGoogle.setOnClickListener {
                Log.d(TAG, "firebaseAuthWithGoogle")
                signIn()
            }

            binding.btnHasCode.setOnClickListener {
                binding.editTextCodeFirst.text.clear()
                binding.editTextCodeSecond.text.clear()
                binding.editTextCodeThird.text.clear()
                binding.editTextCodeFourTh.text.clear()
                binding.linearLayoutInfoLogin.visibility = View.GONE
                binding.linearLayoutCode.visibility = View.VISIBLE
            }

            binding.btnGoBack.setOnClickListener {
                binding.linearLayoutInfoLogin.visibility = View.VISIBLE
                binding.linearLayoutCode.visibility = View.GONE
                enableReceiveCode()
            }

            binding.btnBackMain.setOnClickListener {
                dataSourceAddress?.deleteAll()
                finishAffinity()
                startActivity(Intent(this, MainActivity::class.java))
            }

            viewModelLogin.loading.observe(this) {
                if (it) {
                    binding.progressBar.visibility = View.VISIBLE
                } else {
                    binding.progressBar.visibility = View.GONE
                }
            }

            viewModelLogin.token.observe(this) {
                var token: User = User(it.token, it.phone, it.email, it.name, it.cpf)
                dataSourceUser?.insert(token)
                startActivity(Intent(this, ProductsActivity::class.java))
                finish()
            }

            viewModelLogin.errorMessage.observe(this) {
                MainUtils.snackCenter(
                    window.decorView.findViewById(android.R.id.content),
                    it.message,
                    Snackbar.LENGTH_LONG
                )
            }

            viewModelLogin.errorMessageRegister.observe(this) {
                if (it.code == 400) {
                    MainUtils.snackCenter(
                        window.decorView.findViewById(android.R.id.content),
                        it.message,
                        Snackbar.LENGTH_LONG
                    )

                }
                enableReceiveCode()
            }

            viewModelLogin.msgRegister.observe(this) {
                MainUtils.snackCenter(
                    window.decorView.findViewById(android.R.id.content),
                    it,
                    Snackbar.LENGTH_LONG
                )
                binding.linearLayoutInfoLogin.visibility = View.GONE
                binding.linearLayoutCode.visibility = View.VISIBLE
            }


        } catch (e: Exception) {
            val exc = e.message
            Log.d(TAG, "firebaseAuthWithGoogle: " + e.message)
        }

    }

    private fun enableReceiveCode() {
        binding.editTextEmail.isEnabled =true
    }

    private fun disableReceiveCode() {
        binding.editTextEmail.isEnabled =false
    }

    private fun disableLoginGoogle() {
        binding.editTextEmail.isEnabled =false
        binding.btnLoginEmail.isEnabled =false
        binding.btnHasCode.isEnabled =false
    }

    private fun enableLoginGoogle() {
        binding.editTextEmail.isEnabled =true
        binding.btnLoginEmail.isEnabled =true
        binding.btnHasCode.isEnabled =true
    }

    private fun onReceiveCode(loginUser: LoginUser){
        viewModelLogin.registerClientByEmail(loginUser)
        disableReceiveCode()
    }

    companion object {
        private const val TAG = "Produze"
        private const val RC_SIGN_IN = 9001
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                val account = task.getResult(ApiException::class.java)!!
                var googleUser = account!!.email?.let { GoogleUser(it,account.displayName!!) }
                if (googleUser != null) {
                    loginGoogle(googleUser)
                }
//                firebaseAuthWithGoogle(account.idToken!!)
            } catch (e: ApiException) {
                binding.progressBar.visibility = View.GONE
                enableLoginGoogle()
                MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content),
                    this.resources.getString(R.string.validation_login_google_fail) + " - " + e.message,
                    Snackbar.LENGTH_LONG)

            }
        }
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val firebaseUser = auth.currentUser
                    var googleUser = firebaseUser!!.email?.let { GoogleUser(it,firebaseUser.displayName!!) }
                    if (googleUser != null) {
                        loginGoogle(googleUser)
                    }

                } else {
                    binding.progressBar.visibility = View.GONE
                    enableLoginGoogle()
                    MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content),
                        this.resources.getString(R.string.validation_login_google_fail), Snackbar.LENGTH_LONG)
                }
            }
    }

    private fun signIn() {
        binding.progressBar.visibility = View.VISIBLE
        disableLoginGoogle()
        val signInIntent = googleSignInClient.signInIntent
     startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    private fun loginGoogle(googleUser: GoogleUser) {
        if (this?.let { it1 -> MainUtils.isOnline(it1) }!!) {
            lifecycleScope.launch {
                viewModelLogin.registerGoogle(googleUser)
            }
        } else {
                MainUtils.snackCenter(window.decorView.findViewById(android.R.id.content), R.string.validation_connection.toString(), Snackbar.LENGTH_LONG)
        }
    }

    class EditTextWatcherFirst internal constructor(editTextValueFirst: EditText, editTextValueSecond: EditText) :
        TextWatcher {
        private val mEditTextValueFirst = editTextValueFirst
        private val mEditTextValueSecond = editTextValueSecond
        override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun afterTextChanged(p0: Editable?) {
            mEditTextValueFirst.removeTextChangedListener(this)
            if (p0 != null) {
                if (p0.trim().length === 1) {
                    mEditTextValueSecond.requestFocus()
                }
            }
            mEditTextValueFirst.addTextChangedListener(this)
        }
    }
    class EditTextWatcherSecond internal constructor(editTextValueSecond: EditText, editTextValueThird: EditText) :
        TextWatcher {
        private val mEditTextValueSecond = editTextValueSecond
        private val mEditTextValueThird = editTextValueThird
        override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun afterTextChanged(p0: Editable?) {
            mEditTextValueSecond.removeTextChangedListener(this)
            if (p0 != null) {
                if (p0.trim().length === 1) {
                    mEditTextValueThird.requestFocus()
                }
            }
            mEditTextValueSecond.addTextChangedListener(this)
        }
    }
    class EditTextWatcherThird internal constructor(editTextValueThird: EditText, editTextValueFourth: EditText) :
        TextWatcher {
        private val mEditTextValueFourth = editTextValueFourth
        private val mEditTextValueThird = editTextValueThird
        override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun afterTextChanged(p0: Editable?) {
            mEditTextValueThird.removeTextChangedListener(this)
            if (p0 != null) {
                if (p0.trim().length === 1) {
                    mEditTextValueFourth.requestFocus()
                }
            }
            mEditTextValueThird.addTextChangedListener(this)
        }
    }
    class EditTextWatcherFourth internal constructor(context: Context, view: View, viewModelLogin: LoginViewModel,editTextValueFirst: EditText, editTextValueSecond: EditText,editTextValueThird: EditText, editTextValueFourth: EditText) :
        TextWatcher {
        private val mEditTextValueFirst = editTextValueFirst
        private val mEditTextValueSecond = editTextValueSecond
        private val mEditTextValueFourth = editTextValueFourth
        private val mEditTextValueThird = editTextValueThird
        private val mViewModelLogin = viewModelLogin
        private val mView = view
        private val mContext = context
        override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {

        }

        override fun afterTextChanged(p0: Editable?) {

            mEditTextValueFourth.removeTextChangedListener(this)
            if (p0 != null) {
                if (p0.trim().length === 1) {
                    if (mEditTextValueFirst.text.isEmpty() ||
                        mEditTextValueSecond.text.isEmpty() ||
                        mEditTextValueThird.text.isEmpty()) {
                        MainUtils.snackCenter(mView, mContext.resources.getString(R.string.validation_code_incomplete), Snackbar.LENGTH_LONG)
                    } else {
                        if (mContext.let { it1 -> MainUtils.isOnline(it1) }) {
                            val loginUser = LoginUser("",
                                mEditTextValueFirst.text.toString() + mEditTextValueSecond.text.toString() + mEditTextValueThird.text.toString() + mEditTextValueFourth.text.toString(),
                                "",
                                "",
                                "")
                            onConfirmCode(loginUser)
                        } else {
                            MainUtils.snackCenter(mView, mContext.resources.getString(R.string.validation_connection), Snackbar.LENGTH_LONG)
                        }
                    }

                }
            }
            mEditTextValueFourth.addTextChangedListener(this)
        }

        private fun onConfirmCode(loginUser: LoginUser){
            mViewModelLogin.loginByCode(loginUser)
        }

    }
}