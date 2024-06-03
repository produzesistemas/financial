import { DaysWeekService } from './../_services/days-week.service';
import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { OpeningHours } from 'src/app/_model/opening-hours-model';
import { OpeningHoursService } from 'src/app/_services/opening-hours.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html'
})

export class OpeningHoursComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  submitted = false;
  public lst: any[] = [];
  @Output() action = new EventEmitter();
  openingHours : OpeningHours = new OpeningHours();
  page = 1;
  pageSize = 10;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private daysWeekService: DaysWeekService,
    private openingHoursService: OpeningHoursService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.onSubmit();
  }

  onSubmit() {
    this.openingHoursService.getAllOpeningHours().subscribe(
      result => {
        this.lst = result;
          }
    );
  }

   onNew() {
    this.router.navigate([`/opening-hours/0/0`]);
  }

  edit(obj: OpeningHours) {
    this.router.navigate([`/opening-hours/${obj.id}/1`]);
  }

  onActive(item: any) {
    this.openingHoursService.active(item).subscribe(result => {
      this.onSubmit();
    });
  }
  getDaysWeek(weekday: any) {
    return this.daysWeekService.getNameDayWeek(weekday)
  }

  deleteById(template: TemplateRef<any>, item: OpeningHours) {
    this.openingHours = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.openingHoursService.deleteById(this.openingHours).subscribe(() => {
      const index: number = this.lst.indexOf(this.openingHours);
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

getHours(time: string) {
  let startingDay = new Date();
  let h = Number(time.substring(0,2));
  let m = Number(time.substring(2,4));
  let newDate = new Date(startingDay.getFullYear(),startingDay.getMonth(),startingDay.getDate(),h,m,0,0);
  return newDate;
}
  
}
