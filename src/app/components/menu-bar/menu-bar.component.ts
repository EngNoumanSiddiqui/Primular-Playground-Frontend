import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';
import { EPermissionType, IPermission, IUserInfo } from 'src/app/models';
import { IMenu } from 'src/app/models/menu.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent implements OnInit {
  @Input() hiddenPanelMenu: boolean = true;
  @Input() toolTip: string;
  @Input() menuBackColor: string;
  @Input() menuItems: IMenu[];
  @Input() menuFooter: string;
  @Input() menuTitle: string;
  @Output() onClickEvent: EventEmitter<any> = new EventEmitter();
  public menuBarItems: MenuItem[] = [];
  toggleMenu: boolean = false;
  roles: string[] = [];
  isMenubarHidden: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private cookieService: CookieService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    const toggleMenu = localStorage.getItem('toggleMenu');
    const cookieValue = this.cookieService.get('toggleMenu');

    if (toggleMenu) {
      this.toggleMenu = JSON.parse(toggleMenu);
    } else if (cookieValue) {
      this.toggleMenu = JSON.parse(cookieValue);
    }

    this.roles = this.authService.getUserRoles();

    // apply user role permissions
    this.applyUserPermissions();

    this.menuBarItems = this.menuItems.map((x) => ({
      ...x,
      style: x.hidden ? { display: 'none' } : x.style,
    }));
  }

  toggleSidebar() {
    this.toggleMenu = !this.toggleMenu;
    localStorage.setItem('toggleMenu', JSON.stringify(this.toggleMenu));
    this.cookieService.set('toggleMenu', JSON.stringify(this.toggleMenu));
  }

  clickEvent() {
    this.onClickEvent.emit();
  }

  // apply user role permissions
  applyUserPermissions() {
    if (this.menuItems) {
      let totalItems: number = 0;
      let hiddenItems: number = 0;

      this.menuItems.forEach((menu) => {
        if (menu.items) {
          menu.items.forEach((item) => {
            let permissions: IPermission[] = item.permissions;
            if (!permissions) permissions = menu.permissions;
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
                  if (permission.type === EPermissionType.VIEW) {
                    if (isValid) {
                      hasValidEditPermission = true;
                      item.disabled = false;
                      item.hidden = false;
                    } else {
                      item.hidden = true;
                    }
                  }
                }
              });
            }

            totalItems++;

            if (item.hidden) {
              item.style = { display: 'none' };
              hiddenItems++;
            }
          });

          // if all items of menu is hidden then hide menu as well
          menu.hidden =
            menu.items.length === menu.items.filter((x) => x.hidden).length;
        }
      });

      this.isMenubarHidden = totalItems > 0 && totalItems === hiddenItems;
    }
  }
}
