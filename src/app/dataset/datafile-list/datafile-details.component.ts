import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataFileService } from '../datafile/datafile.service';
import { DataFile } from '../datafile/datafile';
import { AuthenticationBasicService } from '../../login-basic/authentication-basic.service';
import { DatasetOwnerService } from '../../user/dataset-owner.service';


@Component({
  selector: 'app-datafile-details',
  templateUrl: './datafile-details.component.html'
})
export class DatafileDetailsComponent implements OnInit {
  public datafile: DataFile = new DataFile();
  public errorMessage: string;
  public isOwner: boolean;
  public ownerName: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private datafileService: DataFileService,
              private authenticationService: AuthenticationBasicService,
              private datasetOwnerService: DatasetOwnerService) { }

  ngOnInit() {
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        const uri = `/dataFiles/${id}`;
        this.datafileService.getDataFile(uri).subscribe(
          datafile => {
            this.datafile = datafile;
            if (this.datafile._links != null) {
              this.datasetOwnerService.getDatasetOwner(this.datafile._links.owner.href).subscribe(
                owner => {
                  this.ownerName = owner.getUserName();
                  this.isOwner = this.authenticationService.getCurrentUser().username === owner.getUserName();
                });
            }
          },
          error => this.errorMessage = <any>error.message,
        );
      });
  }

  onDelete(datafile) {
    this.datafileService.deleteDataFile(datafile).subscribe(
      response => { this.router.navigate(['/dataFiles']); },
      error => this.errorMessage = <any>error.message,
    );
  }

}
