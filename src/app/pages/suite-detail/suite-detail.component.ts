import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  EFormControl,
  EValidator,
  GridFilterControlType,
  IGridColumn,
  IGridServerSideEvent,
  IGlobalFilter,
  RequestDto,
  IHeader,
  EButtonClass,
  ISidebar,
  ESidebarAction,
  EHyperlink,
  EFormatType,
  EPermissionType,
} from '@churchillliving/se-ui-toolkit';
import { RequestService, AlertService } from '@churchillliving/se-ui-toolkit';
import * as utilities from '@churchillliving/se-ui-toolkit';
import { DialogService } from 'primeng/dynamicdialog';
import { CodeSelectionComponent } from '../shared/code-selection.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BuildingSelectionComponent } from '../shared/building-selection.component';
import { WorkflowUserSelectionComponent } from '../shared/workflowuser-selection.component';
import { SuiteHoldComponent } from '../suite-hold/suite-hold.component';
import { SuiteReasonComponent } from '../suite-reason/suite-reason.component';
import { IDynamicForm, IFormSection } from '@churchillliving/se-ui-toolkit';
import { GridService } from '@churchillliving/se-ui-toolkit';
import { FormService } from '@churchillliving/se-ui-toolkit';
import { HeaderService } from '@churchillliving/se-ui-toolkit';
import { IFormField } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-suite-detail',
  templateUrl: './suite-detail.component.html',
  styleUrls: ['./suite-detail.component.scss'],
})
export class SuiteDetailComponent implements OnInit {
  suiteId: string = '';
  buildingId: string = '';
  buildingName: string = '';
  unitStatus: string = '';
  SuiteSizeCodes: string[] = [];
  unitURL: string = '';
  buildingURL: string = '';
  rateCalculatorURL: string = '';
  taxURL: string = '';
  suiteKeysURL: string = '';
  isFromModal: boolean = false;
  holds: any[] = [];
  globalFilters: IGlobalFilter[] = [];
  headers: IHeader;
  rightSidebarItems: ISidebar[] = [];
  leftSidebarItems: ISidebar[] = [];

