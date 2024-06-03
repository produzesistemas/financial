import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { BrandService } from '../_services/brand.service';
import { EstablishmentBrandCredit } from '../_model/establishment-brand-credit-model';
import { EstablishmentBrandCreditService } from '../_services/establishment-brand-credit.service';
import { EstablishmentBrandDebitService } from '../_services/establishment-brand-debit.service';
import { EstablishmentBrandDebit } from '../_model/establishment-brand-debit-model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-establishment-brand',
  templateUrl: './establishment-brand.component.html'
})

export class EstablishmentBrandComponent implements OnInit {
  public modalRef: BsModalRef = new BsModalRef();
  public modalDelete: BsModalRef = new BsModalRef();
  loading = false;
  submitted = false;
  public lstCreditCard: EstablishmentBrandCredit[] = [];
  public lstDebitCard: EstablishmentBrandDebit[] = [];
  public establishmentBrandsCredit: EstablishmentBrandCredit[] = [];
  public establishmentBrandsDebit: EstablishmentBrandDebit[] = [];
  @Output() action = new EventEmitter();
  page = 1;
  pageSize = 5;
  @ViewChild('selectAllCredit') private selectAllCredit: any;
  @ViewChild('selectAllDebit') private selectAllDebit: any;

  constructor(
    private toastr: ToastrService,
    private brandService: BrandService,
    private establishmentBrandCreditService: EstablishmentBrandCreditService,
    private establishmentBrandDebitService: EstablishmentBrandDebitService) {
  }

  ngOnInit() {
this.onSubmit();
  }

  onSubmit() {
    forkJoin(
      this.establishmentBrandCreditService.getCredit(),
      this.establishmentBrandDebitService.getDebit(),
      this.brandService.getAllBrand()
    ).subscribe(result => {
      this.lstCreditCard = [];
      this.lstDebitCard = [];
      if (result[2].length > 0) {
        result[2].forEach(brand => {
          let establishmentBrandsCredit = new EstablishmentBrandCredit();
          establishmentBrandsCredit.brandId = brand.id;
          establishmentBrandsCredit.brand = brand;
          let findCredit = result[0].find(x => x.brandId === brand.id);
          if (findCredit) {
            if (findCredit.active) {
              establishmentBrandsCredit.isSelected = true;
            } 
            establishmentBrandsCredit.id = findCredit.id;
          }
          this.lstCreditCard.push(establishmentBrandsCredit);

          let establishmentBrandsDebit = new EstablishmentBrandDebit();
          establishmentBrandsDebit.brandId = brand.id;
          establishmentBrandsDebit.brand = brand;
          let findDebit = result[1].find(x => x.brandId === brand.id);
          if (findDebit) {
            if (findDebit.active) {
            establishmentBrandsDebit.isSelected = true;
            } 
            establishmentBrandsDebit.id = findDebit.id;
          }
          this.lstDebitCard.push(establishmentBrandsDebit);
        });
      }
  });
  }

  onSaveCredit(item: EstablishmentBrandCredit) {
    item.brand = undefined;
        this.establishmentBrandCreditService.saveCredit(item).subscribe(result => {
          this.toastr.success('Registro efetuado com sucesso!');
          this.onSubmit();
      });    
}

  onSaveDebit(item: EstablishmentBrandDebit) {
    item.brand = undefined;
      this.establishmentBrandDebitService.saveDebit(item).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        this.onSubmit();
    });  
}

  getImage(imageName: string) {
    return environment.urlImagesBrand + imageName;
}

}
