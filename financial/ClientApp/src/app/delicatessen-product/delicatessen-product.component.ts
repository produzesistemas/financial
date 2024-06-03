import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DelicatessenProduct } from 'src/app/_model/delicatessen-product-model';
import { DelicatessenProductService } from 'src/app/_services/delicatessen-product.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../_services/category.service';
import { Category } from '../_model/category-model';

@Component({
  selector: 'app-delicatessen-product',
  templateUrl: './delicatessen-product.component.html'
})

export class DelicatessenProductComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public isActive = false;
  public lstCategory: any[] = [];
  public lst: any[] = [];
  product: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 10;
  delicatessenProduct: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private delicatessenProductService: DelicatessenProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const description = new FormControl('');
    const category = new FormControl('');
    this.form = new FormGroup({
      description: description,
      category: category
    });
    this.getAllCategory()
  }
  get f() { return this.form.controls; }
  getImage(imageName: string) {
    return environment.urlImagesDelicatessenProduct + imageName;
}

  onSubmit() {
    const filter: DelicatessenProduct = new DelicatessenProduct();
    if (this.form.controls.description.value) {
      filter.description = this.form.controls.description.value;
    }
    if (this.form.controls.category.value) {
       filter.categoryId = Number(this.form.controls.category.value);
    }
    this.delicatessenProductService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  onReset() {
    this.form.controls.description.reset();
    this.form.controls.category.reset();
  }
  

  getAllCategory() {
    let category = new Category();
    category.description = "";
    this.categoryService.getByFilter(category).subscribe(
      data => {
        this.lstCategory = data;
      }
    );
  }

  onNew() {
    this.router.navigate([`/delicatessen-product/0/0`]);
  }

  edit(obj: DelicatessenProduct) {
    this.router.navigate([`/delicatessen-product/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: DelicatessenProduct) {
    this.delicatessenProduct = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.delicatessenProductService.deleteById(this.delicatessenProduct).subscribe(() => {
      const index: number = this.lst.indexOf(this.delicatessenProduct);
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

  onActive(item: any) {
    this.delicatessenProductService.active(item).subscribe(result => {
      this.onSubmit();
    });
  }
  
}
