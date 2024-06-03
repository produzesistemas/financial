import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(    private navCtrl: NavController,
    private authenticationService: AuthService,
    private router: Router) {}

  onMenu(nav: Number) {
    switch (nav) {
      case 1:
        this.navCtrl.navigateForward(["about"]);
        break;
      case 2:
        this.authenticationService.clearCurrentUser();
        this.router.navigate(['/login-page'])
        break;
  
    }
   
  }
}


