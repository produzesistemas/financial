import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EstablishmentService } from '../../_services/establishment.service';
import { Establishment } from '../../_model/establishment-model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administrator-area-establishment-form',
  templateUrl: './administrator-area-establishment-form.component.html'
})

export class AdministratorAreaEstablishmentFormComponent implements OnInit {
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
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private establishmentService: EstablishmentService,
    private authenticationService: AuthenticationService,) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['isEdit'] == '1') {
        this.establishment.id = Number(params['id']);
      }
    });

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
      const module = new FormControl('', Validators.compose([
        Validators.required,
      ]));
      const contactName = new FormControl('', Validators.compose([
        Validators.required,
      ]));

      const email = new FormControl('', Validators.compose([
        Validators.required,
      ]));
  
      this.form = new FormGroup({
        name: name,
        address: address,
        contactName: contactName,
        email: email,
        description: description,
        postalCode: postalCode,
        module: module,
        phone: phone,
        cnpj: cnpj,
      });
      this.authenticationService.getModules().subscribe(result => {
        this.modules = result;
        if (this.establishment.id) {
          this.loadForm();
        }
      })        

    
  }

  loadForm() {
    if (this.establishment.id) {
      this.establishmentService.getById(this.establishment.id).subscribe(establishment => {
        if (establishment !== undefined) {
          this.establishment = establishment;
          this.loadObject(establishment);
        }
      });
    }
  }


  get f() { return this.form.controls; }

  loadObject(item: Establishment) {
    this.establishment = item;
    this.form.controls.name.setValue(item.name);
    this.form.controls.description.setValue(item.description);
    this.form.controls.address.setValue(item.address);
    this.form.controls.postalCode.setValue(item.postalCode);
    this.form.controls.phone.setValue(item.phone);
    this.form.controls.cnpj.setValue(item.cnpj);
    this.form.controls.contactName.setValue(item.contactName);
    this.form.controls.email.setValue(item.email);
    this.form.controls.module.setValue(item.moduleId);
    this.logo = environment.urlImagesEstablishment + item.imageName;
  }


  onCancel() {
    return this.router.navigate([`/administrator-area-establishment`]);
  }

  onSave() {
    if (this.establishment.id === undefined) {
      if(this.files.length == 0) {
        this.toastr.error('é obrigatório selecionar uma logomarca')
        return;
      }
    }
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
  this.establishment.email = this.form.controls.email.value;
  this.establishment.description = this.form.controls.description.value;
  this.establishment.address = (this.form.controls.address.value);
  this.establishment.postalCode = this.form.controls.postalCode.value;
  this.establishment.phone = (this.form.controls.phone.value);
  this.establishment.cnpj = (this.form.controls.cnpj.value);
  this.establishment.moduleId = Number(this.form.controls.module.value);

  formData.append('establishment', JSON.stringify(this.establishment));

    this.establishmentService.registerPartnerByAdm(formData).subscribe(result => {
      this.toastr.success('Registro efetuado com sucesso!');
      return this.router.navigate(['administrator-area-establishment']);
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
  
  
}

