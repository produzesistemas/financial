import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountPlan } from 'src/app/_model/account-plan-model';
import { AccountPlanService } from 'src/app/_services/account-plan.service';
import { AccountTypeService } from 'src/app/_services/account-type.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-account-plan-form',
  templateUrl: './account-plan-form.component.html'
})
export class AccountPlanFormComponent implements OnInit {
  form: any;
  submitted = false;
  public accountPlan: AccountPlan = new AccountPlan();
  public accountTypes: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private accountPlanService: AccountPlanService,
    private accountTypeService: AccountTypeService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {

    const description = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const type = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const classification = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const accountType = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const createdBy = new FormControl('');
    
    const changedBy = new FormControl('');

    const createDate = new FormControl('');

    const updateDate = new FormControl('');

    const id = new FormControl(0);


    this.form = new FormGroup({
      description: description,
      type: type,
      classification: classification,
      createdBy: createdBy,
      changedBy: changedBy,
      createDate: createDate,
      updateDate: updateDate,
      accountType: accountType,
      id: id,

    });

    this.route.params.subscribe(params => {
      if (params['isEdit'] == '1') {
        this.accountPlan.id = Number(params['id']);
      }
    });

  this.load();
  }

  load() {
    if (this.accountPlan.id !== undefined) {
      forkJoin(
        this.accountPlanService.getById(this.accountPlan.id),
        this.accountTypeService.getAllType()
      ).subscribe(result => {
        this.accountPlan = result[0];
        this.accountTypes = result[1];
        this.loadControls();
      });
    }

    if (this.accountPlan.id === undefined) {
      this.accountTypeService.getAllType().subscribe(result => {
        this.accountTypes = result;
      });
    }
  }



  onSave() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const accountPlan = new AccountPlan(this.form.value);
    accountPlan.createDate = new Date();
    accountPlan.accountTypeId = this.form.controls.accountType.value.id;

    this.accountPlanService.save(accountPlan).subscribe(result => {
      this.toastr.success('Registro efetuado com sucesso!');
      this.router.navigate(['/account-plan']);
    });
  }

  onCancel() {
    this.router.navigate([`/account-plan`]);
  }

  loadControls() {
    this.form.controls.description.setValue(this.accountPlan.description);
    this.form.controls.classification.setValue(this.accountPlan.classification);
    this.form.controls.id.setValue(this.accountPlan.id);
    this.form.controls.createdBy.setValue(this.accountPlan.createdBy);
    this.form.controls.changedBy.setValue(this.accountPlan.changedBy);
    this.form.controls.accountType.setValue(this.accountTypes.find(x => x.id === this.accountPlan.accountType.id));
  }

  getDateCreate() {
    return this.accountPlan.createDate;
  }

  getDateChange() {
          return this.accountPlan.updateDate;
    }
  
}