  dynamicForm: IDynamicForm = {
    column: 2,
    formSections: [
      {
        fields: [
          this.formService.addLookUp({
            field: 'BLDGID',
            label: {
              name: 'Building Id',
              onClick: () => {
                window.open('http://www.google.com');
              },
            },
            lookupControl: {
              component: BuildingSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: '',
                data: {},
              },
            },
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 3 },
              { type: EValidator.MAXLENGTH, expression: 6 },
            ],
            onClick: () => {
              this.selectBuildingId();
            },
          }),
          // {
          //   label: {
          //     name: 'Building Id',
          //     onClick: () => {
          //       window.open('http://www.google.com');
          //     },
          //   }, // grid lookup to building can only edit if its new record
          //   field: 'BLDGID',
          //   validations: [
          //     { type: EValidator.REQUIRED, expression: '' },
          //     { type: EValidator.MINLENGTH, expression: 3 },
          //     { type: EValidator.MAXLENGTH, expression: 6 },
          //   ],
          //   onClick: () => {
          //     this.selectBuildingId();
          //   },
          //   //control: EFormControl.LOOKUP_INPUT,
          //   control: EFormControl.INPUT,
          //   lookupControl: {
          //     component: BuildingSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: '',
          //       data: {},
          //     },
          //   },
          // },
          // {
          //   label: 'Suite Id',
          //   field: 'SuiteId',
          //   control: EFormControl.INPUT,
          //   //disabled: true,
          //   // validations: [
          //   //   { type: EValidator.REQUIRED, expression: '' },
          //   //   { type: EValidator.MINLENGTH, expression: 3 },
          //   //   { type: EValidator.MAXLENGTH, expression: 6 },
          //   // ],
          // },
          this.formService.addTextbox({
            field: 'SuiteId',
            label: 'Suite Id',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 3 },
              { type: EValidator.MAXLENGTH, expression: 6 },
            ],
          }),
          // {
          //   label: 'Apt Number',
          //   field: 'SUITENO',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          //   validations: [
          //     { type: EValidator.REQUIRED, expression: '' },
          //     { type: EValidator.MINLENGTH, expression: 2 },
          //     { type: EValidator.MAXLENGTH, expression: 15 },
          //   ],
          // },
          this.formService.addTextbox({
            field: 'SUITENO',
            label: 'Apt Number',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 2 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
            tables: ['Suite'],
          }),
          {
            label: 'Bedroom',
            field: 'SUITSIZE',
            control: EFormControl.LOOKUP_INPUT,
            tables: ['Suite'],
            lookupControl: {
              component: CodeSelectionComponent,
              data: {
                header: 'Code Selection',
                width: '80%',
                matchField: 'CodeVal',
                data: { codeType: 'bedroom' },
              },
            },
            //validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          // {
          //   label: 'Bathroom',
          //   field: 'BATHS',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          //   validations: [{ type: EValidator.DECIMAL }],
          // },
          this.formService.addTextbox({
            field: 'BATHS',
            label: 'Bathroom',
            validations: [{ type: EValidator.DECIMAL }],
            tables: ['Suite'],
          }),
          // {
          //   label: 'Floor #',
          //   field: 'FLOORNO',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          //   validations: [{ type: EValidator.NUMERIC }],
          // },
          this.formService.addTextbox({
            field: 'FLOORNO',
            label: 'Floor #',
            validations: [{ type: EValidator.NUMERIC }],
            tables: ['Suite'],
          }),
          // {
          //   label: 'Bldg #',
          //   field: 'BLDGNO',
          //   control: EFormControl.INPUT,
          // },
          this.formService.addTextbox({ field: 'BLDGNO', label: 'Bldg #' }),
          // {
          //   label: 'Mailbox #',
          //   field: 'MAILBOX',
          //   tables: ['Suite'],
          //   control: EFormControl.INPUT,
          // },
          this.formService.addTextbox({
            field: 'MAILBOX',
            label: 'Mailbox #',
            tables: ['Suite'],
          }),
          // {
          //   label: 'Mailbox Matches',
          //   field: 'MLBXMATCHESAPT', //shows * if Y
          //   control: EFormControl.INPUT,
          //   //formatter: utilities.toBoolean,
          // },
          this.formService.addTextbox({
            field: 'MLBXMATCHESAPT',
            label: 'Mailbox Matches',
          }),
          // {
          //   label: 'Not Online',
          //   field: 'NOTONLINE', //we use Y and N values
          //   control: EFormControl.CHECKBOX,
          //   tables: ['Suite'],
          //   formatter: utilities.toBoolean,
          // },
          this.formService.addCheckbox({
            field: 'NOTONLINE',
            label: 'Not Online',
            tables: ['Suite'],
          }),
          // {
          //   label: 'Rating',
          //   field: 'ROOMTYPE',
          //   tables: ['SuiteAddition'],
          //   control: EFormControl.LOOKUP_INPUT,
          //   lookupControl: {
          //     component: CodeSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: 'CodeVal',
          //       data: { codeType: 'UNITROOMTYPE' },
          //     },
          //   },
          // },
          this.formService.addLookUp({
            field: 'ROOMTYPE',
            label: 'Rating',
            lookupControl: {
              component: CodeSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CodeVal',
                data: { codeType: 'UNITROOMTYPE' },
              },
            },
            tables: ['SuiteAddition'],
          }),

          // {
          //   label: 'Building Name',
          //   field: 'BLDGNAME',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          // },
          this.formService.addTextbox({
            field: 'BLDGNAME',
            label: 'Building Name',
            disabled: true,
          }),
          // {
          //   label: 'Address',
          //   field: 'ADDRESS1',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          // },
          this.formService.addTextbox({
            field: 'ADDRESS1',
            label: 'Address',
            disabled: true,
          }),
          // {
          //   label: 'Phone',
          //   field: 'PHONENO',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          // },
          this.formService.addTextbox({
            field: 'PHONENO',
            label: 'Phone',
            tables: ['Suite'],
          }),
          // {
          //   label: 'Furnished By',
          //   field: 'FURNITURE',
          //   control: EFormControl.DROPDOWN,
          //   tables: ['Suite'],
          //   data: [
          //     { label: 'Churchill', value: 'Churchill' },
          //     { label: 'Landlord', value: 'Landlord' },
          //     { label: 'Rental', value: 'Rental' },
          //     { label: 'Corporate Housing Provider', value: 'CHP' },
          //   ],
          // },
          this.formService.addDropdown({
            field: 'FURNITURE',
            label: 'Furnished By',
            data: [
              { label: 'Churchill', value: 'Churchill' },
              { label: 'Landlord', value: 'Landlord' },
              { label: 'Rental', value: 'Rental' },
              { label: 'Corporate Housing Provider', value: 'CHP' },
            ],
            tables: ['Suite'],
          }),
          // {
          //   label: 'Landlord',
          //   field: 'Landlord',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          // },
          this.formService.addTextbox({
            field: 'Landlord',
            label: 'Landlord',
            disabled: true,
          }),
          // {
          //   label: 'Parking #',
          //   field: 'PARKING',
          //   tables: ['Suite'],
          //   control: EFormControl.LOOKUP_INPUT,
          //   lookupControl: {
          //     component: CodeSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: '',
          //       data: { codeType: 'PARKINGOPT' },
          //     },
          //   },
          // },
          this.formService.addLookUp({
            field: 'PARKING',
            label: 'Parking #',
            lookupControl: {
              component: CodeSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: '',
                data: { codeType: 'PARKINGOPT' },
              },
            },
            tables: ['Suite'],
          }),
          // {
          //   label: 'Tag #',
          //   field: 'TAG',
          //   tables: ['SuiteAddition'],
          //   control: EFormControl.INPUT,
          // },
          this.formService.addTextbox({
            field: 'TAG',
            label: 'Tag #',
            tables: ['SuiteAddition'],
          }),
          // {
          //   label: 'Door Code',
          //   field: 'DOORCODE',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          // },
          this.formService.addTextbox({
            field: 'DOORCODE',
            label: 'Door Code',
            tables: ['Suite'],
          }),
          // {
          //   label: 'Backup Code',
          //   field: 'BACKUPDOORCODE',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          //   tables: ['SuiteAddition'],
          // },
          this.formService.addTextbox({
            field: 'BACKUPDOORCODE',
            label: 'Backup Code',
            tables: ['SuiteAddition'],
            disabled: true,
          }),
          // {
          //   label: '1 Month Rate',
          //   field: 'Month1Rate',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          //   formatter: function (value: any) { this.value = utilities.toDecimal(value); },
          // },
          this.formService.addTextbox({
            field: 'Month1Rate',
            label: '1 Month Rate',
            disabled: true,
            format: { type: EFormatType.DECIMAL },
          }),
          // {
          //   label: '3 Month Rate',
          //   field: 'Month3Rate',
          //   control: EFormControl.INPUT,
          //   formatter: function (value: any) { this.value = utilities.toDecimal(value); },
          // },
          this.formService.addTextbox({
            field: 'Month3Rate',
            label: '3 Month Rate',
            format: { type: EFormatType.DECIMAL },
          }),
          // {
          //   label: 'Internet Rate',
          //   field: 'InternetRate',
          //   control: EFormControl.INPUT,
          //   formatter: function (value: any) { this.value = utilities.toDecimal(value); },
          // },
          this.formService.addTextbox({
            field: 'InternetRate',
            label: 'Internet Rate',
            format: { type: EFormatType.DECIMAL },
          }),
          // {
          //   label: 'Market Cost',
          //   field: 'MARKETCOST',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          //   formatter: function (value: any) { this.value = utilities.toDecimal(value); },
          // },
          this.formService.addTextbox({
            field: 'MARKETCOST',
            label: 'Market Cost',
            tables: ['Suite'],
            format: { type: EFormatType.DECIMAL },
          }),
          //  {
          //   label: 'Lowest Rate',
          //   field: 'LOWESTRATE',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          //   formatter: function (value: any) { this.value = utilities.toDecimal(value); },
          // },
          this.formService.addTextbox({
            field: 'LOWESTRATE',
            label: 'Lowest Rate',
            tables: ['Suite'],
            format: { type: EFormatType.DECIMAL },
          }),
          {
            label: 'Rate Calculator',
            field: '',
            control: EFormControl.HYPERLINK,
            onClick: () => {
              window.open(this.rateCalculatorURL);
            },
          },
          {
            label: 'Tax',
            field: '',
            control: EFormControl.HYPERLINK,
            onClick: () => {
              window.open(this.taxURL);
            },
          },
          // this.formService.addHyperlink('Tax', null, () => {
          //   window.open(this.taxURL);
          // }),
          // {
          //   label: 'Entity',
          //   field: 'ENTITY',
          //   tables: ['Suite'],
          //   control: EFormControl.LOOKUP_INPUT,
          //   lookupControl: {
          //     component: CodeSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: 'CodeVal',
          //       data: {
          //         codeType: 'SUITENTITY',
          //         columns: [
          //           {
          //             field: 'CodeVal',
          //             header: 'Code',
          //             filter: { type: GridFilterControlType.INPUT },
          //           },
          //           {
          //             field: 'CodeDesc',
          //             header: 'Description',
          //             filter: { type: GridFilterControlType.INPUT },
          //           },
          //           {
          //             field: 'CodeDesc3',
          //             header: 'Description 3',
          //             filter: { type: GridFilterControlType.INPUT },
          //           },
          //         ],
          //       },
          //     },
          //   },
          // },
          this.formService.addLookUp({
            field: 'ENTITY',
            label: 'Entity',
            lookupControl: {
              component: CodeSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CodeVal',
                data: {
                  codeType: 'SUITENTITY',
                  columns: [
                    {
                      field: 'CodeVal',
                      header: 'Code',
                      filter: { type: GridFilterControlType.INPUT },
                    },
                    {
                      field: 'CodeDesc',
                      header: 'Description',
                      filter: { type: GridFilterControlType.INPUT },
                    },
                    {
                      field: 'CodeDesc3',
                      header: 'Description 3',
                      filter: { type: GridFilterControlType.INPUT },
                    },
                  ],
                },
              },
            },
            tables: ['Suite'],
          }),
          // {
          //   label: 'Taken by',
          //   field: 'TAKENBY',
          //   tables: ['Suite'],
          //   control: EFormControl.LOOKUP_INPUT,
          //   lookupControl: {
          //     component: WorkflowUserSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: 'Name',
          //       data: {},
          //     },
          //   },
          // },
          this.formService.addLookUp({
            field: 'TAKENBY',
            label: 'Taken by',
            lookupControl: {
              component: WorkflowUserSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'Name',
                data: {},
              },
            },
            tables: ['Suite'],
          }),
          this.formService.addLookUp({
            field: 'REASON',
            label: {
              name: 'Reason',
              onClick: () => {
                this.dialogService.open(SuiteReasonComponent, {
                  header: '',
                  width: '1000%',
                  height: '500px',
                  data: {
                    suiteId: this.suiteId,
                    buildingId: this.buildingId,
                  },
                });
              },
            },
            disabled: true,
          }),
          // {
          //   label: {
          //     name: 'Reason',
          //     onClick: () => {
          //       this.dialogService.open(SuiteReasonComponent, {
          //         header: '',
          //         width: '100%',
          //         data: {
          //           suiteId: this.suiteId,
          //           buildingId: this.buildingId,
          //         },
          //       });
          //     },
          //   },
          //   field: 'REASON',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          // },
          {
            label: 'Lease Type',
            field: 'LEASESTYPE',
            control: EFormControl.DROPDOWN,
            tables: ['Suite'],
            data: [
              { label: 'Extendable', value: 'EX' },
              { label: 'Non-Extendable', value: 'NE' },
            ],
          },
          this.formService.addDropdown({
            field: 'LEASESTYPE',
            label: 'Lease Type',
            data: [
              { label: 'Extendable', value: 'EX' },
              { label: 'Non-Extendable', value: 'NE' },
            ],
            tables: ['Suite'],
          }),
          // {
          //   label: 'Renewal Plan',
          //   field: 'RENEWAL',
          //   tables: ['Suite'],
          //   control: EFormControl.LOOKUP_INPUT,
          //   lookupControl: {
          //     component: CodeSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: 'CodeVal',
          //       data: { codeType: 'RENEWALPLAN' },
          //     },
          //   },
          // },
          this.formService.addLookUp({
            field: 'RENEWAL',
            label: 'Renewal Plan',
            lookupControl: {
              component: CodeSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CodeVal',
                data: { codeType: 'RENEWALPLAN' },
              },
            },
            tables: ['Suite'],
          }),
          // {
          //   label: 'Avail. Status',
          //   field: 'AvailableStatus',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          // },
          this.formService.addTextbox({
            field: 'AvailableStatus',
            label: 'Avail. Status',
            disabled: true,
          }),
          // {
          //   label: 'Date Available',
          //   field: 'DateAvailable',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          //   formatter: function (value: any) { this.value = utilities.toShortDate(value); },
          // },
          this.formService.addTextbox({
            field: 'DateAvailable',
            label: 'Date Available',
            disabled: true,
            format: { type: EFormatType.SHORTDATE },
          }),
          // {
          //   label: 'Manual Date',
          //   field: 'DateAvail',
          //   control: EFormControl.INPUT,
          //   tables: ['Suite'],
          //   disabled: true,
          // },
          this.formService.addTextbox({
            field: 'DateAvail',
            label: 'Manual Date',
            tables: ['Suite'],
            disabled: true,
          }),
          // {
          //   label: 'Responsible Until',
          //   field: 'RESPONSIBLEUNTIL',
          //   control: EFormControl.INPUT,
          //   value: '',
          //   data: null,
          //   formatter: (value) => value = utilities.toShortDate(value),
          // },
          // {
          //   label: 'Unit Status',
          //   field: 'UNITSTATUS',
          //   tables: ['Suite'],
          //   control: EFormControl.LOOKUP_INPUT,
          //   lookupControl: {
          //     component: CodeSelectionComponent,
          //     data: {
          //       header: 'Grid selection',
          //       width: '80%',
          //       matchField: 'CodeVal',
          //       data: { codeType: 'UNITSTATUS' },
          //     },
          //   },
          // },
          this.formService.addLookUp({
            field: 'UNITSTATUS',
            label: 'Unit Status',
            lookupControl: {
              component: CodeSelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CodeVal',
                data: { codeType: 'UNITSTATUS' },
              },
            },
            tables: ['Suite'],
          }),
          // {
          //   label: 'Days',
          //   field: 'NumberOfDays',
          //   control: EFormControl.INPUT,
          //   disabled: true,
          // },
          this.formService.addTextbox({
            field: 'NumberOfDays',
            label: 'Days',
            disabled: true,
          }),
          // {
          //   label: 'Lease Start',
          //   field: 'LEASESTART',
          //   control: EFormControl.CALENDAR,
          //   tables: ['Suite'],
          //   formatter: function (value: any) { this.value = utilities.toShortDate(value); },
          // },
          this.formService.addCalendar({
            field: 'LEASESTART',
            label: 'Lease Start',
            tables: ['Suite'],
            format: { type: EFormatType.SHORTDATE },
          }),
          // {
          //   label: 'Lease End',
          //   field: 'LEASEEND',
          //   control: EFormControl.CALENDAR,
          //   tables: ['Suite'],
          //   formatter: function (value: any) { this.value = utilities.toShortDate(value); },
          // },
          this.formService.addCalendar({
            field: 'LEASEEND',
            label: 'Lease End',
            tables: ['Suite'],
            format: { type: EFormatType.SHORTDATE },
          }),
          {
            label: 'Notice Term',
            field: 'NOTICETERM',
            control: EFormControl.INPUT,
            tables: ['Suite'],
            validations: [{ type: EValidator.NUMERIC }],
          },
          this.formService.addTextbox({
            field: 'NOTICETERM',
            label: 'Notice Term',
            validations: [{ type: EValidator.NUMERIC }],
            tables: ['Suite'],
          }),
          // {
          //   label: 'Extended to',
          //   field: 'EXTENEDTO',
          //   control: EFormControl.CALENDAR,
          //   tables: ['Suite'],
          // },
          this.formService.addCalendar({
            field: 'EXTENEDTO',
            label: 'Extended to',
            tables: ['Suite'],
          }),
          // {
          //   label: 'Gave Notice',
          //   field: 'NOTICEGIVEN',
          //   control: EFormControl.CALENDAR,
          //   tables: ['Suite'],
          //   formatter: function (value: any) { this.value = utilities.toShortDate(value); },
          // },
          this.formService.addCalendar({
            field: 'NOTICEGIVEN',
            label: 'Gave Notice',
            tables: ['Suite'],
            format: { type: EFormatType.SHORTDATE },
          }),
          // {
          //   label: 'Giving Up',
          //   field: 'GIVINGUP',
          //   control: EFormControl.CALENDAR,
          //   tables: ['Suite'],
          //   formatter: function (value: any) { this.value = utilities.toShortDate(value); },
          // },
          this.formService.addCalendar({
            field: 'GIVINGUP',
            label: 'Giving Up',
            tables: ['Suite'],
            format: { type: EFormatType.SHORTDATE },
          }),
          // {
          //   label: 'Building Notes',
          //   field: 'BLDGDESCRPTN',
          //   control: EFormControl.NOTE_FIELD,
          //   onReturn: function (note) {
          //     this.value = note;
          //   },
          // },
          this.formService.addNoteField({
            field: 'BLDGDESCRPTN',
            label: 'Building Notes',
            onReturn: function (note) {
              this.value = note;
            },
          }),
          {
            label: 'Hold Not Ready',
            field: '',
            control: EFormControl.HYPERLINK,
            onClick: () => {
              window.open(
                'suite-hold?suiteId=' +
                  this.suiteId.trim() +
                  '&&buildingId=' +
                  this.buildingId.trim()
              );
            },
          },
          //SuiteHold-GetSuiteHold-StoredProcedure
        ],
        permissions: [
          // { type: EPermissionType.VIEW, roles: ['SalesRepManager11'] },
          { type: EPermissionType.EDIT, roles: ['SalesRepManager11'] },
        ],
      },
    ],
  };

  public columns: IGridColumn[] = [
    // {
    //   field: 'AccountNum',
    //   header: 'Acct #',
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'AccountNum',
      header: 'Acct #',
      filtering: false,
    }),
    // {
    //   field: 'HoldForSP',
    //   header: 'Hold for SP',
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'HoldForSP',
      header: 'Hold for SP',
      filtering: false,
    }),
    // {
    //   field: 'HoldReason',
    //   header: 'Reason',
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'HoldReason',
      header: 'Reason',
      filtering: false,
    }),
    // {
    //   field: 'HoldFrom',
    //   header: 'Hold From',
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'HoldFrom',
      header: 'Hold From',
      filtering: false,
    }),
    // {
    //   field: 'HoldUntil',
    //   header: 'Hold Until',
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'HoldUntil',
      header: 'Hold Until',
      filtering: false,
    }),
    // {
    //   field: 'HoldDate',
    //   header: 'Hold Date',
    //   filtering: false,
    // },
    this.gridService.addFilterColumn({
      field: 'HoldDate',
      header: 'Hold Date',
      filtering: false,
    }),
  ];

  constructor(
    private requestService: RequestService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    public router: Router,
    private gridService: GridService,
    private formService: FormService,
    private headerService: HeaderService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // initialize header
    this.initializeHeader();
    this.initializeSideBars();

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

      this.loadDataForEdit();
    }

    if (this.suiteId && this.buildingId) {
      this.loadDataForEdit();
    } else {
      this.route.queryParams.subscribe((params: Params) => {
        if (params.suiteId && params.buildingId) {
          this.suiteId = params.suiteId;
          this.buildingId = params.buildingId;
          let suiteID = utilities.getFormField(this.dynamicForm, 'SuiteId');
          this.loadDataForEdit();
        }
      });
    }

    //  this.getHolds();
  }

  selectBuildingId() {
    const ref = this.dialogService.open(BuildingSelectionComponent, {
      header: 'Building Selection',
      width: '80%',
      //data: { codeType: 'UNITROOMTYPE' },
    });

    ref.onClose.subscribe(
      (selectedRow) => {
        if (selectedRow) {
          utilities.setFormFieldValue(
            this.dynamicForm,
            'BLDGID',
            selectedRow.BldgId
          );
        }
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }

  loadDataForEdit() {
    this.requestService
      .get<any[], any>('/Data/Fetch', {
        uniqueKey: 'Suite-Select-Detail',
        filters: [
          // {
          //   field: 'S.SuitId',
          //   matchMode: 'equals',
          //   operator: 'and',
          //   value: this.suiteId,
          // },
          utilities.setAndFilter('S.SuitId', this.suiteId),
          // {
          //   field: 'S.BldgId',
          //   matchMode: 'equals',
          //   operator: 'and',
          //   value: this.buildingId,
          // },
          utilities.setAndFilter('S.BldgId', this.buildingId),
        ],
      })
      .subscribe(
        (data) => {
          if (data.records && data.records.length > 0) {
            // if (data.records[0].UnitURL) {
            //   this.unitURL = data.records[0].UnitURL;
            // }

            this.unitURL = utilities.getOrigDataFieldValue(data, 'UnitURL');

            //if (data.records[0].BuildingURL || data.records[0].SUITSIZE) {
            this.buildingURL = utilities.getOrigDataFieldValue(
              data,
              'BuildingURL'
            );

            this.rateCalculatorURL =
              'http://mriweb/mripage.asp?PAGE=RENTCALC&GROUP=CHUREQ&MODAL=N&MENUNAME=W000001&MENUID=C_58&INHERITMENU=Y&MODELESS=Y&RETURNCOMMAND=C&INCLTAX=Y&ZIPCODE=ZIPCODE&FROMSUIT=Y&SUITSIZE=' +
              data.records[0].SUITSIZE.value +
              '&BLDGID=' +
              this.buildingId;
            if (data.records[0].ZIPCODE) {
              this.taxURL =
                'http://mriweb/mripage.asp?PAGE=TAXINFO&GROUP=W000001&MENUNAME=W000001&ZIPCODE=' +
                data.records[0].ZIPCODE;
              utilities.setFormField(this.dynamicForm, {
                label: 'Tax',
                control: EFormControl.HYPERLINK,
                hyperlink: { target: EHyperlink.BLANK, link: this.taxURL },
              });
            }
            if (data.records[0].BLDGNAME) {
              this.buildingName = data.records[0].BLDGNAME;
              this.unitStatus = data.records[0].UNITSTATUS;
            }
            // }

            utilities.setEditFormFields(data, this.dynamicForm);

            // in case of edit
            if (this.suiteId) {
              utilities.setFormFieldValue(
                this.dynamicForm,
                'SuiteId',
                this.suiteId
              );
            }

            let mailBoxMatch = utilities.getFormFieldValue(
              this.dynamicForm,
              'MAILBOXMATCH'
            );
            utilities.setFormFieldValue(
              this.dynamicForm,
              'MAILBOXMATCH',
              mailBoxMatch === 'Y' ? '*' : ''
            );

            let mlbxMatchesApi: any = utilities.getFormFieldValue(
              this.dynamicForm,
              'MLBXMATCHESAPT'
            );
            utilities.setFormFieldValue(
              this.dynamicForm,
              'MLBXMATCHESAPT',
              mlbxMatchesApi.toString().trim() === 'Y' ? '*' : ''
            );

            let furniture: any = utilities.getFormFieldValue(
              this.dynamicForm,
              'FURNITURE'
            );
            utilities.setFormFieldValue(
              this.dynamicForm,
              'FURNITURE',
              furniture.toString().trim()
            );

            let notOnlineField = utilities.getFormField(
              this.dynamicForm,
              'NOTONLINE'
            );
            if (
              notOnlineField &&
              notOnlineField.value &&
              notOnlineField.format.formatter === utilities.toBoolean
            ) {
              utilities.setFormFieldValue(
                this.dynamicForm,
                'NOTONLINE',
                notOnlineField.value === 0 ? 'N' : 'Y'
              );
            }

            let bldgIdField = utilities.getFormField(
              this.dynamicForm,
              'BLDGID'
            );
            if (bldgIdField) {
              bldgIdField.disabled = bldgIdField.value ? true : false;
              utilities.setFormField(this.dynamicForm, bldgIdField);
            }

            let calendarFields: IFormField[] = utilities.getFormFields(
              this.dynamicForm,
              EFormControl.CALENDAR
            );
            if (calendarFields && calendarFields.length) {
              calendarFields.forEach((field) => {
                field.value = field.value
                  ? new Date(field.value as string)
                  : field.value;
              });
              utilities.setFormFields(this.dynamicForm, calendarFields);
            }

            let inputFields: IFormField[] = utilities.getFormFields(
              this.dynamicForm,
              EFormControl.INPUT
            );
            if (inputFields && inputFields.length) {
              inputFields.forEach((field) => {
                field.value = field.value
                  ? field.value.toString().trim()
                  : field.value;
              });
              utilities.setFormFields(this.dynamicForm, inputFields);
            }

            // let calendarControl = utilities.getFormControlValue(this.dynamicForm, EFormControl.CALENDAR)
            // utilities.setFormControlValue(this.dynamicForm, EFormControl.CALENDAR, calendarControl);

            // let inputControl = utilities.getFormControlValue(this.dynamicForm, EFormControl.INPUT)
            // utilities.setFormControlValue(this.dynamicForm, EFormControl.INPUT, inputControl);

            // for (const [key, value] of Object.entries(data.records[0])) {
            //   this.dynamicForm.formSections.forEach((section) => {
            //     section.fields.forEach((item) => {
            //       if (item.field === key) {
            //         if (item.formatter) {
            //           item.formatter(value);
            //         } else {
            //           item.value = value;
            //         }

            //         switch (item.field) {
            //           //   case 'MAILBOXMATCH':
            //           //     item.value = value === 'Y' ? '*' : '';
            //           //     break;
            //           case 'MLBXMATCHESAPT':
            //             item.value = value.toString().trim() === 'Y' ? '*' : '';
            //             break;
            //           case 'FURNITURE':
            //             if (value) {
            //               item.value = value.toString().trim();
            //             }
            //             break;
            //           case 'NOTONLINE':
            //             if (
            //               item.value &&
            //               item.formatter === utilities.toBoolean
            //             ) {
            //               item.value = 0 ? 'N' : 'Y';
            //             }
            //             break;
            //           case 'BLDGID':
            //             item.value = value;
            //             if (item.value) {
            //               item.disabled = true;
            //             } else {
            //               item.disabled = false;
            //             }
            //         }

            //         switch (item.control) {
            //           case EFormControl.CALENDAR:
            //             item.value = item.value
            //               ? new Date(item.value as string)
            //               : item.value;
            //             break;
            //           case EFormControl.INPUT:
            //             item.value = item.value
            //               ? item.value.toString().trim()
            //               : item.value;
            //             break;
            //           default:
            //             break;
            //         }
            //       }
            //     });
            //   });
            // }
          } else {
            utilities.setFormFieldValue(
              this.dynamicForm,
              'SuiteId',
              this.suiteId
            );
          }

          // set header values
          this.initializeHeader();
        },
        ({ error }) => {
          // set header values
          this.initializeHeader();
          this.alertService.apiError(error);
        }
      );
  }

  saveForm(formSections: IFormSection[]) {
    //call validation if not valid, exit
    let uniqueKey: string = 'Suite-Insert';
    let isUpdate = false;

    if (this.suiteId) {
      uniqueKey = 'Suite-Update';
      isUpdate = true;
    }

    // console.log('IFormSections: ', formSections);
    // // prepare values dictionary object
    // formSections.forEach((formSection) => {
    //   formSection.fields?.forEach((field) => {
    //     if (field.table === 'Suite') {
    //       suitTable[field.field] = field.value;
    //     } else if (field.table === 'SuiteAddition') {
    //       additionTable[field.field] = field.value;
    //     } else if (field.field === 'BLDGID') {
    //       suitTable[field.field] = field.value;
    //       additionTable[field.field] = field.value;
    //     } else if (field.field === 'SuiteId') {
    //       suitTable[field.field] = field.value;
    //       additionTable[field.field] = field.value;
    //     }

    //     if (field.field == 'SuiteId') {
    //       this.suiteId = field.value;
    //     }
    //     if (field.field == 'BLDGID') {
    //       this.buildingId = field.value;
    //     }
    //   });
    // });

    // console.log('suitTable:', suitTable, 'additionTable:', additionTable);

    // prepare form values object
    const formValues: any = utilities.setSaveFormValues(formSections, [
      'Suite',
      'SuiteAddition',
    ]);
    console.log('formValues: ', formValues);

    this.suiteId = utilities.getSectionFieldValue(formSections, 'SuiteId');
    this.buildingId = utilities.getSectionFieldValue(formSections, 'BLDGID');

    this.requestService
      .get<any[], any>('/Data/BulkSave', {
        uniqueKey: uniqueKey,
        tables: [
          {
            values: formValues.Suite,
            priority: 1,
            filters: isUpdate
              ? [
                  // {
                  //   field: 'SuiteId',
                  //   matchMode: 'equals',
                  //   operator: 'and',
                  //   value: this.suiteId,
                  // },
                  utilities.setAndFilter('SuiteId', this.suiteId),
                  // {
                  //   field: 'BLDGID',
                  //   matchMode: 'equals',
                  //   operator: 'and',
                  //   value: this.buildingId,
                  // },
                  utilities.setAndFilter('BLDGID', this.buildingId),
                ]
              : [],
          },
          {
            values: formValues.SuiteAddition,
            priority: 2,
            filters: isUpdate
              ? [
                  // {
                  //   field: 'SuiteId',
                  //   matchMode: 'equals',
                  //   operator: 'and',
                  //   value: this.suiteId,
                  // },
                  utilities.setAndFilter('SuiteId', this.suiteId),
                  // {
                  //   field: 'BLDGID',
                  //   matchMode: 'equals',
                  //   operator: 'and',
                  //   value: this.buildingId,
                  // },
                  utilities.setAndFilter('BLDGID', this.buildingId),
                ]
              : [],
          },
        ],
      })
      .subscribe(
        (data) => {
          if (data) {
            this.alertService.success('Data Saved Successfully.');
          }
          this.loadDataForEdit();
          //this.redirectToPage(true);
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  getHolds(request: IGridServerSideEvent = {}) {
    this.getHoldData(request).subscribe(
      (response) => {
        this.holds = response.records;
        // this.totalRecords = response.totalRecords;
      },
      ({ error }) => {
        this.alertService.apiError(error);
        this.holds = [];
      }
    );
  }

  getHoldData(request: IGridServerSideEvent) {
    if (!request.filters) {
      request.filters = [];
    }
    request.filters.push(
      //{
      //   field: 'SuiteId',
      //   matchMode: 'equals',
      //   operator: 'and',
      //   value: this.suiteId,
      // },
      utilities.setAndFilter('SuiteId', this.suiteId)
    );
    request.filters.push(
      //   {
      //   field: 'Type',
      //   matchMode: 'equals',
      //   operator: 'and',
      //   value: 'blank',
      // }
      utilities.setAndFilter('Type', 'blank')
    );
    request.filters.push(
      //   {
      //   field: 'Active',
      //   matchMode: 'equals',
      //   operator: 'and',
      //   value: 1,
      // }
      utilities.setAndFilter('Active', 1)
    );

    return this.requestService.get<any[], RequestDto>('/Data/Fetch', {
      uniqueKey: 'SuiteHold-Select-List',
      filters: request.filters,
      pageSize: request.pageSize,
      page: request.page,
    });
  }
  cancelForm(IFormSections: IFormSection[]) {
    console.log('invoked cancel form event');
  }

  redirectToPage(isSave: boolean = false) {
    if (this.isFromModal) {
      this.ref.close(isSave);
    } else {
      this.router.navigate(['suite-detail'], {
        queryParams: {
          suiteId: this.suiteId.trim(),
          buildingId: this.buildingId.trim(),
        },
      });
    }
  }

  handleServerSideEventChange(filter: IGridServerSideEvent) {
    //console.log('filter main', filter);
    this.getHolds(filter);
  }

  showModalForm(data: any) {
    // show edit page as modal popup
    const ref = this.dialogService.open(SuiteHoldComponent, {
      header: 'Edit From',
      width: '70%',
      data: { suiteId: data.SuitId, buildingId: data.BldgId },
    });
  }

  initializeHeader() {
    this.headers = {
      permissions: [
        { type: EPermissionType.VIEW, roles: ['SalesRepManager11'] },
      ],
      fields: [
        // {
        //   label: 'Suite Id',
        //   control: EFormControl.LABEL,
        //   value: this.suiteId,
        //   column: 3,
        // },
        this.headerService.addLabel({
          label: 'Suite Id',
          value: this.suiteId,
          column: 3,
        }),
        // {
        //   label: 'Building Id',
        //   control: EFormControl.LABEL,
        //   value: this.buildingId,
        //   column: 3,
        // },
        this.headerService.addLabel({
          label: 'Building Id',
          value: this.buildingId,
          column: 3,
        }),
        // {
        //   label: 'Building Name',
        //   control: EFormControl.LABEL,
        //   value: this.buildingName,
        //   column: 3,
        // },
        this.headerService.addLabel({
          label: 'Building Name',
          value: this.buildingName,
          column: 3,
        }),
        // {
        //   label: 'Unit Status',
        //   control: EFormControl.LABEL,
        //   value: this.unitStatus,
        //   column: 3,
        // },
        this.headerService.addLabel({
          label: 'Unit Status',
          value: this.unitStatus,
          column: 3,
        }),
        // {
        //   label: 'Test Button',
        //   value: 'Submit',
        //   control: EFormControl.BUTTON,
        //   class: EButtonClass.SUCCESS,
        //   column: 3,
        //   onClick: function () {
        //     console.log('button click event invoked');
        //   },
        // },
        this.headerService.addButton({
          label: 'Test Button',
          value: 'Submit',
          column: 3,
          class: EButtonClass.SUCCESS,
          onClick: function () {
            console.log('button click event invoked');
          },
        }),
      ],
    };
  }

  initializeSideBars() {
    this.rightSidebarItems = [
      {
        icon: 'pi pi-user-edit',
        section: 'scrollSuiteInfo',
        action: ESidebarAction.NAVIGATION,
      },
      {
        icon: 'pi pi-users',
        section: 'scrollLinks',
        action: ESidebarAction.NAVIGATION,
      },
      {
        icon: 'pi pi-copy',
        section: 'scrollHolds',
        action: ESidebarAction.NAVIGATION,
      },
      // {
      //   icon: 'pi pi-calendar',
      //   section: 'scrollContacts',
      //   action: ESidebarAction.NAVIGATION,
      // },
      // {
      //   icon: 'pi pi-copy',
      //   section: 'scrollMessages',
      //   action: ESidebarAction.NAVIGATION,
      // },
      // {
      //   icon: 'pi pi-clock',
      //   section: 'scrollNotification',
      //   action: ESidebarAction.NAVIGATION,
      // },
    ];

    // this.leftSidebarItems = [
    //   {
    //     icon: 'pi pi-user-edit',
    //     component: GridGlobalFiltersComponent,
    //     action: ESidebarAction.OPENDIALOG,
    //   },
    //   {
    //     icon: 'pi pi-user-plus',
    //     component: GridGlobalFiltersComponent,
    //     action: ESidebarAction.OPENDIALOG,
    //   },
    //   {
    //     icon: 'pi pi-calendar',
    //     component: GridGlobalFiltersComponent,
    //     action: ESidebarAction.OPENDIALOG,
    //   },
    //   {
    //     icon: 'pi pi-users',
    //     component: GridGlobalFiltersComponent,
    //     action: ESidebarAction.OPENDIALOG,
    //   },
    //   {
    //     icon: 'pi pi-copy',
    //     component: GridGlobalFiltersComponent,
    //     action: ESidebarAction.OPENDIALOG,
    //   },
    //   {
    //     icon: 'pi pi-clock',
    //     component: GridGlobalFiltersComponent,
    //     action: ESidebarAction.OPENDIALOG,
    //   },
    // ];
  }
}
