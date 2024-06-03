import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(
        private navCtrl: NavController,
        public toastController: ToastController,
        private authenticationService: AuthService
        ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            finalize(() => {

            }),
            catchError(err => {

                const msgDefault = 'Falha na conexão, tente novamente.';

                if (err.status === 401) {
                    this.presentToast("Atenção! Acesso negado! Efetue novamente o login");
                    this.authenticationService.clearCurrentUser();
                    this.navCtrl.navigateForward(["login-page"]);
                }

                if (err.status === 400) {
                    this.presentToast(err.error);
                }

                if (err.status === 500) {
                    this.presentToast("Atenção! Aplicativo fora do ar! Informe a loja");
                }

                if (err.status === 403) {
                    this.presentToast("Atenção! Acesso negado! Efetue novamente o login");
                    this.authenticationService.clearCurrentUser();
                    this.navCtrl.navigateForward(["login-page"]);
                }

                return throwError(err);
            }
            ));
    }

    async presentToast(error: any){
        const toast = await this.toastController.create({
          message: error,
          duration: 2000,
          position: 'middle'
        });
    
        toast.present();
      }


}