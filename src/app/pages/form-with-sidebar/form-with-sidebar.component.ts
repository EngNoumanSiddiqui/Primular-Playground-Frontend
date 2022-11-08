import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { EFormControl, EValidator, ESidebarAction } from 'src/app/models';
import { SelectionComponent } from '../grid-selection/selection.component';
import { GridlookupComponent } from '../grid-lookup/grid-lookup.component';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { IDynamicForm } from '../../models';
import { ISidebar } from '../../models/sidebar.model';
import * as utilities from '../../services/utilities.service';
import { EPermissionType } from 'src/app/models';
import { SideBarService } from 'src/app/services/sidebar.service';
import { Router } from '@angular/router';
import { GridSelectionComponent } from '../grid-selection/grid-selection.component';

@Component({
  selector: 'app-form-with-sidebar',
  templateUrl: './form-with-sidebar.component.html',
  styleUrls: ['./form-with-sidebar.component.scss'],
})
export class formWithSidebarComponent implements OnInit {
  iFrameLink: string = 'http://localhost:4200/dynamic-form?id=1';
  currentRoute: string;
  leftSidebarItems: ISidebar[] = [];
  rightSidebarItems: ISidebar[] = [];

  constructor(
    public dialogService: DialogService,
    private sideBarService: SideBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.initializeMenu();
  }

