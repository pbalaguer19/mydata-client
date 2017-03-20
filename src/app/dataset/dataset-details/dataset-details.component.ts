import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetService } from '../dataset.service';
import { Dataset } from '../dataset';
import {AuthenticationBasicService} from "../../login-basic/authentication-basic.service";
import {UserService} from "../../user/user.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css'],
  providers: [AuthenticationBasicService, UserService]

})
export class DatasetDetailsComponent implements OnInit {
  public dataset: Dataset = new Dataset();
  public errorMessage: string;
  public isOwner: boolean;

  constructor(private route: ActivatedRoute,
              private datasetService: DatasetService,
              private authenticationService: AuthenticationBasicService,
              private userService: UserService) { }

  ngOnInit() {
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        const uri = `/datasets/${id}`;
        this.datasetService.getDataset(uri).subscribe(
          dataset => {
            this.dataset = dataset;

            if (this.dataset._links != null)
              this.userService.getUser(this.dataset._links.owner).subscribe(result => {
                this.isOwner = this.authenticationService.getCurrentUser().username == result.json().uri.split("/").pop();
              });
          },
          error => this.errorMessage = <any>error.message,
        );
      });
  }

  // isDatasetOwner(): Observable<boolean> {
  //   var username;
  //
  // }
}
