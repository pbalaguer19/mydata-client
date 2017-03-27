import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockOpenLicenseService } from '../../../../test/mocks/open-license.service';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { Router} from '@angular/router';
import { AppComponent } from '../../../app.component';
import { OpenLicenseFormComponent } from './open-license-form.component';
import { OpenLicenseDetailsComponent } from '../open-license-details/open-license-details.component';
import { OpenLicense } from '../open-license';
import { OpenLicenseService } from '../open-license.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dispatchEvent } from '@angular/platform-browser/testing/browser_util';

describe('OpenLicenseFormComponent', () => {
  let component: OpenLicenseFormComponent;
  let fixture: ComponentFixture<OpenLicenseFormComponent>;

  const response = new OpenLicense({
    'uri': '/openLicenses/1',
    'text': 'License 1',
    '_links': {}
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, OpenLicenseFormComponent, OpenLicenseDetailsComponent ],
      providers: [ { provide: OpenLicenseService, useClass: MockOpenLicenseService } ],
      imports: [ RouterTestingModule.withRoutes([
        { path: 'openLicenses/new', component: OpenLicenseFormComponent },
        { path: 'openLicenses/:id', component: OpenLicenseDetailsComponent }]),
        FormsModule, ReactiveFormsModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  it('should submit new license', async(
    inject([Router, Location, OpenLicenseService], (router, location, service) => {
      TestBed.createComponent(AppComponent);
      service.setResponse(response);

      router.navigate(['/openLicenses/new']).then(() => {
        expect(location.path()).toBe('/openLicenses/new');
        expect(service.getOpenLicense).toHaveBeenCalledTimes(0);

        fixture = TestBed.createComponent(OpenLicenseFormComponent);
        fixture.detectChanges();
        component = fixture.debugElement.componentInstance;
        expect(component.openLicense.text).toBeUndefined();

        const compiled = fixture.debugElement.nativeElement;
        const inputText = compiled.querySelector('#text');
        const form = compiled.querySelector('form');
        const button = compiled.querySelector('button');

        inputText.value = 'License 1';
        dispatchEvent(inputText, 'input');
        fixture.detectChanges();
        expect(button.disabled).toBeFalsy();
        dispatchEvent(form, 'submit');

        expect(component.openLicense.text).toBe('License 1');
        expect(service.addOpenLicense).toHaveBeenCalledTimes(1);
        expect(service.addOpenLicense.calls.mostRecent().object.fakeResponse.title).toBe('License 1');
      });
    })
  ));

  it('should warn if input for text is left empty', async(
    inject([Router, Location, OpenLicenseService], (router, location, service) => {
      TestBed.createComponent(AppComponent);

      router.navigate(['/openLicenses/new']).then(() => {
        expect(location.path()).toBe('/openLicenses/new');
        expect(service.getOpenLicense).toHaveBeenCalledTimes(0);

        fixture = TestBed.createComponent(OpenLicenseFormComponent);
        fixture.detectChanges();
        component = fixture.debugElement.componentInstance;

        const compiled = fixture.debugElement.nativeElement;
        const input = compiled.querySelector('#text');
        const button = compiled.querySelector('button');

        input.value = '';
        dispatchEvent(input, 'input');
        dispatchEvent(input, 'blur');
        fixture.detectChanges();

        expect(component.openLicense.text).toBe('');
        expect(component.titleCtrl.hasError('required')).toBeTruthy();
        expect(component.titleCtrl.touched).toBeTruthy();
        expect(compiled.querySelector('.label-warning').innerHTML.trim()).toBe('A text is required');
        expect(button.disabled).toBeTruthy();
      });
    })
  ));
});