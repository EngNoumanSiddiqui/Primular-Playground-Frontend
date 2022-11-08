import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import * as utilities from 'src/app/services/utilities.service';
import {
  EFormControl,
  IDynamicForm,
  EFormatType,
} from '../../models/form.model';
import { RequestService, AlertService } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-suite-amen',
  templateUrl: './suite-amen.component.html',
  styleUrls: ['./suite-amen.component.scss'],
})
export class SuiteAmenComponent implements OnInit {
  suiteId: string = '';
  buildingId: string = '';
  isFromModal: boolean;
  unitURL: any = '';
  buildingURL: any = '';
  rateCalculatorURL: any = '';
  taxURL: any = '';

  dynamicForm: IDynamicForm = {
    column: 6,
    formSections: [
      {
        fields: [
          {
            label: 'Suite Id',
            field: 'SUITID',
            control: EFormControl.INPUT,
            disabled: true,
            value: '',
          },
          {
            label: 'Balcony',
            field: 'BALCONY',
            control: EFormControl.CHECKBOX,
            value: '',
            tables: ['Suite'],
            format: { type: EFormatType.BOOLEAN_YN },
          },
          {
            label: 'Juliet',
            field: 'JULIETTERRACE',
            control: EFormControl.CHECKBOX,
            value: '',
            tables: ['Suite'],
            format: { type: EFormatType.BOOLEAN_YN },
          },
          {
            label: 'Dishwasher',
            field: 'DISHWASHER',
            control: EFormControl.CHECKBOX,
            value: '',
            tables: ['Suite'],
            format: { type: EFormatType.BOOLEAN_YN },
          },
          {
            label: 'Alarm',
            field: 'ALARM',
            control: EFormControl.CHECKBOX,
            value: '',
            tables: ['Suite'],
            format: { type: EFormatType.BOOLEAN_YN },
          },
          {
            label: 'ADA Unit',
            field: 'HANDICAPPED',
            control: EFormControl.CHECKBOX,
            value: '',
            tables: ['Suite'],
            format: { type: EFormatType.BOOLEAN_YN },
          },
          {
            label: 'Handicapt Notes',
            field: 'HANDICAPNOTES',
            control: EFormControl.INPUT,
            value: '',
            tables: ['Suite'],
          },
          {
            label: 'Stairs In Unit',
            field: 'STAIRSINUNIT',
            control: EFormControl.CHECKBOX,
            value: '',
            tables: ['Suite'],
            format: { type: EFormatType.BOOLEAN_YN },
          },
          {
            label: 'Bath Type',
            field: 'BathType',
            control: EFormControl.INPUT,
            value: '',
            tables: ['Suite'],
            data: [
              { label: 'Tub', value: 'TUB' },
              { label: 'Shower Stall', value: 'STALL' },
              { label: 'Handicapped Stall', value: 'HSTALL' },
            ],
          },
        ],
      },
    ],
  };
  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    public router: Router,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config) {
      this.isFromModal = true;
      if (
        this.config.data &&
        this.config.data.suiteId &&
        this.config.data.buildingId
      ) {
        this.suiteId = this.config.data.suitId.toString();
        this.buildingId = this.config.data.buildingId.toString();
      }

      if (this.suiteId && this.buildingId) {
      }

      this.loadDataForEdit();
    }
    if (this.suiteId && this.buildingId) {
      this.loadDataForEdit();
    } else {
      this.route.queryParams.subscribe((params: Params) => {
        if (params.suiteId && params.buildingId) {
          this.suiteId = params.suiteId;
          this.buildingId = params.buildingId;
          this.loadDataForEdit();
        }
      });
    }
  }

  loadDataForEdit() {
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Suite-Select-Detail',
        filters: [
          {
            field: 'SUIT.SuitId',
            matchMode: 'equals',
            operator: 'and',
            value: this.suiteId,
          },
          {
            field: 'SUIT.BldgId',
            matchMode: 'equals',
            operator: 'and',
            value: this.buildingId,
          },
        ],
      })
      .subscribe(
        (data) => {
          if (data.records && data.records.length > 0) {
            for (const [key, value] of Object.entries(data.records[0])) {
              this.dynamicForm.formSections.forEach((section) => {
                section.fields.forEach((item) => {
                  if (item.field?.toLowerCase() === key?.toLowerCase()) {
                    if (item.format) {
                      item.format.formatter(value);
                    } else {
                      item.value = value;
                    }
                    switch (item.control) {
                      case EFormControl.CALENDAR:
                        item.value = item.value
                          ? new Date(item.value as string)
                          : item.value;
                        break;
                      case EFormControl.INPUT:
                        item.value = item.value
                          ? item.value.toString().trim()
                          : item.value;
                        break;
                      default:
                        break;
                    }
                  }
                });
              });
            }
          } else {
            utilities.setFormFieldValue(
              this.dynamicForm,
              'SUITID',
              this.suiteId
            );
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  saveForm(value: any) {}

  cancelForm(value: any) {}
}
