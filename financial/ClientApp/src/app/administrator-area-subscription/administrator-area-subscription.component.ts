import { Establishment } from './../_model/establishment-model';
import { Component, OnInit, TemplateRef, Output, EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { EstablishmentService } from 'src/app/_services/establishment.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileHelper } from 'src/app/_helpers/file-helper';
import { Subscription } from '../_model/subscription-model';
import { SubscriptionService } from '../_services/subscription.service';
import { Plan } from '../_model/plan-model';

@Component({
  selector: 'app-administrator-area-subscription',
  templateUrl: './administrator-area-subscription.component.html'
})

export class AdministratorAreaSubscriptionComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  form: any;
  loading = false;
  submitted = false;
  public isActive = false;
  public lstUsers: any[] = [];
  public lst: any[] = [];
  establishment: any;
  public subscription: Subscription = new Subscription();
  public lstEstablishment: Establishment[] = [];
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 10;
  public modalDelete: BsModalRef = new BsModalRef();

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private fileHelper: FileHelper,
    private subscriptionService: SubscriptionService,
    private establishmentService: EstablishmentService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const establishment = new FormControl('');
  
    this.form = new FormGroup({
      establishment: establishment,
    });
  
      this.establishmentService.getAllEstablishment().subscribe(result => {
      this.lstEstablishment = result;
  })
  }

  onSubmit() {
    const filter: Subscription = new Subscription();
    if (this.form.controls.establishment.value) {
      filter.establishmentId = Number(this.form.controls.establishment.value);
   }
   this.subscriptionService.getByFilter(filter).subscribe(result => {
    this.lst = result;
   });

}

  onNew() {
    this.router.navigate([`/administrator-area-subscription/0/0`]);
  }

  onReset() {
    this.form.reset();
  }
    
  downloadFile(item: any) {
      this.fileHelper.DownloadFile(item);
  }

  closeDelete() {
    this.modalDelete.hide();
    }

    confirmDelete() {
      this.subscriptionService.deleteById(this.subscription).subscribe(() => {
        const index: number = this.lst.indexOf(this.subscription);
        if (index !== -1) {
          this.lst.splice(index, 1);
        }
        this.closeDelete();
        this.toastr.success('Excluído com sucesso!', '');
      });
    }
  
    deleteById(template: TemplateRef<any>, item: Subscription) {
      this.subscription = item;
      this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
    }

    getDueDate(plan: Plan, date: Date, day: number) {
      let returnDate = new Date(date);
      returnDate.setMonth(
        (returnDate.getMonth()+plan.qtdMonth!)
        )

      returnDate.setDate(returnDate.getDate() + day);
      return returnDate;
    }

}
