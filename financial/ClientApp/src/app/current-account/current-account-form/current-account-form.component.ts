import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentAccount } from 'src/app/_model/current-account-model';
import { CurrentAccountService } from 'src/app/_services/current-account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-current-account-form',
  templateUrl: './current-account-form.component.html'
})
export class CurrentAccountFormComponent implements OnInit {
  form: any;
  submitted = false;
  public currentAccount: CurrentAccount = new CurrentAccount();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private currentAccountService: CurrentAccountService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {

    const bank = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const agency = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const account = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const bankNumber = new FormControl('', Validators.compose([
      Validators.required,
    ]));

    const openingBalance = new FormControl('', Validators.compose([
      Validators.required,
    ]));
    
    const createdBy = new FormControl('');

    const changedBy = new FormControl('');

    const createDate = new FormControl('');

    const updateDate = new FormControl('');

    const id = new FormControl(0);


    this.form = new FormGroup({
      bank: bank,
      agency: agency,
      account: account,
      bankNumber: bankNumber,
      openingBalance: openingBalance,
      createdBy: createdBy,
      changedBy: changedBy,
      createDate: createDate,
      updateDate: updateDate,
      id: id,

    });

      this.route.params.subscribe(params => {
        if (params['isEdit'] == '1') {
          this.currentAccount.id = Number(params['id']);
        }
      });
    }

    load() {
      if (this.currentAccount.id) {
        this.currentAccountService.getCurrentAccount(this.currentAccount.id).subscribe(result => {
          this.currentAccount = result;
          this.loadControls();
        });
      }
    }

    onSave() {
      this.submitted = true;
      if (this.form.invalid) {
        return;
      }
      const account = new CurrentAccount(this.form.value);
      account.createDate = new Date();
      this.currentAccountService.save(account).subscribe(result => {
        this.toastr.success('Registro efetuado com sucesso!');
        this.router.navigate(['/current-account']);
    });
    }

    onCancel() {
      this.router.navigate([`/current-account`]);
    }

    loadControls() {
      this.form.controls.agency.setValue(this.currentAccount.agency);
      this.form.controls.bank.setValue(this.currentAccount.bank);
      this.form.controls.account.setValue(this.currentAccount.account);
      this.form.controls.bankNumber.setValue(this.currentAccount.bankNumber);
      this.form.controls.openingBalance.setValue(this.currentAccount.openingBalance);
      this.form.controls.id.setValue(this.currentAccount.id);
      this.form.controls.createdBy.setValue(this.currentAccount.createdBy);
      this.form.controls.changedBy.setValue(this.currentAccount.changedBy);
    }

    getDateCreate() {
      return this.currentAccount.createDate;
    }

    getDateChange() {
      return this.currentAccount.updateDate;
}

}

