import { CenterCost } from './../../_model/center-cost-model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CenterCostService } from 'src/app/_services/center-cost.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-center-cost-form',
  templateUrl: './center-cost-form.component.html'
})
export class CenterCostFormComponent implements OnInit {
  form: any;
  submitted = false;
  public centerCost: CenterCost = new CenterCost();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private centerCostService: CenterCostService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {

    const description = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const code = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const createdBy = new FormControl('');
    
    const changedBy = new FormControl('');

    const createDate = new FormControl('');

    const updateDate = new FormControl('');

    const id = new FormControl(0);


    this.form = new FormGroup({
      description: description,
      code: code,
      createdBy: createdBy,
      changedBy: changedBy,
      createDate: createDate,
      updateDate: updateDate,
      id: id,

    });

      this.route.params.subscribe(params => {
        if (params['isEdit'] == '1') {
          this.centerCost.id = Number(params['id']);
        }
      });
  
    }

    load() {
      if (this.centerCost.id) {
        this.centerCostService.getCenterCost(this.centerCost.id).subscribe(result => {
          this.centerCost = result;
          this.loadControls();
        });
      }
    }

    onSave() {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      const centerCost = new CenterCost(this.form.value);
      centerCost.createDate = new Date();
      this.centerCostService.save(centerCost).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        this.router.navigate(['/center-cost']);
    });
    }

    onCancel() {
      this.router.navigate([`/center-cost`]);
    }

    loadControls() {
      this.form.controls.description.setValue(this.centerCost.description);
      this.form.controls.code.setValue(this.centerCost.code);
      this.form.controls.id.setValue(this.centerCost.id);
      this.form.controls.createdBy.setValue(this.centerCost.createdBy);
      this.form.controls.changedBy.setValue(this.centerCost.changedBy);
    }

    getDateCreate() {
      return this.centerCost.createDate;
    }

    getDateChange() {
            return this.centerCost.updateDate;
      }

}

