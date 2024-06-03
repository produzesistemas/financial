import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/_model/category-model';
import { CategoryService } from 'src/app/_services/category.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  form: any;
  submitted = false;
  public category: Category = new Category();
  public files: any = [];
  logo: any;
  public file: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['isEdit'] == '1') {
        this.category.id = Number(params['id']);
      }
    });

    const description = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const id = new FormControl(0);


    this.form = new FormGroup({
      description: description,
      id: id,

    });
this.load();
    }

    load() {
      if (this.category.id) {
        this.categoryService.getById(this.category.id).subscribe(result => {
          this.category = result;
          this.loadControls();
        });
      }
    }

    onSave() {
      if (this.category.id === undefined) {
        if(this.files.length == 0) {
          this.toastr.error('Obrigatório selecionar uma foto para a categoria!')
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

      this.category.description = this.form.controls.description.value;
      formData.append('category', JSON.stringify(this.category));
      this.categoryService.save(formData).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        this.router.navigate(['/category']);
    });
    }

    onCancel() {
      this.router.navigate([`/category`]);
    }

    loadControls() {
      this.form.controls.description.setValue(this.category.description);
      this.logo = environment.urlImagesCategory + this.category.imageName;
    }

    onFileChange(event: any) {
      if (event.target.files.length > 0) {
        for (const file of event.target.files) {
          this.files.push({ file });
        }
      }
    }
  


}

