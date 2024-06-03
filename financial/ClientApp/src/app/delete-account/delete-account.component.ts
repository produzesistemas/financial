import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { FilterDefaultModel } from '../_model/filter-default-model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Establishment } from '../_model/establishment-model';
import { EstablishmentService } from '../_services/establishment.service';

@Component({
    selector: 'app-delete-account',
    templateUrl: './delete-account.component.html'
})

export class DeleteAccountComponent implements OnInit {
    form: any;
    submitted = false;
    constructor(private toastr: ToastrService,
        private establishmentService: EstablishmentService) {
    }
    get f() { return this.form.controls; }
    ngOnInit() {

        const name = new FormControl('', Validators.compose([
            Validators.required,
          ]));
          const email = new FormControl('', Validators.compose([
            Validators.required,
          ]));
          const message = new FormControl('', Validators.compose([
            Validators.required,
          ]));
          this.form = new FormGroup({
            name: name,
            email: email,
            message: message,
          });
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
          return;
        }
        let msg: any = {};
        msg.name = this.form.controls.name.value;
        msg.email = this.form.controls.email.value;
        msg.message = this.form.controls.message.value;
        this.establishmentService.sendMessage(msg).subscribe(result => {
                this.toastr.success("Mensagem enviada com sucesso!")
                this.form.controls.name.reset();
                this.form.controls.email.reset();
                this.form.controls.message.reset();
        })
      }

}

