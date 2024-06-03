import { Component, OnInit } from '@angular/core';
import { DelicatessenProductService } from '../_services/delicatessen-product.service';
import { environment } from '../../environments/environment';
import { DelicatessenProduct } from '../_models/delicatessen-product-model';
import { IonLoadingService } from '../_services/ion-loading.service';
import { Category } from '../_models/category-model';
import { NavController, ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryRegionService } from '../_services/delivery-region.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ShoppingCart } from '../_models/shopping-cart-model';
import { ShoppingCartService } from '../_services/shopping-cart.service';
import { forkJoin } from 'rxjs';
import { OpeningHoursService } from '../_services/opening-hours.service';
import { UtilsService } from '../_services/utils.service';
@Component({
  selector: 'app-product-page',
  templateUrl: 'product.page.html',
  styleUrls: ['product.page.scss'],
})
export class ProductPage implements OnInit {
public lst: Category[] = [];
public filterProduct: DelicatessenProduct[] = [];
public shoppingsCart: ShoppingCart[] = [];
form: any;
public lastPostalCode: any;
public status: any;
public shoppingCartValue: number = 0;
submitted = false;
  constructor(
    private navCtrl: NavController,
    private delicatessenProductService: DelicatessenProductService,
    private openingHoursService: OpeningHoursService,
    private utilsService: UtilsService,
    private ionLoaderService: IonLoadingService,
    private deliveryRegionService: DeliveryRegionService,
    private authenticationService: AuthService,
    public toastController: ToastController,
    private shoppingCartService: ShoppingCartService,
    private router: Router
  ) {}
  
  ngOnInit(): void {

    this.deliveryRegionService.getLastPostalCode()
    .then(data => 
      this.setPostalCode(data)
      );

    this.ionLoaderService.simpleLoader().then(() => {
      const filter: DelicatessenProduct = new DelicatessenProduct();
      filter.establishmentId = environment.establishmentId;
      forkJoin(
        this.delicatessenProductService.getByEstablishment(filter),
        this.openingHoursService.getByEstablishment(filter)
      ).subscribe(response => {
        if (response[0]) {
          this.filterProduct = response[0];
          let promotions = response[0].filter(x => x.promotion);
          if (promotions.length > 0) {
            let categoryPromotion = new Category()
            categoryPromotion.description = "Promoções"
            categoryPromotion.delicatessenProducts = promotions;
            this.lst.push(categoryPromotion)  
          } 
          const allCategorys = response[0].map(p => {
            return p.category
        })
  
          const distinctCategorys = allCategorys.filter(
            (thing, i, arr) => arr.findIndex(t => t!.id === thing!.id) === i
          );
          distinctCategorys.forEach(category => {
            category!.delicatessenProducts = []
            response[0].filter(x => x.categoryId === category?.id).forEach(product => {
              if (!product.promotion) {
                category!.delicatessenProducts.push(product)
              }
            });
            if (category!.delicatessenProducts.length > 0) {
              this.lst.push(category!)
            }
  
          });
        }
        if (response[1]) {
          let openingHourActual =  this.utilsService.getOpeningHourActual(response[1]);
          if (openingHourActual) {
            this.status = "Aberto até as " + openingHourActual.endTime!.substring(0,2) + ":" + openingHourActual.endTime!.substring(2,4);
          } else {
            this.status = "Fechado";
          }
        }
        this.ionLoaderService.dismissLoader();
      });
    });
  }

  get f() { return this.form.controls; }

  getImage(imageName: string) {
    return environment.urlImagesProducts + imageName;
}

onBuy(delicatessenProduct: DelicatessenProduct) {
  this.shoppingCartService.getAllShoppingCart()
  .then(shoppingsCart => 
    this.increment(shoppingsCart, delicatessenProduct)
    );
}

  increment(shoppingsCart: any, delicatessenProduct: DelicatessenProduct) {
    if (shoppingsCart === null) {
      this.shoppingsCart = [];
      this.onAddNewShoppingCart(delicatessenProduct)
    } else {
      this.shoppingsCart = shoppingsCart;
      const item = this.shoppingsCart.find(x => x.delicatessenProductId === delicatessenProduct.id);
      if (item) {
        item.quantity!++;
        this.shoppingCartService.insert(this.shoppingsCart);
        
      } else {
        this.onAddNewShoppingCart(delicatessenProduct)
      }
    }
  }

  insertShoppingCart(shoppingsCart: any) {
    this.shoppingCartService.insert(this.shoppingsCart);
  }

  onAddNewShoppingCart(delicatessenProduct: DelicatessenProduct) {
    let itemCart = new ShoppingCart();
    itemCart.delicatessenProductId = delicatessenProduct.id;
    itemCart.quantity = 1;
    itemCart.description = delicatessenProduct.description;
    if (delicatessenProduct.promotion) {
      itemCart.value = delicatessenProduct.promotionValue;
    } else {
      itemCart.value = delicatessenProduct.value;
    }
    itemCart.imageName = delicatessenProduct.imageName;
    this.shoppingsCart.push(itemCart);
    this.shoppingCartService.insert(this.shoppingsCart);
    this.presentToast("Item adicionado ao carrinho!")
  }

  async presentToast(error: any){
    const toast = await this.toastController.create({
      message: error,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }

  

setPostalCode(postalCode: any) {
  if (postalCode != null) {
    this.lastPostalCode = postalCode;
  } else {
    this.navCtrl.navigateForward(["verify-postal-code"]);
  }
}

handleInput(event: any) {
  const query = event.target.value.toLowerCase();
  let filtered = this.filterProduct.filter((d) => d.description!.toLowerCase().indexOf(query) > -1);
  this.lst = []
      let promotions = filtered.filter(x => x.promotion);
      if (promotions.length > 0) {
        let categoryPromotion = new Category()
        categoryPromotion.description = "Promoções"
        categoryPromotion.delicatessenProducts = promotions;
        this.lst.push(categoryPromotion)  
      } 
      const allCategorys = filtered.map(p => {
        return p.category
    })

      const distinctCategorys = allCategorys.filter(
        (thing, i, arr) => arr.findIndex(t => t!.id === thing!.id) === i
      );
      distinctCategorys.forEach(category => {
        category!.delicatessenProducts = []
        filtered.filter(x => x.categoryId === category?.id).forEach(product => {
          if (!product.promotion) {
          category!.delicatessenProducts.push(product)
          }
        });
        if (category!.delicatessenProducts.length > 0) {
        this.lst.push(category!)
        }
      });
}

}
