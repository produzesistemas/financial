import { DelicatessenCouponService } from '../_services/coupon.service';
import { DelicatessenCoupon } from '../_model/delicatessen-coupon-model';
import { DelicatessenProductService } from 'src/app/_services/delicatessen-product.service';
import { DelicatessenProduct } from 'src/app/_model/delicatessen-product-model';
import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-partner-area-coupon',
  templateUrl: './partner-area-coupon.component.html'
})

export class PartnerAreaCouponComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
//   lstCategorias = [];
  public lst: any[] = [];
  coupon: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 10;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private delicatessenCouponService: DelicatessenCouponService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const description = new FormControl('');

    this.form = new FormGroup({
      description: description,
    });
    // this.onSubmit();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter: FilterDefaultModel = new FilterDefaultModel();
    filter.name = this.form.controls.description.value;
    this.delicatessenCouponService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/partner-area-coupon/0/0`]);
  }

  edit(obj: DelicatessenProduct) {
    this.router.navigate([`/partner-area-coupon/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: DelicatessenProduct) {
    this.coupon = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.delicatessenCouponService.deleteById(this.coupon.id).subscribe(() => {
      const index: number = this.lst.indexOf(this.coupon);
      if (index !== -1) {
        this.lst.splice(index, 1);
      }
      this.closeDelete();
      this.toastr.success('Excluído com sucesso!', '');
    });
  }

  closeDelete() {
  this.modalDelete.hide();
  }

  onActive(item: any) {
    this.delicatessenCouponService.active(item).subscribe(result => {
      this.onSubmit();
    });
  }
}
