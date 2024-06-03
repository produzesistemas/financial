import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginUser } from '../_model/login-user-model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-aministrator-area-login',
    templateUrl: './administrator-area-login.component.html',
})

export class AdministratorAreaLoginComponent implements OnInit {
    form: any;
    formEmail: any;
    public submitted = false;
    public submittedEmail = false;
    public loginUser: LoginUser = new LoginUser();
    public currentUser: any;
    public modal: BsModalRef = new BsModalRef();
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.currentUser = this.authenticationService.getCurrentUser();
        if (this.currentUser) {
            if (this.currentUser.role == "Administrador") {
                this.router.navigate(['administrator-area']);
            }
        } 
        
        const secret = new FormControl('', Validators.compose([
            Validators.required, Validators.minLength(6),
          ]));
      
          const email = new FormControl('', Validators.compose([
            Validators.required,
          ]));
      
          this.form = new FormGroup({
            email: email,
            secret: secret,
          });

          const emailRecover = new FormControl('', Validators.compose([
            Validators.required,
          ]));

          this.formEmail = new FormGroup({
            emailRecover: emailRecover,
          });
    }

    get f() { return this.form.controls; }
    get fe() { return this.formEmail.controls; }

    onLogin() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.loginUser.email = this.form.controls.email.value;
        this.loginUser.secret = this.form.controls.secret.value;
        this.authenticationService.loginAdministrator(this.loginUser)
        .subscribe(result => {
            this.authenticationService.clearUser();
            this.authenticationService.addCurrenUser(result);
            return this.router.navigate(['/administrator-area']);
        });
    }
    openModal(template: TemplateRef<any>) {
        this.modal = this.modalService.show(template, { class: 'modal-md' });
      }
    
    closeModal() {
        this.modal.hide();
        }
    
        onConfirmEmail() {
            this.submittedEmail = true;
            if (this.formEmail.invalid) {
              return;
            }
                
            let emailRecover = new LoginUser();
            emailRecover.email = this.formEmail.controls.emailRecover.value;
            
            this.authenticationService.recoverPassword(emailRecover).subscribe(result => {
                    this.toastr.success('Senha recuperada com sucesso! Verifique sua caixa de e-mail para confirmar a conta! Caso não encontre, verifique na caixa de spam!');
                    this.closeModal();
          });
          }
        
}

