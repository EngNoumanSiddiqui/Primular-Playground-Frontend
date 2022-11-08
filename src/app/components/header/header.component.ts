import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EFormControl } from '../../models';
import { EPermissionType, IPermission, IUserInfo } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IHeader } from '../../models/header.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() headers: IHeader;

  dynamicCase = EFormControl;
  roles: string[] = [];
  isHeaderHidden: boolean = false;

  constructor(
    private authService: AuthenticationService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.roles = this.authService.getUserRoles();
    // apply user role permissions on form
    this.applyUserPermissions();
  }

  ngOnChanges(): void {
    if (this.headers && this.headers.fields) {
      this.headers.fields.forEach((x) => {
        if (!x.showTime && !x.timeOnly && x.value?.match(/[0-9]+-\s?/g)) {
          x.value = this.datepipe.transform(x.value, 'yyyy-MM-dd');
        }
        if (x.value?.includes(':') && x.timeOnly) {
          const index = x.value.indexOf(':');
          const time = x.value.substring(index - 2, index + 6);
          x.value = time;
        }
      });
    }
  }

  // apply user role permissions
  applyUserPermissions() {
    if (this.headers) {
      let totalFields: number = 0;
      let hiddenFields: number = 0;

      this.headers.fields.forEach((headerField) => {
        let permissions: IPermission[] = headerField.permissions;
        if (!permissions) permissions = this.headers.permissions;
        let hasValidEditPermission = false;

        if (permissions && permissions.length > 0) {
          permissions.forEach((permission) => {
            let isValid: boolean = false;
            if (permission.roles && permission.roles.length > 0) {
              permission.roles.forEach((role) => {
                if (!isValid && this.roles && this.roles.includes(role)) {
                  isValid = true;
                }
              });
              if (
                permission.type === EPermissionType.VIEW &&
                !hasValidEditPermission
              ) {
                if (isValid) {
                  headerField.disabled = true;
                } else {
                  headerField.hidden = true;
                }
              } else if (permission.type === EPermissionType.EDIT) {
                if (isValid) {
                  hasValidEditPermission = true;
                  headerField.disabled = false;
                  headerField.hidden = false;
                } else {
                  headerField.disabled = true;
                }
              }
            }
          });
        }

        totalFields++;

        if (headerField.hidden) {
          hiddenFields++;
        }
      });

      this.isHeaderHidden = totalFields > 0 && totalFields === hiddenFields;
    }
  }
}
