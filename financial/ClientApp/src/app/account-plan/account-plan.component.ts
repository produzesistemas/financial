import { Component, OnInit, TemplateRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AccountPlan } from 'src/app/_model/account-plan-model';
import { AccountPlanService } from 'src/app/_services/account-plan.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';

@Component({
  selector: 'app-account-plan',
  templateUrl: './account-plan.component.html'
})

export class AccountPlanComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  public modalImport: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  public errors: any[] = [];
  accountPlan: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private accountPlanService: AccountPlanService,
    private router: Router) {
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
    if (this.form.controls.description.value) {
      filter.email = this.form.controls.description.value;
    }
    this.accountPlanService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/account-plan/0/0`]);
  }

  edit(obj: AccountPlan) {
    this.router.navigate([`/account-plan/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: AccountPlan) {
    this.accountPlan = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.accountPlanService.deleteById(this.accountPlan.id).subscribe(() => {
      const index: number = this.lst.indexOf(this.accountPlan);
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

  closeImport() {
    this.modalImport.hide();
    }
}
