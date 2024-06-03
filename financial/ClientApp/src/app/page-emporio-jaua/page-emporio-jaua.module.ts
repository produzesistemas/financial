import { NgModule } from '@angular/core';
import { PageEmporioJauaRoutingModule} from './page-emporio-jaua-routing.module';
import { CommonModule } from '@angular/common';
import { PageEmporioJauaComponent } from './page-emporio-jaua.component';

@NgModule({
    imports: [
        CommonModule,
        PageEmporioJauaRoutingModule,
      ],
    declarations: [ PageEmporioJauaComponent],
    exports: [ PageEmporioJauaComponent]
})
export class PageEmporioJauaModule { }