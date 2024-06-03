import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CloseOrderDtoService } from '../_services/close-order-dto.service';
import { CloseOrderDTO } from '../_models/close-order-dto-model';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { IonLoadingService } from '../_services/ion-loading.service';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { ShoppingCart } from '../_models/shopping-cart-model';
import { ShoppingCartService } from '../_services/shopping-cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { ApplicationUserDTO } from '../_models/application-user-dto-model';
import { LoginUser } from '../_models/login-user-model';
import { AuthService } from '../_services/auth.service';
import { MaskitoOptions, MaskitoElementPredicate } from '@maskito/core';
import { Address } from '../_models/address-model';
import { AddressService } from '../_services/address.service';
import { DeliveryOptionService } from '../_services/delivery-option.service';

@Component({
  selector: 'app-close-order',
  templateUrl: './close-order.page.html',
  styleUrls: ['./close-order.page.scss'],
})
export class CloseOrderPage  {
  readonly phoneMask: MaskitoOptions = {
    mask: ['(',/\d/, /\d/, ')',/\d/,/\d/, /\d/, /\d/,  /\d/,'-', /\d/, /\d/, /\d/, /\d/],
  };
  readonly cpfMask: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/,/\d/, '.', /\d/, /\d/, /\d/, '-',/\d/, /\d/],
  };
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  public version: string | undefined;
  public shoppingsCart: ShoppingCart[] = [];
  public order: string | undefined;
  public isDelivery: boolean | undefined;
  public lastPostalCode: any;
  public closeOrderDTO: CloseOrderDTO | undefined;
  formPersonalData: any;
  formAddress: any;
  submitted = false;
  open_modal_address = false
  @ViewChild(IonModal) modalPersonalData: IonModal | undefined;
  @ViewChild(IonModal) modalAddress: IonModal | undefined;
  constructor(
    private addressService: AddressService,
    private deliveryRegionService: DeliveryRegionService,
    private navCtrl: NavController,
    private shoppingCartService: ShoppingCartService,
    private deliveryOptionService: DeliveryOptionService,
    private ionLoaderService: IonLoadingService,
    private closeOrderDtoService: CloseOrderDtoService,
    public toastController: ToastController,
    private authService: AuthService,
    ) { }

    ionViewWillEnter() {   
      const name = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const phone = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const cpf = new FormControl('');

      const postalCode = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const street = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const district = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const city = new FormControl('');
      const uf = new FormControl('');
      const reference = new FormControl('');
      const id = new FormControl('');
      this.formPersonalData = new FormGroup({
        name: name,
        phone: phone,
        cpf: cpf
      });

      this.formAddress = new FormGroup({
        postalCode: postalCode,
        street: street,
        district: district,
        city: city,
        reference: reference,
        id: id,
        uf: uf
      });

      this.deliveryRegionService.getLastPostalCode()
      .then(data => 
        this.load(data)
        ); 
        this.shoppingCartService.getAllShoppingCart()
        .then(data => 
          this.setValue(data)
          );    
  }

get fp() { return this.formPersonalData.controls; }
get fa() { return this.formAddress.controls; }

  load(postalCode: string) {
    this.lastPostalCode = postalCode;
    this.ionLoaderService.simpleLoader().then(() => {
      let filter = new CloseOrderDTO()
      filter.establishmentId = environment.establishmentId;
      filter.postalCode = postalCode;
      this.closeOrderDtoService.getCloseOrderDTO(filter).subscribe(response => {
        this.closeOrderDTO = response;
        this.setPersonalData(this.closeOrderDTO.applicationUserDTO!);
        this.setAddress(this.closeOrderDTO.address!);
        console.log(response);
        this.ionLoaderService.dismissLoader();
          } )  
    });

  }

  setPersonalData(applicationUserDTO : ApplicationUserDTO ) {
    this.formPersonalData.controls.name.setValue(applicationUserDTO.name);
    this.formPersonalData.controls.phone.setValue(applicationUserDTO.phone);
    this.formPersonalData.controls.cpf.setValue(applicationUserDTO.cpf);
  }

  setAddress(address : Address ) {
    this.formAddress.controls.postalCode.setValue(address.postalCode);
    this.formAddress.controls.street.setValue(address.street);
    this.formAddress.controls.district.setValue(address.district);
    this.formAddress.controls.city.setValue(address.city);
    this.formAddress.controls.reference.setValue(address.reference);
    this.formAddress.controls.id.setValue(address.id);
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

  
  async setValue(shoppingsCart: any) {
    if(shoppingsCart !== null) {
      this.shoppingsCart = [];
      this.shoppingsCart = [...shoppingsCart];
    }
  
  }

  onOptionDelivery(event: any) {
    if(event.detail.value == 'delivery'){
      this.isDelivery = true
    }
    if(event.detail.value == 'instorePickup'){
      this.isDelivery = false
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
  
    }
  }

  onCloseModalPersonalData() {
    this.modalPersonalData!.dismiss(null, 'cancel');
  }

  onCloseModalAddress() {
    this.open_modal_address = false;
  }

  onOpenModalAddress() {
    this.open_modal_address = true;
  }
  
  onConfirmPersonalData() {
    this.submitted = true;
    if (this.formPersonalData.invalid) {
      return;
    }

    let loginUser = new LoginUser();
    loginUser.name = this.formPersonalData.controls.name.value;
    loginUser.phone = this.formPersonalData.controls.phone.value;
    loginUser.cpf = this.formPersonalData.controls.cpf.value;
    this.ionLoaderService.simpleLoader().then(() => {
      this.authService.updateAccount(loginUser).subscribe(response => {
        this.ionLoaderService.dismissLoader();
        this.modalPersonalData!.dismiss(null, 'confirm');
    });
  });
}

onConfirmAddress() {
  this.submitted = true;
  if (this.formAddress.invalid) {
    return;
  }

  let address = new Address();
  address.postalCode = this.formAddress.controls.postalCode.value;
  address.street = this.formAddress.controls.street.value;
  address.district = this.formAddress.controls.district.value;
  address.city = this.formAddress.controls.city.value;
  address.reference = this.formAddress.controls.reference.value;
  address.id = this.formAddress.controls.id.value;
  address.establishmentId = environment.establishmentId;
  this.ionLoaderService.simpleLoader().then(() => {
    this.addressService.save(address).subscribe(response => {
      this.ionLoaderService.dismissLoader();
      this.open_modal_address = false;
  });
});
}

onPayment() {
  if (this.isDelivery === undefined) {
    this.presentToast("Obrigatório selecionar a opção de entrega!")
    return;
  }
  if (this.isDelivery) {
    if (this.formAddress.invalid) {
      this.presentToast("Obrigatório informar o endereço de entrega!")
      return;
    }
    let address = new Address();
    address.id = Number(this.formAddress.controls.id.value);
    address.district = this.formAddress.controls.district.value;
    address.postalCode = this.formAddress.controls.postalCode.value;
    address.street = this.formAddress.controls.street.value;
    address.city = this.formAddress.controls.city.value;
    address.reference = this.formAddress.controls.reference.value;
    this.addressService.insert(address).then(data => 
      this.deliveryOptionService.insert(false).then(data => this.goPayment())
      ); 
  } else {
    this.deliveryOptionService.insert(false).then(data => this.goPayment()); 
  }

 


}

goPayment() {
  this.navCtrl.navigateForward(["payment"]);
}

async presentToast(error: any){
  const toast = await this.toastController.create({
    message: error,
    duration: 2000,
    position: 'middle'
  });
  toast.present();
}

}
