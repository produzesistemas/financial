import { Component, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FilterDefaultModel } from '../_model/filter-default-model';
import { EstablishmentService } from '../_services/establishment.service';
import { ToastrService } from 'ngx-toastr';
import { Establishment } from '../_model/establishment-model';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-administrator-area-establishment',
  templateUrl: './administrator-area-establishment.component.html'
})

export class AdministratorAreaEstablishmentComponent implements OnInit {
  loading = false;
  submitted = false;
  public establishment: any;
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  public lst : Establishment[] = [];
  @Output() action = new EventEmitter();
  page = 1;
  form: any;
  pageSize = 5;
  public currentUser: any;
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private establishmentService: EstablishmentService
  ) {
  }

  ngOnInit() {
    if (this.authenticationService.getCurrentUser()) {
      this.authenticationService.getCurrentUser().role === 'Administrador' ? this.currentUser = this.authenticationService.getCurrentUser() : null;
  }

  const search = new FormControl('', Validators.compose([
    Validators.required,
  ]));

  this.form = new FormGroup({
    search: search,
  });

  this.onSubmit();
  }

  onSubmit() {
    const filter: FilterDefaultModel = new FilterDefaultModel();
    if (this.form.controls.search.value) {
      filter.search = this.form.controls.search.value;
    }
    
    this.establishmentService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }


onNew() {
  this.router.navigate([`/administrator-area-establishment/0/0`]);
}
onReset() {
  this.form.controls.search.reset();
}

edit(obj: Establishment) {
  this.router.navigate([`/administrator-area-establishment/${obj.id}/1`]);
}

deleteById(template: TemplateRef<any>, item: Establishment) {
  this.establishment = item;
  this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
}

confirmDelete() {
  this.establishmentService.deleteById(this.establishment).subscribe(() => {
    const index: number = this.lst.indexOf(this.establishment);
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
  this.establishmentService.active(item).subscribe(result => {
    this.onSubmit();
  });
}
 
}
