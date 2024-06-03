import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DeliveryRegion } from 'src/app/_model/delivery-region-model';
import { DeliveryRegionService } from 'src/app/_services/delivery-region.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery-region-form',
  templateUrl: './delivery-region-form.component.html'
})
export class DeliveryRegionFormComponent implements OnInit {
  form: any;
  submitted = false;
  public deliveryRegion: DeliveryRegion = new DeliveryRegion();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private deliveryRegionService: DeliveryRegionService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['isEdit'] == '1') {
        this.deliveryRegion.id = Number(params['id']);
      }
    });

    const postalCode = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    const value = new FormControl('');

    const establishmentId = new FormControl(0);


    this.form = new FormGroup({
      postalCode: postalCode,
      establishmentId: establishmentId,
      value: value,
    });
 this.load();
    }

    load() {
      if (this.deliveryRegion.id) {
        this.deliveryRegionService.getById(this.deliveryRegion.id).subscribe(result => {
          this.deliveryRegion = result;
          this.loadControls();
        });
      }
    }

    onSave() {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      this.deliveryRegion.value = this.form.controls.value.value;
      this.deliveryRegion.postalCode = this.form.controls.postalCode.value;
      this.deliveryRegionService.save(this.deliveryRegion).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        this.router.navigate(['/delivery-region']);
    });
    }

    onCancel() {
      this.router.navigate([`/delivery-region`]);
    }

    loadControls() {
      this.form.controls.postalCode.setValue(this.deliveryRegion.postalCode);
      this.form.controls.value.setValue(this.deliveryRegion.value);
    }

}

