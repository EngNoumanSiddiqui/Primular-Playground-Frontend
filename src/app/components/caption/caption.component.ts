import {
  Component,
  EventEmitter,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EValidator, IDynamicForm } from 'src/app/models';
import { AlertService } from 'src/app/services/alert.service';
import { FormService } from 'src/app/services/form.service';
import { RequestService } from 'src/app/services/request.service';
import * as utilities from '../../services/utilities.service';

@Component({
  selector: 'app-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss'],
})
export class CaptionComponent implements OnInit {
  dynamicForm: IDynamicForm;
  id: number;
  caption: string;

  constructor(
    private formService: FormService,
    private requestService: RequestService,
    private alertService: AlertService,
    @Optional() public config: DynamicDialogConfig,
    @Optional() public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    if (this.config.data) {
      this.id = this.config.data.id;
      this.caption = this.config.data.caption;
    }
    this.initilizeForm();
  }

  initilizeForm() {
    this.dynamicForm = {
      formSections: [
        {
          fields: [
            this.formService.addTextbox({
              field: 'fileCaption',
              label: 'Caption',
              value: this.caption,
              column: 12,
              validations: [{ type: EValidator.REQUIRED }],
            }),
          ],
        },
      ],
    };
  }

  saveForm(formFiels: any) {
    this.requestService
      .get<any[], any>('/AzureUpload/UpdateCaption', {
        Id: this.id,
        fileCaption: utilities.getFormFieldValue(
          this.dynamicForm,
          'fileCaption'
        ),
      })
      .subscribe(
        (response: any) => {
          if (response) {
            this.alertService.success('Caption added successfully.');
            this.ref.close(response);
          }
        },
        ({ error }) => {
          this.ref.close();
          this.alertService.apiError(error);
        }
      );
  }
  cancelForm(event: any) {
    console.log('CancelForm: ', event);
  }
}
