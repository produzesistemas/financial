import { StatusOrder } from './../../_model/status-order-model';
import { DelicatessenOrderService } from './../../_services/delicatessen-order.service';
import { DelicatessenOrder } from './../../_model/delicatessen-order-model';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FilterDefaultModel } from '../../_model/filter-default-model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NetworkService } from 'src/app/_services/network.service';

@Component({
    selector: 'app-partner-area-delicatessen-order-form',
    templateUrl: './partner-area-delicatessen-order-form.component.html'
})
export class PartnerAreaDelicatessenOrderFormComponent implements OnInit {
    public modalRef: BsModalRef = new BsModalRef();
    public modalDelete: BsModalRef = new BsModalRef();
    public modalMail: BsModalRef = new BsModalRef();
    public modalData: BsModalRef = new BsModalRef();  
      form: any;
    public submitted = false;
    public submittedCancel = false;
    public submittedMail = false;
    public delicatessenOrder: DelicatessenOrder = new DelicatessenOrder();
    public store: any = {};
    public parent: number = 0;
    public shoppingCart: any[] = [];
    public itemCart: any;
    public currentUser: any;
    payment: any;
    imgProofPix: any;
    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private networkService: NetworkService,
        private delicatessenOrderService: DelicatessenOrderService
    ) { }

    get f() { return this.form.controls; }

    ngOnInit() {

        this.route.params.subscribe(params => {
            if (params['isEdit'] == '1') {
              this.delicatessenOrder.id = Number(params['id']);
            }
          });
            this.load();
          }

    load() {
        this.delicatessenOrderService.getToPartner(this.delicatessenOrder).subscribe(result => {
            this.delicatessenOrder = result;
          })        
  }

    onBack() {
        this.router.navigate(['/partner-area-delicatessen-order']);
    }

    getImageProduct(imageName: string) {
        return environment.urlImagesDelicatessenProduct + imageName;
    }
    
    getSubtotalDelicatessenProducts(item: any) {
        return item.delicatessenProductValue * item.quantity;
    }

    getTotalProducts() {
        let totalValue = 0;
        if (this.delicatessenOrder.delicatessenOrderProducts.length > 0) {
            this.delicatessenOrder.delicatessenOrderProducts.forEach((item) => {
                totalValue += (item.value! * item.quantity!);
            });
        }
        return totalValue;
    }


    getTotalSale() {
      let totalValue = 0;
      this.delicatessenOrder.delicatessenOrderProducts.forEach((item) => {
          totalValue += (item.value! * item.quantity!);
      });

      if (this.delicatessenOrder.coupon) {
          if (this.delicatessenOrder.coupon.type) {
              totalValue -= this.delicatessenOrder.coupon.value!;
          } else {
              totalValue -= (totalValue * this.delicatessenOrder.coupon.value!) / 100;
          }
      }

      if (this.delicatessenOrder.taxValue) {
          totalValue += this.delicatessenOrder.taxValue;
      }
      return totalValue
  }

    // getCurrentStatus(delicatessenOrder: any) {
    //     if (delicatessenOrder.delicatessenOrderTrackings.length > 0) {
    //         return delicatessenOrder.delicatessenOrderTrackings[delicatessenOrder.delicatessenOrderTrackings.length - 1].orderPaymentStatus.description;
    //     }
    // }

    getStatusPedido(delicatessenOrder: any) {
        if (delicatessenOrder.delicatessenOrderTrackings.length > 0) {
            return delicatessenOrder.delicatessenOrderTrackings[delicatessenOrder.delicatessenOrderTrackings.length - 1].statusOrder.description;
        }
    }

    getImage(imageName: string) {
      return environment.urlImagesDelicatessenProduct + imageName;
  }  

  getSubtotal(item: any) {
    return item.value * item.quantity;
}


}

