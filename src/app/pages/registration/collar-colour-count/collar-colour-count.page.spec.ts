import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CollarColourCountPage } from './collar-colour-count.page';

describe('CollarColourCountPage', () => {
  let component: CollarColourCountPage;
  let fixture: ComponentFixture<CollarColourCountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollarColourCountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CollarColourCountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
