import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DelicatessenProductService } from '../../_services/delicatessen-product.service';
import { DelicatessenProduct } from '../../_model/delicatessen-product-model';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryService } from 'src/app/_services/category.service';
import { Category } from 'src/app/_model/category-model';

@Component({
  selector: 'app-delicatessen-product-form',
  templateUrl: './delicatessen-product-form.component.html'
})

export class DelicatessenProductFormComponent implements OnInit {
  public currentUser: any;
  form: any;
  public fileToUpload: any;
  uploaded = false;
  public lstCategory: any[] = [];
  public files: any = [];
  logo: any;
  public submitted = false;
  public isPromotion = false;
  public file: any;
  public delicatessenProduct: DelicatessenProduct = new DelicatessenProduct();

  constructor(private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private delicatessenProductService: DelicatessenProductService,
    private categoryService: CategoryService,) {
  }

  ngOnInit() {
    const description = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const category = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const promotion = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const value = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const promotionValue = new FormControl('');
    const code = new FormControl('');
    const detail = new FormControl('');

    this.form = new FormGroup({
      description: description,
      detail: detail,
      category: category,
      promotion: promotion,
      value: value,
      promotionValue: promotionValue,
      code: code
    });

      this.route.params.subscribe(params => {
        if (params['isEdit'] == '1') {
          this.delicatessenProduct.id = Number(params['id']);
        }
      });
    this.load();
    this.loadForm();
  }

  loadForm() {
    if (this.delicatessenProduct.id !== undefined) {
      this.delicatessenProductService.getById(this.delicatessenProduct.id).subscribe(delicatessenProduct => {
        if (delicatessenProduct !== undefined) {
          this.delicatessenProduct = delicatessenProduct;
          this.loadObject(delicatessenProduct);
        }
      });
    }
  }

  load() {
    const filter: Category = new Category();
      this.categoryService.getActive(filter).subscribe(result => {
      this.lstCategory = result;
    });
  }

  get f() { return this.form.controls; }

  loadObject(item: any) {
    this.delicatessenProduct = item;
    this.form.controls.description.setValue(item.description);
    this.form.controls.value.setValue(item.value);
    this.form.controls.code.setValue(item.code);
    this.form.controls.category.setValue(item.categoryId);
    this.form.controls.detail.setValue(item.detail);
    this.form.controls.promotion.setValue(item.promotion.toString());
    if (item.promotion) {
      this.isPromotion = true;
      this.form.controls.promotionValue.setValue(item.promotionValue);
    }
    this.logo = environment.urlImagesDelicatessenProduct + item.imageName;
  }

  onCancel() {
    this.router.navigate([`/delicatessen-product`]);
  }

  onSave() {
    if (this.delicatessenProduct.id === undefined) {
      if(this.files.length == 0) {
        this.toastr.error('Obrigatório selecionar uma foto para o produto!')
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
    this.delicatessenProduct.description = this.form.controls.description.value;
    this.delicatessenProduct.categoryId = Number(this.form.controls.category.value);
    this.delicatessenProduct.detail = this.form.controls.detail.value;
    this.delicatessenProduct.promotion = this.form.controls.promotion.value === 'false' ? false : true;
    this.delicatessenProduct.value = this.form.controls.value.value;
    this.delicatessenProduct.code = this.form.controls.code.value;

    if (this.delicatessenProduct.promotion) {
      this.delicatessenProduct.promotionValue = this.form.controls.promotionValue.value;
    }

    formData.append('delicatessenProduct', JSON.stringify(this.delicatessenProduct));

    this.delicatessenProductService.save(formData).subscribe(result => {
      this.toastr.success('Registro efetuado com sucesso!');
      return this.router.navigate(['delicatessen-product']);
    });
  }

  handleChange(evt: any) {
    if (evt.target.checked) {
      if (evt.target.id === 'promotionYes') {
        this.isPromotion = true;
        this.form.controls.promotionValue.setValidators([Validators.required, Validators.minLength(1)]);
      }
      if (evt.target.id === 'promotionNo') {
        this.isPromotion = false;
        this.form.controls.promotionValue.clearValidators();
        this.form.controls.promotionValue.updateValueAndValidity();
      }
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      for (const file of event.target.files) {
        this.files.push({ file });
      }
    }
  }

  getImage(imageName: string) {
    return environment.urlImagesDelicatessenProduct + imageName;
  }  

}

