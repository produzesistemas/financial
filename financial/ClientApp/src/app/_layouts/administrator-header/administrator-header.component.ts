import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administrator-header',
  templateUrl: './administrator-header.component.html'
})
export class AdministratorHeaderComponent implements OnInit {
  public currentUser: any;
  public loja: any;
  logo: any;
  constructor(  private authenticationService: AuthenticationService,
                private router: Router,
                private toastr: ToastrService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.getCurrentUser();
    if (!this.currentUser) {
      this.logout();
    }

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['index']);
  }

  changePassword() {
    this.router.navigate(['/administrator-area-change-password']);
  }  
}
