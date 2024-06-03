import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DeliveryRegion } from 'src/app/_model/delivery-region-model';
import { DeliveryRegionService } from 'src/app/_services/delivery-region.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';

@Component({
  selector: 'app-delivery-region',
  templateUrl: './delivery-region.component.html'
})

export class DeliveryRegionComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  deliveryRegion: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private deliveryRegionService: DeliveryRegionService,
    private router: Router) {
  }

  ngOnInit() {
    const postalCode = new FormControl('');

    this.form = new FormGroup({
      postalCode: postalCode,
    });
    // this.onSubmit();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter: DeliveryRegion = new DeliveryRegion();
    filter.postalCode = this.form.controls.postalCode.value;
    this.deliveryRegionService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/delivery-region/0/0`]);
  }

  edit(obj: DeliveryRegion) {
    this.router.navigate([`/delivery-region/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: DeliveryRegion) {
    this.deliveryRegion = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.deliveryRegionService.deleteById(this.deliveryRegion).subscribe(() => {
      const index: number = this.lst.indexOf(this.deliveryRegion);
      if (index !== -1) {
        this.lst.splice(index, 1);
      }
      this.closeDelete();
      this.toastr.success('Excluído com sucesso!', '');
    });
  }
  onActive(item: any) {
    this.deliveryRegionService.active(item).subscribe(result => {
      this.onSubmit();
    });
  }


  closeDelete() {
  this.modalDelete.hide();
  }

  formatPostalCode(postalCode: string) {
    return postalCode.substring(0,5) + "-" + postalCode.substring(5,8);
  }
}
