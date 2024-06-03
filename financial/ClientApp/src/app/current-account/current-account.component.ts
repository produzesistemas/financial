import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CurrentAccount } from 'src/app/_model/current-account-model';
import { CurrentAccountService } from 'src/app/_services/current-account.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';

@Component({
  selector: 'app-current-account',
  templateUrl: './current-account.component.html'
})

export class CurrentAccountComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  currentAccount: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private currentAccountService: CurrentAccountService,
    private router: Router) {
  }

  ngOnInit() {
    const account = new FormControl('');

    this.form = new FormGroup({
      account: account,
    });
    // this.onSubmit();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter: FilterDefaultModel = new FilterDefaultModel();
    filter.name = this.form.controls.account.value;
    this.currentAccountService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/current-account/0/0`]);
  }

  edit(obj: CurrentAccount) {
    this.router.navigate([`/current-account/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: CurrentAccount) {
    this.currentAccount = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.currentAccountService.deleteById(this.currentAccount.id).subscribe(() => {
      const index: number = this.lst.indexOf(this.currentAccount);
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
