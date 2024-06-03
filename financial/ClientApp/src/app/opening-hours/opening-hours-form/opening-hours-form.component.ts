import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OpeningHoursService } from '../../_services/opening-hours.service';
import { OpeningHours } from '../../_model/opening-hours-model';
import { DaysWeekService } from 'src/app/_services/days-week.service';

@Component({
  selector: 'app-opening-hours-form',
  templateUrl: './opening-hours-form.component.html'
})

export class OpeningHoursFormComponent implements OnInit {
  public currentUser: any;
  form: any;
  public fileToUpload: any;
  uploaded = false;
  public daysWeek: any[] = [];
  public submitted = false;
  public openingHours: OpeningHours = new OpeningHours();

  constructor(private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private daysWeekService: DaysWeekService,
    private openingHoursService: OpeningHoursService,) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['isEdit'] == '1') {
        this.openingHours.id = Number(params['id']);
      }
    });

    const endTime = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const startTime = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const weekday = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    this.form = new FormGroup({
      startTime: startTime,
      endTime: endTime,
      weekday: weekday,
    });
    this.daysWeek = this.daysWeekService.get()
    if (this.openingHours.id !== undefined) {
      this.loadForm()
    }
  }

  loadForm() {
      this.openingHoursService.getById(this.openingHours.id).subscribe(openingHours => {
        if (openingHours !== undefined) {
          this.openingHours = openingHours;
          this.loadObject(this.openingHours);
        }
      });
  }


  get f() { return this.form.controls; }

  loadObject(item: OpeningHours) {
    this.openingHours = item;
    this.form.controls.startTime.setValue(item.startTime);
    this.form.controls.endTime.setValue(item.endTime);
    this.form.controls.weekday.setValue(item.weekday);
  }


  onCancel() {
    this.router.navigate([`/opening-hours`]);
  }

  onSave() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.openingHours.startTime = this.form.controls.startTime.value;
    this.openingHours.endTime = this.form.controls.endTime.value;
    this.openingHours.weekday = Number(this.form.controls.weekday.value);
  
    this.openingHoursService.save(this.openingHours).subscribe(result => {
      this.toastr.success('Registro efetuado com sucesso!');
      this.router.navigate(['opening-hours']);
    });
  }
  
}

