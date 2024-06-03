import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Component({
    selector: 'app-partner-area-delicatessen',
    templateUrl: './partner-area-delicatessen.component.html'
})

export class PartnerAreaDelicatessenComponent implements OnInit {

    constructor( private toastr: ToastrService,
                 private router: Router) {
    }

    ngOnInit() {

}

}

