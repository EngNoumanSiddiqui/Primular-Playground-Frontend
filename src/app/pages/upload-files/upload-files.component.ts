import { Component, Input, OnInit } from '@angular/core';
import {
  AlertService,
  IFormField,
  IFormSection,
} from '@churchillliving/se-ui-toolkit';
import { EFormControl, ESelectFileType } from '@churchillliving/se-ui-toolkit';
import { EGridSortDirection, IDynamicCard, IDynamicForm } from 'src/app/models';
import { FormService } from 'src/app/services/form.service';
import { RequestService } from 'src/app/services/request.service';
import * as utilities from '../../services/utilities.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit {
  filesData: any = [];
  dynamicCard: IDynamicCard;
  dynamicForm: IDynamicForm;

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.initilizeForm().then((x) => {
      //utilities.setCardFieldsData(this.dynamicForm);
      this.loadDataForEdit();
    });
    this.getAllFiles();
  }

  inililizeCardsList() {
    this.dynamicCard = {
      data: this.filesData,
      //class: 'test-class',
      allowDelete: true,
      onDelete: (data: any) => {
        console.log('onDelete event:', data);
      },
      onSort: (data: any) => {
        console.log('onSort event:', data);
      },
      // files: {
      //   allowDownloadFile: true,
      //   allowEditableCaption: true,
      //   allowDeleteFile: true,
      //   height: '200px',
      //   width: '3',
      // },
      formSections: [
        {
          name: 'First Section',
          fields: [
            {
              label: 'First Name',
              field: 'CreatedDate',
              control: EFormControl.INPUT,
              value: '',
              column: 6,
              tables: ['Customer'],
            },
            {
              label: 'Last Name',
              field: 'Email',
              value: '',
              column: 6,
              control: EFormControl.INPUT,
              tables: ['Customer'],
            },
          ],
        },
      ],
    };
  }

  async initilizeForm() {
    const card = await this.formService.addCard(
      {
        label: 'card',
        column: 12,
        card: {
          // class: 'test-class',
          onDelete: (data: any) => {
            console.log('onDelete event:', data);
          },
          onSort: (data: any) => {
            console.log('onSort event:', data);
          },
          allowDelete: true,
          files: {
            //allowDownloadFile: true,
            allowEditableCaption: true,
            //allowDeleteFile: true,
            height: '200px',
            width: '3',
            onCaptionSave: (data: any) => {
              console.log('onCaptionSave event:', data);
            },
          },
          formSections: [
            // {
            //   name: 'card Section',
            //   fields: [
            //     {
            //       label: 'First Name',
            //       field: 'FirstName',
            //       control: EFormControl.INPUT,
            //       value: '',
            //       column: 6,
            //       tables: ['Customer'],
            //     },
            //     {
            //       label: 'Last Name',
            //       field: 'LastName',
            //       value: '',
            //       column: 6,
            //       control: EFormControl.INPUT,
            //       tables: ['Customer'],
            //     },
            //     {
            //       label: 'Age',
            //       field: 'age',
            //       value: '',
            //       control: EFormControl.NUMERIC,
            //       tables: ['order'],
            //     },
            //   ],
            // },
          ],
        },
      },
      {
        // uniqueKey: 'Customer-Query-SelectAllWithoutAliases',
        uniqueKey: 'GetAllFromAzureUpload',
        // filters: [
        //   { field: 'ID', matchMode: 'equals', operator: 'and', value: 5 },
        // ],
        // sorts: [
        //   { field: 'name', direction: EGridSortDirection.ASC, priority: 1 },
        // ],
      }
    );

    this.dynamicForm = {
      formSections: [
        {
          name: 'card11 Section',
          fields: [
            {
              label: 'Created Date',
              field: 'CreatedDate',
              control: EFormControl.INPUT,
              value: '',
              column: 6,
              tables: ['Customer'],
            },
            card,
            {
              label: 'Email',
              field: 'Email',
              value: '',
              column: 6,
              control: EFormControl.INPUT,
              tables: ['Customer'],
            },
          ],
        },
      ],
    };
  }

  saveForm(event: IFormSection[]) {
    console.log('saveForm: ', event);

    const formValues: any[] = utilities.setSaveCardValues(event, [
      'Customer',
      'order',
    ]);
    console.log('formValues:', formValues);

    // const values: any[] = utilities.setSaveCardValues(event);
    // console.log('values:', values);

    formValues.forEach((x) => {
      this.requestService
        .get<any[], any>('/Data/BulkSave', {
          uniqueKey: 'Customer-Order-Query-BulkUpsert',
          tables: [
            {
              values: x.Customer,
              priority: 1,
              filters: [
                // {
                //   field: 'CId',
                //   matchMode: 'equals',
                //   operator: 'and',
                //   value: this.id,
                // },
                utilities.setAndFilter('CId', 10000),
              ],
            },
            {
              values: x.order,
              priority: 2,
              filters: [
                {
                  field: 'CustomerId',
                  matchMode: 'equals',
                  operator: 'and',
                  value: 10000,
                },
                utilities.setAndFilter('CustomerId', 1),
              ],
            },
          ],
        })
        .subscribe((data) => {});
    });
  }

  getAllFiles() {
    this.requestService
      .get('/Data/Fetch', {
        uniqueKey: 'GetAllFromAzureUpload', //'Customer-Query-SelectAllWithoutAliases',
        filters: [
          { field: 'ID', matchMode: 'equals', operator: 'and', value: 5 },
        ],
      })
      .subscribe(
        (data) => {
          this.filesData = data.records;
          this.inililizeCardsList();
          //utilities.setCardFieldsData(this.dynamicCard);
          console.log('card-data:', this.dynamicCard.data);
        },
        ({ error }) => {
          this.inililizeCardsList();
          this.alertService.apiError(error);
        }
      );
  }

  loadDataForEdit() {
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Customer-Query-SelectAllWithoutAliases',
        filters: [
          { field: 'ID', matchMode: 'equals', operator: 'and', value: 5 },
        ],
      })
      .subscribe((data) => {
        if (this.dynamicForm) {
          const { formSections } = this.dynamicForm;
          utilities.setEditFormFields(data, { formSections });
        }
      });
  }
}
