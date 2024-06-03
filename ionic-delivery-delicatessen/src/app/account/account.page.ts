import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonLoadingService } from '../_services/ion-loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryRegion } from '../_models/delivery-region-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { AuthService } from '../_services/auth.service';
@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {
  public lastPostalCode: any;
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  form: any;
  submitted = false;
  public account: any;
  public title: string | undefined;
  constructor(
    private navCtrl: NavController,
    private ionLoaderService: IonLoadingService,
    private deliveryRegionService: DeliveryRegionService,
    private authenticationService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {



  }

  ionViewWillEnter() {
    this.deliveryRegionService.getLastPostalCode()
    .then(data => 
      this.setPostalCode(data)
      );

    this.authenticationService.getCurrentUser().then(data => this.userData(data));
  }


  get f() { return this.form.controls; }

  onConfirm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
  }

  onBack() {
    this.navCtrl.back();
  }

  userData(user: any) {
    if (user != null) {
      this.account = user;
    }
  }

  setPostalCode(postalCode: any) {
    if (postalCode != null) {
      this.lastPostalCode = postalCode;
    }
  }
  

}
