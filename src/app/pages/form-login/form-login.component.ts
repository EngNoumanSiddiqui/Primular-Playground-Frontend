import { Component, OnInit, Optional } from '@angular/core';
import {
  EFormControl,
  EValidator,
  IFormField,
  IDynamicForm,
  IFormSection,
} from '../../models/form.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Auth } from '../../models/auth.model';
import {
  RequestService,
  AuthenticationService,
  AlertService,
} from '@churchillliving/se-ui-toolkit';
import * as utilities from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
})
export class formLogin implements OnInit {
  url: string = '/api/Auth/login';
  id: any = '';
  userName: any;
  password: any;
  isFromModal: boolean = false;
  dynamicForm: IDynamicForm = {
    formSections: [
      {
        fields: [
          {
            label: 'User Name',
            field: 'CUserName',
            control: EFormControl.INPUT,
            value: '',
            validations: [
              { type: EValidator.REQUIRED, expression: '' },
              { type: EValidator.MINLENGTH, expression: 6 },
              { type: EValidator.MAXLENGTH, expression: 15 },
            ],
          },
          {
            label: 'Password',
            field: 'Password',
            value: '',
            control: EFormControl.PASSWORD,
            validations: [{ type: EValidator.REQUIRED, expression: '' }],
          },
        ],
      },
    ],
  };

  constructor(
    private requestService: RequestService,
    private authService: AuthenticationService,
    private alertService: AlertService,
    public router: Router,
    private route: ActivatedRoute,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {}

  saveForm(formSections: IFormSection[]) {
    formSections.forEach((formSection) => {
      formSection.fields?.forEach((field) => {
        if (field.field == 'CUserName') {
          this.userName = field.value;
        }
        if (field.field == 'Password') {
          this.password = field.value;
        }
      });
    });

    this.requestService
      .getAuth<any[], Auth>(this.url, {
        username: this.userName,
        password: this.password,
      })
      .subscribe(
        (response) => {
          if (response) {
            this.route.queryParams.subscribe((params: any) => {
              this.alertService.success('Successfully Login.');
              this.authService.login(response);

              if (params.returnUrl) {
                this.router.navigate([params.returnUrl]);
              } else {
                this.router.navigate(['dynamic-form']);
              }
            });
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  cancelForm(formSections: IFormSection[]) {
    utilities.closeIFrame();
    // this.redirectToPage();
  }

  redirectToPage(isSave: boolean = false) {
    if (this.isFromModal) {
      this.ref.close(isSave);
    } else {
      this.router.navigate(['/form-with-grid']);
    }
  }
}
