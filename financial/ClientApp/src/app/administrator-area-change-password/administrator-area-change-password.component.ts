import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginUser } from 'src/app/_model/login-user-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-administrator-area-change-password',
    templateUrl: './administrator-area-change-password.component.html'
})

export class AdministratorAreaChangePasswordComponent implements OnInit {
    form: any;
    public submitted = false;
    public loginUser: LoginUser = new LoginUser();
    public currentUser: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            secret: ['', Validators.required]
        });
        if (this.authenticationService.getCurrentUser()) {
            this.authenticationService.getCurrentUser().role === 'Administrador' ? this.currentUser = this.authenticationService.getCurrentUser() : null;
        }
        if (this.currentUser) {
            this.form.controls.email.setValue(this.currentUser.email);
            this.form.controls.email.disable();
        } else {
            this.authenticationService.logout();
            this.router.navigate(['index']);
        }
    }

    get f() { return this.form.controls; }

    onConfirm() {
        this.submitted = true;
        this.form.controls.email.enable();
        if (this.form.invalid) {
            this.form.controls.email.disable();
            this.toastr.error("Informe a senha")
            return;
        }
        this.form.controls.email.disable();
        this.loginUser.email = this.form.controls.email.value;
        this.loginUser.secret = this.form.controls.secret.value;
        this.authenticationService.changePassword(this.loginUser)
            .subscribe(result => {
                this.toastr.success("Senha alterada com sucesso.")
                this.authenticationService.clearUser();
                this.authenticationService.logout();
                return this.router.navigate(['/index']);
            });
    }

}

