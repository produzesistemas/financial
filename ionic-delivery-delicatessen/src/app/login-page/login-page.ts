import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonLoadingService } from '../_services/ion-loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginUser } from '../_models/login-user-model';
import { AuthService } from '../_services/auth.service';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
@Component({
  selector: 'app-login-page',
  templateUrl: 'login-page.html',
  styleUrls: ['login-page.scss'],
})
export class LoginPage implements OnInit {
  readonly onlyNumberMask: MaskitoOptions = {
    mask: [/\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  formEmail: any;
  formCode: any;
  submitted = false;
  hascode = false;
  public title: string | undefined;
  constructor(
    private navCtrl: NavController,
    private ionLoaderService: IonLoadingService,
    private authenticationService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authenticationService.getCurrentUser().then(data => this.goNextPage(data));
    const email = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const number1 = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const number2 = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const number3 = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const number4 = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    this.formEmail = new FormGroup({
      email: email,
    });

    this.formCode = new FormGroup({
      number1: number1,
      number2: number2,
      number3: number3,
      number4: number4
    });
  }

  get f() { return this.formEmail.controls; }
  get fc() { return this.formCode.controls; }

  onConfirm() {
    this.submitted = true;
    if (this.formEmail.invalid) {
      return;
    }
    const filter: LoginUser = new LoginUser();
    this.ionLoaderService.simpleLoader().then(() => {
      filter.email = this.formEmail.controls.email.value;
      this.authenticationService.registerClientByEmail(filter).subscribe(result => {
        if (result) {
          this.onHasCode()
        }
        this.ionLoaderService.dismissLoader();
      });
    });
  }

  onBack() {
    this.router.navigate(['/verify-postal-code']);
  }
  onBackHasCode() {
    this.hascode = false;
  }
  onCleanCode() {
    this.formCode.controls.number1.reset();
    this.formCode.controls.number2.reset();
    this.formCode.controls.number3.reset();
    this.formCode.controls.number4.reset();
  }

  onHasCode() {
    this.hascode = true;
  }

  onKeyUp(x: any, next: any) {
    if (x.key === "0" ||
    x.key === "1" ||
    x.key === "2" ||
    x.key === "3" ||
    x.key === "4" ||
    x.key === "5" ||
    x.key === "6" ||
    x.key === "7" ||
    x.key === "8" ||
    x.key === "9") {
      switch (x.target.name) {
        case "number1":
          next.setFocus();
          break;
        case "number2":
          next.setFocus();
          break;
        case "number3":
          next.setFocus();
          break;
        case "number4":
          this.loginByCode();
          break;
      }
    }

  }

  loginByCode() {
    const filter: LoginUser = new LoginUser();
    this.ionLoaderService.simpleLoader().then(() => {
      filter.code = this.formCode.controls.number1.value + 
      this.formCode.controls.number2.value +
      this.formCode.controls.number3.value +
      this.formCode.controls.number4.value;
      filter.email = this.formEmail.controls.email.value;
      this.authenticationService.loginByCode(filter).subscribe(result => {
        if (result) {
          this.authenticationService.clearCurrentUser();
          this.authenticationService.setCurrentUser(result);
          this.navCtrl.navigateForward(["products"]);
        }
        this.ionLoaderService.dismissLoader();
      });
    });
  }

  goNextPage(user: any) {
    if (user != null) {
      this.navCtrl.navigateForward(["products"]);
    }
  }

}
