import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingCartPage } from './shopping-cart.page';

describe('ShoppingCart', () => {
  let component: ShoppingCartPage;
  let fixture: ComponentFixture<ShoppingCartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
