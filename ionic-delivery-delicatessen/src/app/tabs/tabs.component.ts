import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss']
})
export class TabsComponent { 

  constructor(
    private navCtrl: NavController,
  ) {}

  goShoppingCart() {
    this.navCtrl.navigateForward(["shopping-cart"]);
  }

}