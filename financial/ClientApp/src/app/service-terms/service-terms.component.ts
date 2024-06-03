import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
    selector: 'app-service-terms',
    templateUrl: './service-terms.component.html'
})

export class ServiceTermsComponent implements OnInit {

    constructor(private _location: Location) {
    }

    ngOnInit() {
  }

  onBack() {
    this._location.back();
  }
  

}

