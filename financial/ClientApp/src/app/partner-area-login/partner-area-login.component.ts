import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginUser } from '../_model/login-user-model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-partner-area-login',
    templateUrl: './partner-area-login.component.html'
})

export class PartnerAreaLoginComponent implements OnInit {
    form: any;
    formEmail: any;
    public submitted = false;
    public loginUser: LoginUser = new LoginUser();
    public currentUser: any;
    public modal: BsModalRef = new BsModalRef();
    public submittedEmail = false;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.currentUser = this.authenticationService.getCurrentUser();
        if (this.currentUser) {
            if (this.currentUser.role == "Partner") {
                this.router.navigate(['partner-area']);
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
        
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            secret: ['', Validators.required]
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
        this.authenticationService.loginPartner(this.loginUser)
        .subscribe(result => {
          this.authenticationService.clearUser();
          this.authenticationService.addCurrenUser(result);
          if (result) {
              switch(result.role) {
                case 'Delicatessen':
                  return this.router.navigate(['partner-area-delicatessen']);
                break;
                case 'Contas a pagar':

                break;
                default:
                  return this.router.navigate(['partner-area']);
              }
          }

          return this.router.navigate(['/index']);
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

