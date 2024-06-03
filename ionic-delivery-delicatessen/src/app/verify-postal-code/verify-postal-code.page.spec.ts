import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyPostalCodePage } from './verify-postal-code.page';

describe('VerifyPostalCode', () => {
  let component: VerifyPostalCodePage;
  let fixture: ComponentFixture<VerifyPostalCodePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyPostalCodePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyPostalCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
