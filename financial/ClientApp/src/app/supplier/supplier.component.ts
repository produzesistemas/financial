import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/_model/supplier-model';
import { SupplierService } from 'src/app/_services/supplier.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html'
})

export class SupplierComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  supplier: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private supplierService: SupplierService,
    private router: Router) {
  }

  ngOnInit() {

    const name = new FormControl('');

    this.form = new FormGroup({
      name: name,
    });
    // this.onSubmit();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter: FilterDefaultModel = new FilterDefaultModel();
    if (this.form.controls.name.value) {
      filter.email = this.form.controls.name.value;
    }
    this.supplierService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/supplier/0/0`]);
  }

  edit(obj: Supplier) {
    this.router.navigate([`/supplier/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: Supplier) {
    this.supplier = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.supplierService.deleteById(this.supplier.id).subscribe(() => {
      const index: number = this.lst.indexOf(this.supplier);
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


}
