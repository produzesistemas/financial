import { StatusOrder } from 'src/app/_model/status-order-model';
import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DelicatessenOrder } from 'src/app/_model/delicatessen-order-model';
import { DelicatessenOrderService } from 'src/app/_services/delicatessen-order.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';
import { StatusOrderService } from '../_services/status-order.service';
import { MaskedDate } from '../_helpers/masked-date';

@Component({
  selector: 'app-partner-area-delicatessen-order',
  templateUrl: './partner-area-delicatessen-order.component.html'
})

export class PartnerAreaDelicatessenOrderComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalConfirm: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  public lstStatusOrder: StatusOrder[] = [];
  lstStatusOrderPayment = [];
  @Output() action = new EventEmitter();
  dateMask = MaskedDate;
  page = 1;
  pageSize = 10;
  public delicatessenOrder: DelicatessenOrder = new DelicatessenOrder();

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private delicatessenOrderService: DelicatessenOrderService,
    private statusOrderService: StatusOrderService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const statusOrder = new FormControl('');

    this.form = new FormGroup({
      statusOrder: statusOrder,
    });
    this.getAllStatus();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter = new FilterDefaultModel();
    filter.id = Number(this.form.controls.statusOrder.value);
    // filter.name = this.form.controls.delicatessenOrderStatus.value;
    this.delicatessenOrderService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

//   getImage(imageName: string) {
//     return environment.urlImagesDelicatessenProduct + imageName;
// }

//   closeConfirm() {
//     this.modalConfirm.hide();
//   }

//   closeConfirmDelivery() {
//     this.modalRef.hide();
//   }

  // onConfirm(delicatessenOrder: any) {
  //   this.closeConfirm();
  //   const filter: FilterDefaultModel = new FilterDefaultModel();
  //   filter.id = delicatessenOrder.id;
  //   this.delicatessenOrderService.onConfirm(filter).subscribe(result => {
  //     this.toastr.success('Pedido confirmado para entrega com sucesso!', '');
  //   });
  // }

  // onConfirmDelivery(delicatessenOrder: any) {
  //   this.closeConfirmDelivery();
  //   const filter: FilterDefaultModel = new FilterDefaultModel();
  //   filter.id = delicatessenOrder.id;
  //   this.delicatessenOrderService.onConfirmDelivery(filter).subscribe(result => {
  //     this.toastr.success('Pedido concluído com sucesso!', '');
  //   });
  // }

//   getImageProduct(imageName: string) {
//     return environment.urlImagesDelicatessenProduct + imageName;
// }

  // getSubtotal(item: any) {
  //   return item.delicatessenProductValue * item.quantity;
  // }

  // getTotalProducts() {
  //   let totalValue = 0;
  //   if (this.delicatessenOrder.delicatessenOrderProducts.length > 0) {
  //     this.delicatessenOrder.delicatessenOrderProducts.forEach((item) => {
  //       totalValue += (item.value! * item.quantity!);
  //     });
  //   }
  //   return totalValue;
  // }

  // getTrackingData(orderTracking: any) {
  //   return orderTracking.data;
  // }

  // getCurrentStatus(delicatessenOrder: any) {
  //   return delicatessenOrder.orderTrackings[delicatessenOrder.orderTrackings.length - 1].orderPaymentStatus.description;
  // }

  openDetails(item: DelicatessenOrder) {
    this.router.navigate([`/partner-area-delicatessen-order/${item.id}`]);
  }

  // openConfirm(template: TemplateRef<any>, item: DelicatessenOrder) {
  //   this.delicatessenOrder = item;
  //   this.modalConfirm = this.modalService.show(template, { class: 'modal-md' });
  // }

  // openConfirmDelivery(template: TemplateRef<any>, item: DelicatessenOrder) {
  //   this.delicatessenOrder = item;
  //   this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  // }



  getDelicatessenOrderStatus(delicatessenOrder: any) {
    return delicatessenOrder.delicatessenOrderTrackings[delicatessenOrder.delicatessenOrderTrackings.length - 1].statusOrder.description;
  }

  // checkConfirm(item: any) {
  //   if ((item.orderTrackings[item.orderTrackings.length - 1].orderStatusId === 2) &&
  //     (item.orderTrackings[item.orderTrackings.length - 1].orderPaymentStatusId === 2)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // checkConfirmDelivery(item: any) {
  //   return item.orderTrackings[item.orderTrackings.length - 1].orderStatusId === 6 ||
  //     item.orderTrackings[item.orderTrackings.length - 1].orderStatusId === 5 ? true : false;
  // }

  // onClearFilter() {
  //   this.form.controls.delicatessenOrderStatus.reset();
  // }

  onView(obj: DelicatessenOrder) {
    this.router.navigate([`/partner-area-delicatessen-order/${obj.id}/1`]);
  }
  
  getAllStatus() {
    this.statusOrderService.getAllStatusOrder().subscribe(
      data => {
        this.lstStatusOrder = data;
      }
    );
  }


}
