import { DelicatessenOrder } from './../_models/delicatessen-order-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IonLoadingService } from '../_services/ion-loading.service';
import { DelicatessenOrderService } from '../_services/delicatessen-order.service';
import { Category } from '../_models/category-model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  public delicatessenOrderId: string | undefined;
  public title: string | undefined;
  public lst: Category[] = [];
  delicatessenOrder: DelicatessenOrder | undefined;
  constructor(private activatedRoute: ActivatedRoute, 
    private delicatessenOrderService: DelicatessenOrderService,
    private ionLoaderService: IonLoadingService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.delicatessenOrderId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.ionLoaderService.simpleLoader().then(()=>{
      this.delicatessenOrderService.getById(Number(this.delicatessenOrderId)).subscribe(result => {
      this.delicatessenOrder = result;
      this.ionLoaderService.dismissLoader();
    });
  });
  }

  getImage(imageName: any) {
    return environment.urlImagesProducts + imageName;
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

getDeliveryOption(order: any) {
  let result = '';

  if (order.delivery) {
    result = 'Delivery';
}
if (order.instorePickup) {
  result = 'Retirar na loja';
}


  return result;
}

getPaymentOption(order: any) {
  let result = '';

  if (order.paymentMoney) {
    result = 'Dinheiro';
}
if (order.paymentLittleMachine) {
  result = 'Cartão';
}
if (order.paymentOnline) {
  result = 'Online';
}


  return result;
}

getPaymentCondition(order: any) {
  switch (order.paymentConditionId) {
    case 1:
      return 'Dinheiro'
      break;
    case 2:
      return 'Cartão de crédito'
      break;
    case 3:
      return 'Cartão de débito'
      break;
    case 4:
      return 'PIX'
      break;
     default: {
      return ''
      break;
     }
    
  }
}

getTotalValueProducts(order: any) {
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
  return totalValue
}






}