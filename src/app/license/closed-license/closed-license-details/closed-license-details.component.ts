import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClosedLicenseService } from '../closed-license.service';
import { ClosedLicense } from '../closed-license';
import { ClosedLicenseOwnerService } from '../../../user/closed-license-owner.service';
import { AuthenticationBasicService } from '../../../login-basic/authentication-basic.service';

@Component({
  selector: 'app-closed-license-details',
  templateUrl: './closed-license-details.component.html',
  styleUrls: ['./closed-license-details.component.css']
})
export class ClosedLicenseDetailsComponent implements OnInit {
  public closedLicense: ClosedLicense = new ClosedLicense();
  public errorMessage: string;
  public isOwner: boolean;

  constructor(private route: ActivatedRoute,
              private closedLicenseService: ClosedLicenseService,
              private authenticationService: AuthenticationBasicService,
              private closedLicenseOwnerService: ClosedLicenseOwnerService) { }

  ngOnInit() {
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        const uri = `/closedLicenses/${id}`;
        this.closedLicenseService.getClosedLicense(uri).subscribe(
          closedLicense => { this.closedLicense = closedLicense;
          if (this.closedLicense._links != null) {
              this.closedLicenseOwnerService.getClosedLicenseOwner(this.closedLicense._links.owner.href).subscribe(
                owner => {
                  this.isOwner = this.authenticationService.getCurrentUser().username === owner.getUserName();
              });
            }
          },
          error => this.errorMessage = <any>error.message
        );
      });
  }
}
