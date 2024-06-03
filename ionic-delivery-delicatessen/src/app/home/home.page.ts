import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonLoadingService } from '../_services/ion-loading.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DeliveryRegion } from '../_models/delivery-region-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  form: any;
  submitted = false;
  constructor(
    private navCtrl: NavController,
    private ionLoaderService: IonLoadingService,
    private deliveryRegionService: DeliveryRegionService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.deliveryRegionService.getLastPostalCode().then(data => this.goNextPage(data));
  }

  goVerifyPostalCode() {
    this.navCtrl.navigateForward(["verify-postal-code"]);
  }

  goNextPage(postalCode: string) {
    if (postalCode != null) {
      this.goVerifyPostalCode();
    }
  }

}
