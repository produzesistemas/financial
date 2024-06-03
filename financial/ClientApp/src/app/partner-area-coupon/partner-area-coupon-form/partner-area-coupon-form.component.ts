import { DelicatessenCouponService } from '../../_services/coupon.service';
import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DelicatessenCoupon } from '../../_model/delicatessen-coupon-model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MaskedDate } from 'src/app/_helpers/masked-date';

@Component({
  selector: 'app-partner-area-coupon-form',
  templateUrl: './partner-area-coupon-form.component.html'
})

export class PartnerAreaCouponFormComponent implements OnInit {
  public currentUser: any;
  form: any;
  public submitted = false;
  public coupon: DelicatessenCoupon = new DelicatessenCoupon();
  public lstTypes: any[] = [];
  public lstClients: any[] = [];
  public isGeneral = false;
  dateMask = MaskedDate;
  constructor(private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private delicatessenCouponService: DelicatessenCouponService) {
  }

  get f() { return this.form.controls; }


  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['isEdit'] == '1') {
        this.coupon.id = Number(params['id']);
      }
    });

    const code = new FormControl('', Validators.compose([
      Validators.required,
    ]));
        
    const description = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const quantity = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const type = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const general = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const main = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const value = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const minimumValue = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const initialDate = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const finalDate = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const client = new FormControl('');



    this.form = new FormGroup({
      description: description,
      code: code,
      quantity: quantity,
      type: type,
      general: general,
      main: main,
      value: value,
      minimumValue: minimumValue,
      initialDate: initialDate,
      finalDate: finalDate,
      client: client,
    });

    this.lstTypes = [];
    this.lstTypes.push({ value: 'false', label: "Porcentagem" })
    this.lstTypes.push({ value: 'true', label: "Valor" })

    this.authenticationService.getClients().subscribe(result => {
      if (result !== undefined) {
        this.lstClients = result;
        this.load();
      }
    });

    
  }

  load() {
    if (this.coupon.id) {
      this.delicatessenCouponService.getById(this.coupon.id).subscribe(result => {
        this.coupon = result;
        this.loadControls();
      });
    }
  }

  loadControls() {
    this.form.controls.description.setValue(this.coupon.description);
    this.form.controls.code.setValue(this.coupon.code);
    this.form.controls.code.setValue(this.coupon.code);
    this.form.controls.quantity.setValue(this.coupon.quantity);
    this.form.controls.type.setValue(this.coupon.type);
    this.form.controls.value.setValue(this.coupon.value);
    this.form.controls.minimumValue.setValue(this.coupon.minimumValue);
    this.form.controls.main.setValue(this.coupon.main!.toString());
    this.form.controls.general.setValue(this.coupon.general!.toString());
    if (!this.coupon.general) {
      let client = this.lstClients.find(x => x.id === this.coupon.clientId);
      this.form.controls.client.setValue(client.id);
      this.isGeneral = true;
      this.form.controls.client.setValidators([Validators.required]);
    }
    let dtInitial = new Date(this.coupon.initialDate!);
    let ngbDateInitial = new NgbDate(dtInitial.getFullYear(), dtInitial.getMonth() + 1, dtInitial.getDate());
    this.form.controls.initialDate.setValue(ngbDateInitial);

    let dtFinal = new Date(this.coupon.finalDate!);
    let ngbDateFinal = new NgbDate(dtFinal.getFullYear(), dtFinal.getMonth() + 1, dtFinal.getDate());
    this.form.controls.finalDate.setValue(ngbDateFinal);
  }
  onCancel() {
    this.router.navigate([`/partner-area-coupon`]);
  }

  onSave() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.coupon.code = this.form.controls.code.value;
    this.coupon.description = this.form.controls.description.value;
    this.coupon.initialDate = new Date(this.form.controls.initialDate.value.year,
      this.form.controls.initialDate.value.month - 1,
      this.form.controls.initialDate.value.day, 0, 0, 0, 0);
      this.coupon.finalDate = new Date(this.form.controls.finalDate.value.year,
        this.form.controls.finalDate.value.month - 1,
        this.form.controls.finalDate.value.day, 0, 0, 0, 0);
    this.coupon.quantity = this.form.controls.quantity.value;
    this.coupon.type = this.form.controls.type.value === 'false' ? false : true;
    this.coupon.value = this.form.controls.value.value;
    this.coupon.minimumValue = this.form.controls.minimumValue.value;
    this.coupon.main = this.form.controls.main.value === 'false' ? false : true;
    this.coupon.general = this.form.controls.general.value === 'false' ? false : true;

    this.delicatessenCouponService.save(this.coupon).subscribe(result => {
      this.toastr.success('Registro efetuado com sucesso!');
      this.router.navigate(['/partner-area-coupon']);
  });

  }

  handleChange(evt: any) {
    if (evt.target.checked) {
      if (evt.target.id === 'generalYes') {
        this.isGeneral = false;
        this.form.controls.client.clearValidators();
        this.form.controls.client.updateValueAndValidity();
      }
      if (evt.target.id === 'generalNo') {
        this.isGeneral = true;
        this.form.controls.client.setValidators([Validators.required]);
      }
    }
  }


}

