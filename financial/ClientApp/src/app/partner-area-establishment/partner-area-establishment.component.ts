import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from 'src/environments/environment';
import { Establishment } from '../_model/establishment-model';
import { EstablishmentService } from '../_services/establishment.service';

@Component({
  selector: 'app-partner-area-establishment',
  templateUrl: './partner-area-establishment.component.html'
})

export class PartnerAreaEstablishmentComponent implements OnInit {
  public currentUser: any;
  form: any;
  public files: any = [];
  public fileToUpload: any;
  modules: any[] = [];
  logo: any;
  public submitted = false;
  public establishment: Establishment = new Establishment();

  constructor(private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private establishmentService: EstablishmentService,
    private authenticationService: AuthenticationService,) {
  }

  ngOnInit() {
    const name = new FormControl('', Validators.compose([
        Validators.required,
      ]));
  
      const address = new FormControl('', Validators.compose([
        Validators.required,
      ]));
    
      const description = new FormControl('', Validators.compose([
        Validators.required,
      ]));
  
      const postalCode = new FormControl('', Validators.compose([
        Validators.required,
      ]));
  
      const phone = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const cnpj = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const contactName = new FormControl('', Validators.compose([
        Validators.required,
      ]));

      const paymentOnLine = new FormControl('false', Validators.compose([
        Validators.required,
      ]));
      const paymentLittleMachine = new FormControl('false', Validators.compose([
        Validators.required,
      ]));
      const paymentMoney = new FormControl('false', Validators.compose([
        Validators.required,
      ]));
      const delivery = new FormControl('false', Validators.compose([
        Validators.required,
      ]));
      const instorePickup = new FormControl('false', Validators.compose([
        Validators.required,
      ]));
      const minimumValue = new FormControl('');
      this.form = new FormGroup({
        name: name,
        address: address,
        contactName: contactName,
        description: description,
        postalCode: postalCode,
        phone: phone,
        cnpj: cnpj,
        paymentOnLine: paymentOnLine,
        paymentLittleMachine: paymentLittleMachine,
        paymentMoney: paymentMoney,
        delivery: delivery,
        instorePickup: instorePickup,
        minimumValue: minimumValue
      });
      this.establishmentService.getByOwner().subscribe(result => {
        if (result) {
          this.establishment = result;
          this.loadObject(this.establishment);
        }
      })        
  }

  get f() { return this.form.controls; }

  loadObject(item: Establishment) {
    this.establishment = item;
    this.form.controls.name.setValue(item.name);
    this.form.controls.description.setValue(item.description);
    this.form.controls.address.setValue(item.address);
    this.form.controls.minimumValue.setValue(item.minimumValue);
    this.form.controls.postalCode.setValue(item.postalCode);
    this.form.controls.phone.setValue(item.phone);
    this.form.controls.cnpj.setValue(item.cnpj);
    this.form.controls.contactName.setValue(item.contactName);
    if (item.imageName !== "") {
      this.logo = environment.urlImagesEstablishment + item.imageName;
    }
    
    if (item.instorePickup !== null) {
      this.form.controls.instorePickup.setValue(item.instorePickup!.toString());
    }
    if (item.delivery !== null) {
      this.form.controls.delivery.setValue(item.delivery!.toString());
    }
    if (item.paymentMoney !== null) {
      this.form.controls.paymentMoney.setValue(item.paymentMoney!.toString());
    }
    if (item.paymentLittleMachine !== null) {
      this.form.controls.paymentLittleMachine.setValue(item.paymentLittleMachine!.toString());
    }
    if (item.paymentOnLine !== null) {
      this.form.controls.paymentOnLine.setValue(item.paymentOnLine!.toString());
    }
  }

  onSave() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    if (this.files.length > 0) {
      this.files.forEach((f: { file: Blob; }) => {
        formData.append('file', f.file);
      });
    }
  
  this.establishment.name = this.form.controls.name.value;
  this.establishment.contactName = this.form.controls.contactName.value;
  this.establishment.description = this.form.controls.description.value;
  this.establishment.minimumValue = this.form.controls.minimumValue.value;
  this.establishment.address = (this.form.controls.address.value);
  this.establishment.postalCode = this.form.controls.postalCode.value;
  this.establishment.phone = (this.form.controls.phone.value);
  this.establishment.cnpj = (this.form.controls.cnpj.value);
  this.establishment.instorePickup = this.form.controls.instorePickup.value === 'false' ? false : true;
  this.establishment.delivery = this.form.controls.delivery.value === 'false' ? false : true;
  this.establishment.paymentLittleMachine = this.form.controls.paymentLittleMachine.value === 'false' ? false : true;
  this.establishment.paymentMoney = this.form.controls.paymentMoney.value === 'false' ? false : true;
  this.establishment.paymentOnLine = this.form.controls.paymentOnLine.value === 'false' ? false : true;

  formData.append('establishment', JSON.stringify(this.establishment));

    this.establishmentService.update(formData).subscribe(result => {
      this.toastr.success('Registro efetuado com sucesso!');
      return this.router.navigate(['partner-area-delivery']);
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      for (const file of event.target.files) {
        this.files.push({ file });
      }
    }
  }
  
  onResetFileChange() {
    this.fileToUpload.nativeElement.value = '';
  }
  
  deleteImage(establishment: Establishment) {
    this.establishmentService.deleteImage(establishment).subscribe(() => {
      this.logo = undefined;
      this.toastr.success('Excluído com sucesso!', '');
    });
  }
}

