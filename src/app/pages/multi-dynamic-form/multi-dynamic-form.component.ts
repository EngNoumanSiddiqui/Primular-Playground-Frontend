import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  EFormControl,
  ESelectFileType,
  IFormField,
  IFormSection,
  ISelectItem,
} from '../../models';
import {
  RequestService,
  DropdownService,
  AlertService,
} from '@churchillliving/se-ui-toolkit';
import * as utilities from '@churchillliving/se-ui-toolkit';
import { LoaderService } from 'src/app/services/loader.service';
import { FormService } from 'src/app/services/form.service';
import { IDynamicForm } from 'src/app/models';

@Component({
  selector: 'app-multi-dynamic-form',
  templateUrl: './multi-dynamic-form.component.html',
  styleUrls: ['./multi-dynamic-form.component.scss'],
})
export class MultiDynamicFormComponent implements OnInit {
  streetNumbers: ISelectItem[] = [];
  isFromModal: boolean = false;
  id: any = '';
  data: string[] = [];
  firstName: any;
  lastName: any;
  imageSource: any;
  dynamicForm: IDynamicForm;

  galleryImage: any = [
    {
      big: 'https://www.furnishedhousing.com/OrigPics/57821.jpg',
      label: '1046',
      medium: 'https://www.furnishedhousing.com/OrigPics/57821.jpg',
      small: 'https://www.furnishedhousing.com/OrigPics/57821.jpg',
    },
    {
      big: 'https://www.furnishedhousing.com/OrigPics/57820.jpg',
      label: '1046',
      medium: 'https://www.furnishedhousing.com/OrigPics/57820.jpg',
      small: 'https://www.furnishedhousing.com/OrigPics/57820.jpg',
    },
    {
      big: 'https://www.furnishedhousing.com/OrigPics/48150.jpg',
      label: '1046',
      medium: 'https://www.furnishedhousing.com/OrigPics/48150.jpg',
      small: 'https://www.furnishedhousing.com/OrigPics/48150.jpg',
    },
    {
      big: 'https://www.furnishedhousing.com/OrigPics/48151.jpg',
      label: '1046',
      medium: 'https://www.furnishedhousing.com/OrigPics/48151.jpg',
      small: 'https://www.furnishedhousing.com/OrigPics/48151.jpg',
    },
  ];
  initilizeForm() {
    this.dynamicForm = {
      formSections: [
        {
          name: '',
          fields: [
            this.formService.addHeader({ label: 'Hello', column: 8 }),
            {
              label: 'First Name',
              field: 'CFirstName',
              control: EFormControl.INPUT,
              value: '',
              tables: ['Customer'],
            },
            {
              label: 'Last Name',
              field: 'LastName',
              value: '',
              control: EFormControl.INPUT,
              tables: ['Customer'],
            },
            {
              label: 'Age',
              field: 'Age',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['Customer'],
            },
            {
              label: 'Created Date',
              field: 'CreatedDate',
              value: '',
              control: EFormControl.CALENDAR,
              tables: ['Customer'],
            },
            {
              label: 'Active',
              field: 'Active',
              value: null,
              control: EFormControl.CHECKBOX,
              tables: ['Customer'],
            },
            {
              label: 'Email',
              field: 'Email',
              value: '',
              control: EFormControl.INPUT,
              tables: ['Customer'],
            },
            {
              label: 'Modified Date',
              field: 'ModifiedDate',
              value: '',
              control: EFormControl.CALENDAR,
              tables: ['Customer'],
            },
            {
              label: 'Display File',
              field: 'Email',
              control: EFormControl.DISPLAY_FILE,
              data: this.imageSource,
              column: 12,
              tables: ['Customer'],
            },
            {
              label: 'Serial Number',
              field: 'SerialNumber',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['Customer'],
            },
            this.formService.addFileUpload({
              label: 'File Upload',
              field: 'Age',
              column: 6,
              control: EFormControl.FILE_UPLOAD,
              //validations: [{ type: EValidator.REQUIRED, expression: '' }],
              onReturn: function (response: any) {
                console.log('onReturn', response);
              },
              selectMultipleFiles: true,
              SetfileTypes: ESelectFileType.IMAGE,
            }),
            {
              label: 'Has Orders',
              field: 'HasOrders',
              value: null,
              control: EFormControl.CHECKBOX,
              tables: ['Customer'],
            },
            // {
            //   label: 'Street Number',
            //   field: 'StreetNumber',
            //   value: null,
            //   control: EFormControl.DROPDOWN,
            //   data: this.streetNumbers,
            //   tables: ['Customer']
            // },
            {
              label: 'Total Orders',
              field: 'TotalOrders',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['CUStomeR'],
            },
            {
              label: 'Building Notes',
              field: 'Notes',
              value: '',
              control: EFormControl.NOTE_FIELD,
              tables: ['Customer'],
              onReturn: function (note) {
                this.value = note;
              },
            },
            {
              label: 'Total',
              field: 'Total',
              value: '',
              control: EFormControl.NUMERIC,
              tables: ['oRder'],
            },
          ],
        },
      ],
    };
  }
  constructor(
    private requestService: RequestService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private dropdownService: DropdownService,
    private route: ActivatedRoute,
    private formService: FormService,
    public router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.getAllFiles();
    this.loadStreetNumbers();
    this.route.queryParams.subscribe((params: Params) => {
      if (params.id) {
        this.id = params.id;
        this.loadDataForEdit();
      }
    });
    setTimeout(() => {
      this.initilizeForm();
    }, 1000);
  }

