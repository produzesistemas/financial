import { Supplier } from './../../_model/supplier-model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierService } from 'src/app/_services/supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html'
})
export class SupplierFormComponent implements OnInit {
  form: any;
  submitted = false;
  public supplier: Supplier = new Supplier();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private supplierService: SupplierService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {

    const name = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const cnpj = new FormControl('');

    const email = new FormControl('');

    const contact = new FormControl('');

    const createdBy = new FormControl('');
    
    const changedBy = new FormControl('');

    const createDate = new FormControl('');

    const updateDate = new FormControl('');

    const phone = new FormControl('');

    const id = new FormControl(0);


    this.form = new FormGroup({
      name: name,
      cnpj: cnpj,
      email: email,
      contact: contact,
      phone: phone,
      createdBy: createdBy,
      changedBy: changedBy,
      createDate: createDate,
      updateDate: updateDate,
      id: id,

    });

      this.route.params.subscribe(params => {
        if (params['isEdit'] == '1') {
          this.supplier.id = Number(params['id']);
        }
      });
  
    }

    load() {
      if (this.supplier.id) {
        this.supplierService.getSupplier(this.supplier.id).subscribe(result => {
          this.supplier = result;
          this.loadControls();
        });
      }
    }

    onSave() {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      const supplier = new Supplier(this.form.value);
      supplier.createDate = new Date();
      this.supplierService.save(supplier).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        this.router.navigate(['/supplier']);
    });
    }

    onCancel() {
      this.router.navigate([`/supplier`]);
    }

    loadControls() {
      this.form.controls.name.setValue(this.supplier.name);
      this.form.controls.cnpj.setValue(this.supplier.cnpj);
      this.form.controls.contact.setValue(this.supplier.contact);
      this.form.controls.phone.setValue(this.supplier.phone);
      this.form.controls.email.setValue(this.supplier.email);
      this.form.controls.id.setValue(this.supplier.id);
      this.form.controls.createdBy.setValue(this.supplier.createdBy);
      this.form.controls.changedBy.setValue(this.supplier.changedBy);
    }

    getDateCreate() {
      return this.supplier.createDate;
    }

    getDateChange() {
            return this.supplier.updateDate;
      }

}

