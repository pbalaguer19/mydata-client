import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DatasetService } from '../dataset.service';
import { Dataset } from '../dataset';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.css']
})

export class DatasetsSearchComponent {
  @Input()
  datasets: Dataset[];
  @Output()
  onSearchited: EventEmitter<any> = new EventEmitter();
  private schema: string = null;

  public errorMessage: string;
  constructor(private datasetService: DatasetService,
              private route: ActivatedRoute) {
  }

  performSearch(searchTerm: string): void {
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        if (id != null) { this.schema = `/schemas/${id}`; }
      });
    this.datasetService.getDatasetByDescriptionWords(searchTerm, this.schema).subscribe(
      datasets => {
        // Send to output emitter
        this.onSearchited.emit(datasets);
      },
      error => this.errorMessage = <any>error.message
    );
  }
}