  initializeMenu() {
    this.leftSidebarItems = [
      {
        label: 'Phone',
        icon: 'pi pi-phone',
        section: 'thirdForm',
        tooltip: 'section 1',
        action: ESidebarAction.OPENDIALOG,
        component: GridViewComponent,
      },
      {
        label: 'Envelope',
        icon: 'pi pi-envelope',
        section: 'secondForm',
        action: ESidebarAction.IFRAME,
        iFrame: { link: this.iFrameLink },
      },
      {
        label: 'Bell',
        icon: 'pi pi-bell',
        section: 'firstForm',
        action: ESidebarAction.NAVIGATION,
      },
      {
        label: 'Left Sidebar 2',
        icon: 'pi pi-fw pi-file',
        section: 'Section 1',
        tooltip: 'Section 1',
      },
    ];

    this.rightSidebarItems = [
      {
        label: 'Phone',
        icon: 'pi pi-phone',
        section: 'thirdForm',
        tooltip: 'section 1',
        action: ESidebarAction.OPENDIALOG,
        component: GridViewComponent,
      },
      {
        label: 'Envelope',
        icon: 'pi pi-envelope',
        section: 'secondForm',
        // action: ESidebarAction.IFRAME,
        // iFrame: { link: this.iFrameLink },
        action: ESidebarAction.OPENDIALOG,
        component: GridSelectionComponent,
      },
      {
        label: 'Bell',
        icon: 'pi pi-bell',
        tooltip: 'section 1',
        section: 'firstForm',
        action: ESidebarAction.NAVIGATION,
      },
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        section: 'scrollContacts',
        action: ESidebarAction.NAVIGATION,
        //hidden: true,
      },
      {
        label: 'Copy',
        icon: 'pi pi-copy',
        section: 'scrollMessages',
        action: ESidebarAction.NAVIGATION,
        //disabled: true,
      },
      {
        label: 'Clock',
        icon: 'pi pi-clock',
        section: 'scrollNotification',
        action: ESidebarAction.NAVIGATION,
        //disabled: true,
      },
    ];
  }

  dynamicForm: IDynamicForm = {
    formSections: [
      {
        showAccordion: false,
        accordionDisabled: false,
        //expanded: true,
        hidden: false,
        class: 'firstForm',
        name: 'First Section With SideBar',
        icon: 'fa-solid fa-house-person-return',
        links: [
          {
            name: 'Add Referal',
            onClick: () => {
              console.log('Hello Referal.');
            },
          },
        ],
        fields: [
          {
            label: 'First Name',
            field: 'CFirstName',
            control: EFormControl.INPUT,
            value: '',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Last Name',
            field: 'LastName',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Age',
            field: 'Age',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINIMUM, expression: 18 },
              { type: EValidator.MAXIMUM, expression: 25 },
            ],
          },
          {
            label: 'Created Date',
            field: 'CreatedDate',
            value: '',
            control: EFormControl.CALENDAR,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Active',
            field: 'Active',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Email',
            field: 'Email',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              {
                type: EValidator.EMAIL,
              },
            ],
          },
          {
            label: 'Modified Date',
            field: 'ModifiedDate',
            value: '',
            control: EFormControl.CALENDAR,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Serial Number',
            field: 'SerialNumber',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Street Number',
            field: 'StreetNumber',
            value: null,
            control: EFormControl.DROPDOWN,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Total Orders',
            field: 'TotalOrders',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Lookup Control',
            field: 'LookupControl', // field that will be used for row selection
            value: 'Test13', // value that will be set as selected in row selection
            control: EFormControl.LOOKUP_INPUT,
            lookupControl: {
              component: SelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CFirstName',
                data: { codeType: 'Bedroom' },
              },
            },
          },
          {
            label: 'Building Notes',
            field: 'Notes',
            value: '',
            control: EFormControl.NOTE_FIELD,
            onReturn: function (note) {
              this.value = note;
            },
          },
        ],
      },
      {
        accordionDisabled: false,
        hidden: false,
        class: 'secondForm',
        name: 'Second Section With SideBar',
        icon: 'pi pi-fw pi-user-plus',
        links: [
          {
            name: 'Add Referal',
            onClick: () => {
              console.log('Hello Referal.');
            },
          },
        ],
        fields: [
          {
            label: 'First Name',
            field: 'CFirstName',
            control: EFormControl.INPUT,
            value: '',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Last Name',
            field: 'LastName',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Age',
            field: 'Age',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINIMUM, expression: 18 },
              { type: EValidator.MAXIMUM, expression: 25 },
            ],
          },
          {
            label: 'Created Date',
            field: 'CreatedDate',
            value: '',
            control: EFormControl.CALENDAR,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Active',
            field: 'Active',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Email',
            field: 'Email',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              {
                type: EValidator.EMAIL,
              },
            ],
          },
          {
            label: 'Modified Date',
            field: 'ModifiedDate',
            value: '',
            control: EFormControl.CALENDAR,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Serial Number',
            field: 'SerialNumber',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Street Number',
            field: 'StreetNumber',
            value: null,
            control: EFormControl.DROPDOWN,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Total Orders',
            field: 'TotalOrders',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Lookup Control',
            field: 'LookupControl', // field that will be used for row selection
            value: 'Test13', // value that will be set as selected in row selection
            control: EFormControl.LOOKUP_INPUT,
            lookupControl: {
              component: SelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CFirstName',
                data: { codeType: 'Bedroom' },
              },
            },
          },
          {
            label: 'Building Notes',
            field: 'Notes',
            value: '',
            control: EFormControl.NOTE_FIELD,
            onReturn: function (note) {
              this.value = note;
            },
          },
        ],
      },
      {
        accordionDisabled: false,
        hidden: false,
        class: 'thirdForm',
        name: 'Third Section With SideBar',
        icon: 'pi pi-fw pi-user-plus',
        links: [
          {
            name: 'Add Referal',
            onClick: () => {
              console.log('Hello Referal.');
            },
          },
        ],
        fields: [
          {
            label: 'First Name',
            field: 'CFirstName',
            control: EFormControl.INPUT,
            value: '',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Last Name',
            field: 'LastName',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Age',
            field: 'Age',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINIMUM, expression: 18 },
              { type: EValidator.MAXIMUM, expression: 25 },
            ],
          },
          {
            label: 'Created Date',
            field: 'CreatedDate',
            value: '',
            control: EFormControl.CALENDAR,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Active',
            field: 'Active',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Email',
            field: 'Email',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              {
                type: EValidator.EMAIL,
              },
            ],
          },
          {
            label: 'Modified Date',
            field: 'ModifiedDate',
            value: '',
            control: EFormControl.CALENDAR,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Serial Number',
            field: 'SerialNumber',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Street Number',
            field: 'StreetNumber',
            value: null,
            control: EFormControl.DROPDOWN,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Total Orders',
            field: 'TotalOrders',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
          {
            label: 'Lookup Control',
            field: 'LookupControl', // field that will be used for row selection
            value: 'Test13', // value that will be set as selected in row selection
            control: EFormControl.LOOKUP_INPUT,
            lookupControl: {
              component: SelectionComponent,
              data: {
                header: 'Grid selection',
                width: '80%',
                matchField: 'CFirstName',
                data: { codeType: 'Bedroom' },
              },
            },
          },
          {
            label: 'Building Notes',
            field: 'Notes',
            value: '',
            control: EFormControl.NOTE_FIELD,
            onReturn: function (note) {
              this.value = note;
            },
          },
        ],
      },
      {
        accordionDisabled: false,
        hidden: false,
        class: 'FourthForm',
        name: 'Fourth Section With SideBar',
        icon: 'pi pi-fw pi-user-plus',
        links: [
          {
            name: 'Add Referal',
            onClick: () => {
              console.log('Hello Referal.');
            },
          },
        ],
        fields: [
          {
            label: 'First Name',
            field: 'CFirstName',
            control: EFormControl.INPUT,
            value: '',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Last Name',
            field: 'LastName',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Age',
            field: 'Age',
            value: '',
            control: EFormControl.NUMERIC,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINIMUM, expression: 18 },
              { type: EValidator.MAXIMUM, expression: 25 },
            ],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Active',
            field: 'Active',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Email',
            field: 'Email',
            value: '',
            control: EFormControl.INPUT,
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              {
                type: EValidator.EMAIL,
              },
            ],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
          {
            label: 'Has Orders',
            field: 'HasOrders',
            value: null,
            control: EFormControl.CHECKBOX,
            validations: [],
          },
        ],
      },
    ],
  };
}
