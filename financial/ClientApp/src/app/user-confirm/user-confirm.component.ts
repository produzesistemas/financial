import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginUser } from '../_model/login-user-model';

@Component({
    selector: 'app-user-client',
    templateUrl: 'user-confirm.component.html'
})
export class UserConfirmComponent implements OnInit {
    public hasResult: boolean = false;
    public msg: string | undefined;
    public classAlert: string | undefined;

    constructor(
        private route: ActivatedRoute,
        public authService: AuthenticationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['code'] == undefined || params['userid'] == undefined) {
                this.hasResult = false;
                this.msg = "Acesso inválido.";
                this.classAlert = "alert-danger";
            } else {
                let loginUser = new LoginUser();
                loginUser.code = params['code'];
                loginUser.applicationUserId = params['userid'];

                this.authService.userConfirm(loginUser).subscribe(result => {
                    this.hasResult = true;
                    this.msg = "Usuário confirmado com sucesso. Faça login no site!";
                    this.classAlert = "alert-success";
                }, err => {
                    this.hasResult = true;
                    this.msg = (err && err.error && err.error.msg) ? err.error.msg : 'Usuário não confirmado.', 'Atenção!';
                    this.classAlert = "alert-danger";
                });
            }
        });
    }
}
