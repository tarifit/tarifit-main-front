import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiKitShowcase } from './ui-kit-showcase';

describe('UiKitShowcase', () => {
  let component: UiKitShowcase;
  let fixture: ComponentFixture<UiKitShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiKitShowcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiKitShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
