import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CloseOrderDtoService } from '../_services/close-order-dto.service';
import { CloseOrderDTO } from '../_models/close-order-dto-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { IonLoadingService } from '../_services/ion-loading.service';
import { ToastController } from '@ionic/angular';
import { ShoppingCart } from '../_models/shopping-cart-model';
import { ShoppingCartService } from '../_services/shopping-cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { AddressService } from '../_services/address.service';
import { DeliveryOptionService } from '../_services/delivery-option.service';
import { Coupon } from '../_models/coupon-model';
import { CouponService } from '../_services/coupon.service copy';
import { CurrencyPipe } from '@angular/common';
import { EstablishmentBrandService } from '../_services/establishment-brand.service';
import { EstablishmentBrandDebit } from '../_models/establishment-brand-debit-model';
import { EstablishmentBrandCredit } from '../_models/establishment-brand-credit-model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  readonly phoneMask: MaskitoOptions = {
    mask: ['(',/\d/, /\d/, ')',/\d/,/\d/, /\d/, /\d/,  /\d/,'-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly cpfMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/,/\d/, '.', /\d/, /\d/, /\d/, '-',/\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  public shoppingsCart: ShoppingCart[] = [];
  public isMoney: boolean | undefined;
  isCreditCard = false;
  isDebitCard = false;
  public lstDebit: EstablishmentBrandDebit[] = [];
  public lstCredit: EstablishmentBrandCredit[] = [];
  public isLittleMachine: boolean | undefined;
  public lastPostalCode: any;
  public closeOrderDTO: CloseOrderDTO | undefined;
  formExchangeFor: any;
  formCoupon: any;
  formMoney: any;
  submitted = false;
  isMinimunValue = false;
  minimumValue: any;
  public coupon: Coupon | undefined;

  constructor(
    private addressService: AddressService,
    private deliveryRegionService: DeliveryRegionService,
    private shoppingCartService: ShoppingCartService,
    private establishmentBrandService: EstablishmentBrandService,
    private couponService: CouponService,
    private ionLoaderService: IonLoadingService,
    private closeOrderDtoService: CloseOrderDtoService,
    public toastController: ToastController,
    private authService: AuthService
    ) { }

    ngOnInit(): void {
      this.formCoupon = new FormGroup({
        coupon: new FormControl('', Validators.compose([
          Validators.required,
        ]))
      });


      this.formMoney = new FormGroup({
        money: new FormControl('', Validators.compose([
          Validators.required,
        ]))
      });


    }

    ionViewWillEnter() {   
      this.deliveryRegionService.getLastPostalCode()
      .then(data => 
        this.load(data)
        ); 
        this.shoppingCartService.getAllShoppingCart()
        .then(data => 
          this.setValue(data)
          );    
  }

get fc() { return this.formCoupon.controls; }
get fm() { return this.formMoney.controls; }


  load(postalCode: string) {
    this.lastPostalCode = postalCode;
    this.ionLoaderService.simpleLoader().then(() => {
      let filter = new CloseOrderDTO()
      filter.establishmentId = environment.establishmentId;
      filter.postalCode = postalCode;
      this.closeOrderDtoService.getCloseOrderDTO(filter).subscribe(response => {
        this.closeOrderDTO = response;
        this.ionLoaderService.dismissLoader();
          } )  
    });

  }

  getTotalShoppingCart(items : ShoppingCart[]) {
    let totalValue = 0;
    items.forEach((item: any) => {
      totalValue += (item.value! * item.quantity!);
      });
      return totalValue;    
  }

  getTotalTaxValue() {
    let totalValue = 0;
    if(this.closeOrderDTO) {
      if(this.closeOrderDTO.deliveryRegion!.value) {
        return this.closeOrderDTO.deliveryRegion!.value;
      }
    }
    return totalValue;    

  }

  getTotalSale() {
    let totalValue = 0;
    totalValue = this.getTotalShoppingCart(this.shoppingsCart) + this.getTotalTaxValue();
    if (this.coupon) {
      if (this.coupon.type) {
        totalValue -= this.coupon.value!;
      } else {
        totalValue -= (totalValue * this.coupon.value!) / 100;
      }
    }
    return totalValue;  
  }

  
  async setValue(shoppingsCart: any) {
    if(shoppingsCart !== null) {
      this.shoppingsCart = [];
      this.shoppingsCart = [...shoppingsCart];
    }
  
  }

  onOptionPayment(event: any) {
    if(event.detail.value == 'littleMachine'){
      this.isMoney = false;
      this.isLittleMachine = true;
    }
    if(event.detail.value == 'money'){
      this.isMoney = true;
      this.isLittleMachine = false;
    }
  }

  onOptionCard(event: any) {
    if(event.detail.value == 'debit'){
      this.lstDebit = [];
      this.ionLoaderService.simpleLoader().then(() => {
        let filter = new EstablishmentBrandDebit()
        filter.establishmentId = environment.establishmentId;
        this.establishmentBrandService.getEstablishmentBrandDebit(filter).subscribe(response => {
          this.isCreditCard = false;
          this.isDebitCard = true;
          this.lstDebit = response;
              this.ionLoaderService.dismissLoader();
            } )  
      });  
    }
    if(event.detail.value == 'credit'){
      this.lstCredit = [];
      this.ionLoaderService.simpleLoader().then(() => {
        let filter = new EstablishmentBrandCredit()
        filter.establishmentId = environment.establishmentId;
        this.establishmentBrandService.getEstablishmentBrandCredit(filter).subscribe(response => {
          this.isCreditCard = true;
          this.isDebitCard = false;
              this.lstCredit = response;
              this.ionLoaderService.dismissLoader();
            } )  
      });  

    }
  }

  onCardType(event: any) {
    if(event.detail.value == 'littleMachine'){

    }
    if(event.detail.value == 'money'){

    }
  }

onSearchCoupon() {
  this.submitted = true;
  if (this.formCoupon.invalid) {
    return;
  }
  let coupon = new Coupon();
  coupon.establishmentId = environment.establishmentId;
  coupon.code = this.formCoupon.controls.coupon.value;
  this.ionLoaderService.simpleLoader().then(() => {
    this.couponService.getCoupon(coupon).subscribe(response => {
      if (response) {
        if (this.getTotalShoppingCart(this.shoppingsCart) + this.getTotalTaxValue() < response.minimumValue!) {
          this.minimumValue = response.minimumValue;
          this.isMinimunValue = true;
        } else {
          this.coupon = response;
          return this.presentToast("Cupom aplicado com sucesso!")
        }

      }
      return this.ionLoaderService.dismissLoader();
        } )  
  });

}

async presentToast(error: any){
  const toast = await this.toastController.create({
    message: error,
    duration: 2000,
    position: 'middle'
  });
  toast.present();
}

onConfirm() {
  if(this.isMoney == undefined && this.isLittleMachine == undefined){
    return this.presentToast("É obrigatório selecionar a opção de pagamento!")
  }
  return;

}

getImage(imageName: string) {
  return environment.urlImagesBrand + imageName;
}


}
