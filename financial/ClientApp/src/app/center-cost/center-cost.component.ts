import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CenterCost } from 'src/app/_model/center-cost-model';
import { CenterCostService } from 'src/app/_services/center-cost.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';

@Component({
  selector: 'app-center-cost',
  templateUrl: './center-cost.component.html'
})

export class CenterCostComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  centerCost: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private centerCostService: CenterCostService,
    private router: Router) {
  }

  ngOnInit() {

    const code = new FormControl('');

    this.form = new FormGroup({
      code: code,
    });
    // this.onSubmit();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter: FilterDefaultModel = new FilterDefaultModel();
    if (this.form.controls.code.value) {
      filter.email = this.form.controls.code.value;
    }
    this.centerCostService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/center-cost/0/0`]);
  }

  edit(obj: CenterCost) {
    this.router.navigate([`/center-cost/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: CenterCost) {
    this.centerCost = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.centerCostService.deleteById(this.centerCost.id).subscribe(() => {
      const index: number = this.lst.indexOf(this.centerCost);
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
