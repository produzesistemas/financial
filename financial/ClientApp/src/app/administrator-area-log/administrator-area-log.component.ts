import { TypeLogService } from './../_services/type-log.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterDefaultModel } from '../_model/filter-default-model';
import { LogService } from '../_services/log.service';
@Component({
  selector: 'app-administrator-area-log',
  templateUrl: './administrator-area-log.component.html'
})

export class AdministratorAreaLogComponent implements OnInit {
  form: any;
  loading = false;
  submitted = false;
  type: any;
  public lstLog: any[] = [];
  public lstType: any[] = [];
  page = 1;
  pageSize = 5;

  constructor(
    private typeLogService: TypeLogService,
    private logService: LogService,
  ) {
  }

  ngOnInit() {
    const description = new FormControl('');
    const type = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const createDate = new FormControl('');
  
    this.form = new FormGroup({
      description: description,
      type: type,
      createDate: createDate,
    });
    this.lstType = this.typeLogService.get()
  
  }

  get f() { return this.form.controls; }


  onSubmit() {

    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const filter: FilterDefaultModel = new FilterDefaultModel();
    if (this.form.controls.description.value) {
      filter.search = this.form.controls.description.value;
    }
    if (this.form.controls.type.value) {
      filter.type = Number(this.form.controls.type.value);
   }

   this.logService.getByFilter(filter).subscribe(
    data => {
      this.lstLog = data;
    }
  );
}

  onReset() {
    this.form.reset();
  }
      
  getType(type: any) {
    return this.typeLogService.getName(type)
  }

}
