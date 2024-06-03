import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html'
})

export class PrivacyPolicyComponent implements OnInit {
    constructor(private _location: Location,
      private router: Router,) {
    }

    ngOnInit() {

  }

  onBack() {
    this._location.back();
  }
  

}

