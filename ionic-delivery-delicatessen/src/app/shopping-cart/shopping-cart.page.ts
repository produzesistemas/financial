import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';
import { IonLoadingService } from '../_services/ion-loading.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryRegion } from '../_models/delivery-region-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { ShoppingCart } from '../_models/shopping-cart-model';
import { ShoppingCartService } from '../_services/shopping-cart.service';
import { OverlayEventDetail } from '@ionic/core/components';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: 'shopping-cart.page.html',
  styleUrls: ['shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  readonly phoneMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
 @ViewChild(IonModal) modal: IonModal | undefined;
  form: any;
  submitted = false;
  public lastPostalCode: any;
  public shoppingsCart: ShoppingCart[] = [];
  public title: string | undefined;
  public shoppingCartValue: number = 0;
  constructor(
    private navCtrl: NavController,
    private ionLoaderService: IonLoadingService,
    private shoppingCartService: ShoppingCartService,
    private deliveryRegionService: DeliveryRegionService,
    private router: Router
  ) {}
  
 ngOnInit() : void{

  }

  ionViewWillEnter() {
    this.shoppingCartService.getAllShoppingCart()
    .then(data => 
      this.setValue(data)
      );

      this.deliveryRegionService.getLastPostalCode()
      .then(data => 
        this.setPostalCode(data)
        );
  }

  get f() { return this.form.controls; }

  // onConfirm() {
  //   this.submitted = true;
  //   if (this.form.invalid) {
  //     return;
  //   }
  // }

  onBack() {
    this.navCtrl.back();
  }

  getImage(imageName: string) {
    return environment.urlImagesProducts + imageName;
}


async loadShoppingCart() {
  this.shoppingCartService.getAllShoppingCart()
  .then(data => 
    this.setValue(data)
    );
}


async setValue(shoppingsCart: any) {
  if(shoppingsCart !== null) {
    this.shoppingsCart = [];
    this.shoppingsCart = [...shoppingsCart];
    // let totalValue = 0;
    // this.shoppingsCart.forEach((item: any) => {
    // totalValue += (item.value! * item.quantity!);
    // });
    // this.shoppingCartValue = totalValue;    
  }

}


getSubTotal(item : ShoppingCart) {
  return item.value! * item.quantity!;

}

getTotalShoppingCart(items : ShoppingCart[]) {
  let totalValue = 0;
  items.forEach((item: any) => {
    totalValue += (item.value! * item.quantity!);
    });
    return totalValue;    
}

setPostalCode(postalCode: any) {
  if (postalCode != null) {
    this.lastPostalCode = postalCode;
  } else {
    this.navCtrl.navigateForward(["verify-postal-code"]);
  }

}

async onDeleteAll() {
this.shoppingCartService.deleteAll();
this.shoppingsCart = [];
await this.loadShoppingCart();

}

onIncrement(item : ShoppingCart) {
  this.shoppingCartService.getAllShoppingCart()
  .then(data => 
    this.setIncrement(data, item)
    );
}

setIncrement(shoppingsCart: any, item : ShoppingCart) {
  this.shoppingsCart = [...shoppingsCart];
  const s = this.shoppingsCart.find(x => x.delicatessenProductId === item.delicatessenProductId);
  if (s) {
    s.quantity!++;
    this.shoppingCartService.insert(this.shoppingsCart);
    
  }
}

onDecrement(item : ShoppingCart) {
  this.shoppingCartService.getAllShoppingCart()
  .then(data => 
    this.setDecrement(data, item)
    );
}

setDecrement(shoppingsCart: any, item : ShoppingCart) {
  this.shoppingsCart = [...shoppingsCart];
  const s = this.shoppingsCart.find(x => x.delicatessenProductId === item.delicatessenProductId);
  if (s) {
    s.quantity!--;
    if (s.quantity === 0) {
      const index: number = this.shoppingsCart.indexOf(s);
      if (index !== -1) {
        this.shoppingsCart.splice(index, 1);
      }
    }
    this.shoppingCartService.insert(this.shoppingsCart);
    
  }
}

closeOrder() {
    this.navCtrl.navigateForward(["close-order"]);
}

onCloseModal() {
  this.modal!.dismiss(null, 'cancel');
}

onConfirmClear() {
  this.modal!.dismiss(null, 'confirm');
  this.onDeleteAll();
}

onWillDismiss(event: Event) {
  const ev = event as CustomEvent<OverlayEventDetail<string>>;
  if (ev.detail.role === 'confirm') {

  }
}

}
