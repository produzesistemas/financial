import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-privacy-policy-emporio-jaua',
    templateUrl: './privacy-policy-emporio-jaua.component.html'
})

export class PrivacyPolicyEmporioJauaComponent implements OnInit {
    constructor(private _location: Location,
      private router: Router,) {
    }

    ngOnInit() {

  }

  onBack() {
    this._location.back();
  }
  

}

