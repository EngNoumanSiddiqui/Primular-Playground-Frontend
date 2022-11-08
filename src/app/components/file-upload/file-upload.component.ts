import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFormField } from '../../models/form.model';
import { AlertService } from 'src/app/services/alert.service';
import { RequestService } from 'src/app/services/request.service';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() acceptFileTypes: any;
  @Input() allowMultiple: boolean = false;
  @Input() fields: IFormField;
  @Output() fileUrl: EventEmitter<any> = new EventEmitter();

  constructor(
    private requestService: RequestService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {}

  uploadFile(files) {
    let fileData = new FormData();
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        fileData.append(files[i].name, files[i]);
      }
    }

    if (fileData) {
      this.requestService.get<any[], any>('/Upload', fileData).subscribe(
        (data: any) => {
          if (data) {
            this.alertService.success('File Upload Successfully.');
            if (this.fields?.onReturn) {
              this.fields.onReturn(data.results);
            }
            this.getAllFiles();
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
          if (this.fields.onReturn) {
            this.fields.onReturn(error);
          }
        }
      );
    }
  }

  getAllFiles() {
    this.requestService
      .get('/Data/Fetch', { uniqueKey: 'GetAllFromAzureUpload' })
      .subscribe((data) => {
        console.log('response:', data.records);
        this.fileUrl.emit(data.records);
      });
  }
}
