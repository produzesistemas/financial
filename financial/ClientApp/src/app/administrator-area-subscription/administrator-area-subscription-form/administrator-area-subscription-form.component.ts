import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { FilterDefaultModel } from 'src/app/_model/filter-default-model';
import { EstablishmentService } from 'src/app/_services/establishment.service';
import { Subscription } from 'src/app/_model/subscription-model';
import { MaskedDate } from 'src/app/_helpers/masked-date';
import { forkJoin } from 'rxjs';
import { Module } from 'src/app/_model/module-model';
import { PlanService } from 'src/app/_services/plan.service';
import { Plan } from 'src/app/_model/plan-model';
import { SubscriptionService } from 'src/app/_services/subscription.service';

@Component({
  selector: 'app-administrator-area-subscription-form',
  templateUrl: './administrator-area-subscription-form.component.html'
})

export class AdministratorAreaSubscriptionFormComponent implements OnInit {

  form: any;
  plans: any[] = [];
  modules: any[] = [];
  establishments: any[] = [];
  dateMask = MaskedDate;
  public submitted = false;

  constructor(private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private planService: PlanService,
    private establishmentService: EstablishmentService) {
  }

  ngOnInit() {

    const plan = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const subscriptionDate = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const value = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const establishment = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const tolerance = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    this.form = new FormGroup({
      plan: plan,
      establishment: establishment,
      subscriptionDate: subscriptionDate,
      value: value,
      tolerance: tolerance
    });

    this.form.controls.plan.disable();
    this.establishmentService.getAllEstablishment().subscribe(result => {
      this.establishments = result;
    });
  }

  get f() { return this.form.controls; }

  onCancel() {
    this.router.navigate([`/administrator-area-subscription`]);
  }

  onSave() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let subscription = new Subscription();
    subscription.establishmentId = Number(this.form.controls.establishment.value);
    subscription.planId = Number(this.form.controls.plan.value);
    subscription.subscriptionDate = new Date(this.form.controls.subscriptionDate.value.year,
      this.form.controls.subscriptionDate.value.month - 1,
      this.form.controls.subscriptionDate.value.day, 0, 0, 0, 0);
      subscription.value = this.form.controls.value.value;
      subscription.tolerance = Number(this.form.controls.tolerance.value);
      this.subscriptionService.saveByAdm(subscription).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        return this.router.navigate(['administrator-area-subscription']);
      })
  }

  onChange() {
    const filter: Module = new Module();
    if (this.form.controls.establishment.value) {
      let establishment = this.establishments.find(x => x.id === Number(this.form.controls.establishment.value));
      if (establishment) {
        filter.id = establishment.moduleId;
      }
      
    }
    this.planService.getPLanByModule(filter).subscribe(result => {
      this.form.controls.plan.enable();
      this.plans = result;
    });
  }

  onChangePlan(plan: Plan) {
    if (this.form.controls.plan.value) {
      this.form.controls.value.setvalue(this.form.controls.plan.value.value);
    }
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

}

