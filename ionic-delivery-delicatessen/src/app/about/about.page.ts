import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  public version: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    ) { }

  ngOnInit() {
    // this.title = "Home";
    this.version = environment.version;
    
  }

}
