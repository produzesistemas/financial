import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Category } from 'src/app/_model/category-model';
import { CategoryService } from 'src/app/_services/category.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})

export class CategoryComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  form: any;
  loading = false;
  submitted = false;
  public lst: any[] = [];
  category: any;
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
    private router: Router) {
  }

  ngOnInit() {
    const description = new FormControl('');

    this.form = new FormGroup({
      description: description,
    });
    // this.onSubmit();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    const filter: Category = new Category();
    filter.description = this.form.controls.description.value;
    this.categoryService.getByFilter(filter).subscribe(
      data => {
        this.lst = data;
      }
    );
  }

  getImage(imageName: string) {
    return environment.urlImagesCategory + imageName;
}

  onNew() {
    this.router.navigate([`/category/0/0`]);
  }

  edit(obj: Category) {
    this.router.navigate([`/category/${obj.id}/1`]);
  }

  deleteById(template: TemplateRef<any>, item: Category) {
    this.category = item;
    this.modalDelete = this.modalService.show(template, { class: 'modal-md' });
  }

  confirmDelete() {
    this.categoryService.deleteById(this.category).subscribe(() => {
      const index: number = this.lst.indexOf(this.category);
      if (index !== -1) {
        this.lst.splice(index, 1);
      }
      this.closeDelete();
      this.toastr.success('Excluído com sucesso!', '');
    });
  }

  onActive(item: any) {
    this.categoryService.active(item).subscribe(result => {
      this.onSubmit();
    });
  }
  
  closeDelete() {
  this.modalDelete.hide();
  }
}
