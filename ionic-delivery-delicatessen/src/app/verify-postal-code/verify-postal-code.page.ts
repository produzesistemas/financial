import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonLoadingService } from '../_services/ion-loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryRegion } from '../_models/delivery-region-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
@Component({
  selector: 'app-verify-postal-code',
  templateUrl: 'verify-postal-code.page.html',
  styleUrls: ['verify-postal-code.page.scss'],
})
export class VerifyPostalCodePage implements OnInit {
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  form: any;
  submitted = false;
  public title: string | undefined;
  constructor(
    private navCtrl: NavController,
    private ionLoaderService: IonLoadingService,
    private deliveryRegionService: DeliveryRegionService,
    private router: Router
  ) {}
  
  ngOnInit(): void {

    this.deliveryRegionService.getLastPostalCode().then(data => this.goNextPage(data));

    const postalCode = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    
    this.form = new FormGroup({
      postalCode: postalCode,
    });
  }

  get f() { return this.form.controls; }

  onConfirm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const filter: DeliveryRegion = new DeliveryRegion();
    this.ionLoaderService.simpleLoader().then(() => {
      filter.postalCode = this.form.controls.postalCode.value.replace('-','');
      filter.establishmentId = environment.establishmentId;
      this.deliveryRegionService.getAvailability(filter).subscribe(result => {
        if (result) {
          this.deliveryRegionService.setLastPostalCode(result.postalCode);
          this.navCtrl.navigateForward(["login-page"]);
        }
        this.ionLoaderService.dismissLoader();
      });
    });
  }

  onBack() {
    this.navCtrl.back();
  }

  goNextPage(postalCode: string) {
    if (postalCode != null) {
      this.goLoginPage();
    }
  }

  goLoginPage() {
    this.navCtrl.navigateForward(["login-page"]);
  }


}
