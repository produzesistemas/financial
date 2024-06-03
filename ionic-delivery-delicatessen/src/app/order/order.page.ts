import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonLoadingService } from '../_services/ion-loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryRegion } from '../_models/delivery-region-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { DelicatessenOrderService } from '../_services/delicatessen-order.service';
import { DelicatessenOrder } from '../_models/delicatessen-order-model';
import { FilterDefaultModel } from '../_models/filter-default-model';
@Component({
  selector: 'app-order',
  templateUrl: 'order.page.html',
  styleUrls: ['order.page.scss'],
})
export class OrderPage implements OnInit {
  public lastPostalCode: any;
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  form: any;
  submitted = false;
  public title: string | undefined;
  public orders: DelicatessenOrder[] = [];
  public order: string | undefined;
  constructor(
    private navCtrl: NavController,
    private ionLoaderService: IonLoadingService,
    private deliveryRegionService: DeliveryRegionService,
    private delicatessenOrderService: DelicatessenOrderService,
    private router: Router
  ) {}
  
  ngOnInit(): void {



  }

  ionViewWillEnter() {
    this.deliveryRegionService.getLastPostalCode()
    .then(data => 
      this.setPostalCode(data)
      );
      const filter: FilterDefaultModel = new FilterDefaultModel();
      filter.establishmentId = environment.establishmentId;
      this.delicatessenOrderService.getByUser(filter).subscribe(result => {
        this.orders = result;
      }
      
      )
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

  setPostalCode(postalCode: any) {
    if (postalCode != null) {
      this.lastPostalCode = postalCode;
    }
  }

  getDelicatessenOrderStatus(delicatessenOrder: any) {
    return delicatessenOrder.delicatessenOrderTrackings[delicatessenOrder.delicatessenOrderTrackings.length - 1].statusOrder.description;
  }

  getTotalSale(order: any) {
    let totalValue = 0;
    order.delicatessenOrderProducts.forEach((item: any) => {
        totalValue += (item.value! * item.quantity!);
    });

    if (order.coupon) {
        if (order.coupon.type) {
            totalValue -= order.coupon.value!;
        } else {
            totalValue -= (totalValue * order.coupon.value!) / 100;
        }
    }

    if (order.taxValue) {
        totalValue += order.taxValue;
    }
    return totalValue
}


onDetail(order: any) {
  this.navCtrl.navigateForward(["order-detail", order.id]);
}
}
