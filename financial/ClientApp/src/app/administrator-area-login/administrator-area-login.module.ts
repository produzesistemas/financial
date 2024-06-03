import { NgModule } from '@angular/core';
import { AdministratorAreaLoginComponent } from './administrator-area-login.component';
import { AdministratorAreaLoginRoutingModule} from './administrator-area-login-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        AdministratorAreaLoginRoutingModule,
        FormsModule, ReactiveFormsModule,
      ],
    declarations: [
        AdministratorAreaLoginComponent    ],
    exports: [ AdministratorAreaLoginComponent ]
})
export class AdministratorAreaLoginModule { }