  getAllFiles() {
    this.requestService
      .get('/Data/Fetch', { uniqueKey: 'GetAllFromAzureUpload' })
      .subscribe((data) => {
        console.log('response:', data.records);
        this.imageSource = data.records;
        console.log('IMAGE: ', this.imageSource);
      });
  }

  loadDataForEdit() {
    this.loaderService.showLoader(false);
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Customer-Query-SelectCustomerOrderLeftJoinQuery',
        filters: [
          {
            field: 'CId',
            matchMode: 'equals',
            operator: 'and',
            value: this.id,
          },
        ],
      })
      .subscribe(
        (data) => {
          this.loaderService.hideLoader();
          this.firstName = utilities.getOrigDataFieldValue(data, 'CFirstName');
          this.lastName = utilities.getOrigDataFieldValue(data, 'LastName');

          if (data.records && data.records.length > 0) {
            for (const [key, value] of Object.entries(data.records[0])) {
              this.dynamicForm.formSections.forEach((section) => {
                section.fields.forEach((item) => {
                  if (item.field?.toLowerCase() === key?.toLowerCase()) {
                    if (item.control === EFormControl.CALENDAR) {
                      item.value = new Date(value as string);
                    } else {
                      item.value = value;
                    }
                  }
                });
              });
            }
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  /**
   * Fetch and set street numbers from api to populate in dropdown
   */
  loadStreetNumbers() {
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Customer-GetStreetNumbers-StoredProcedure',
      })
      .subscribe(
        (response) => {
          this.streetNumbers.push(
            ...this.dropdownService.setDropDown(response, 'Id', 'StreetNumber')
          );
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  saveForm(formSections: any[]) {
    console.log('formSections', formSections);
    console.log('invoked save form event');

    const customerTable: any = {};
    const orderTable: any = {};
    let uniqueKey: string = 'Customer-Order-Query-BulkUpsert';

    const formValues: any = utilities.setSaveFormValues(formSections, [
      'Customer',
      'Order',
    ]);
    // prepare values dictionary object

    formSections.forEach((formSection) => {
      formSection.fields.forEach((field) => {
        if (field.tables?.includes('Customer')) {
          customerTable[field.field] = field.value;
        } else {
          orderTable[field.field] = field.value;
        }
      });
    });

    formValues.Customer['AzureUploadIds'] = this.imageSource.map((x) => x.Id);
    this.requestService
      .get<any[], any>('/Data/BulkSave', {
        uniqueKey: uniqueKey,
        tables: [
          {
            values: formValues.Customer,
            priority: 1,
            filters: [
              // {
              //   field: 'CId',
              //   matchMode: 'equals',
              //   operator: 'and',
              //   value: this.id,
              // },
              utilities.setAndFilter('CId', this.id),
            ],
          },
          {
            values: formValues.Order,
            priority: 2,
            filters: [
              {
                field: 'CustomerId',
                matchMode: 'equals',
                operator: 'and',
                value: this.id,
              },
              utilities.setAndFilter('CustomerId', this.id),
            ],
          },
        ],
      })
      .subscribe(
        (data) => {
          if (data) {
            this.alertService.success('Data Saved Successfully.');
          }
          this.redirectToPage(true);
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  cancelForm(formSections: IFormSection[]) {
    console.log('formSections:', formSections);
    console.log('invoked cancel form event');
    this.redirectToPage();
  }

  redirectToPage(isSave: boolean = false) {
    if (isSave) {
      this.router.navigate(['grid-actions']);
    }
  }
}
