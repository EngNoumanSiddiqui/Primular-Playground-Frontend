import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { IframeComponent } from 'src/app/components/iframe/iframe.component';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EPermissionType, IPermission, IUserInfo } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ESidebarAction, ISidebar } from '../../models/sidebar.model';
import { GridService } from 'src/app/services/grid.service';
import { HyperlinkService } from 'src/app/services/hyperlink.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  toggleMenu: boolean = false;
  openDialogs: DynamicDialogRef[] = [];
  @Input() navHidden: boolean = false;
  @Input() collapseSidebar: boolean = false;
  @Input() menuTitle: string;
  @Input() set sidebarItems(newSidebarItems: ISidebar[]) {
    if (newSidebarItems) {
      this.sidebarItemsList = newSidebarItems;
      this.initializeSideBar();
    }
  }

  public sidebarItemsList: ISidebar[] = [];
  public menuItems: MenuItem[] = [];
  roles: string[] = [];
  isSidebarHidden: boolean = false;

  constructor(
    private instance: Renderer2,
    private authService: AuthenticationService,
    public dialogService: DialogService,
    private hyperlinkService: HyperlinkService
  ) {}

  ngOnInit(): void {}

  initializeSideBar() {
    this.roles = this.authService.getUserRoles();

    // apply user role permissions
    this.applyUserPermissions();
    this.menuItems = this.sidebarItemsList.map((x: any) => ({
      label: x.label,
      icon: x.icon,
      id: x.id,
      section: x.section,
      expanded: x.expanded,
      action: x.action,
      items: x.items && x.items.length > 0 ? this.setMenuItems(x) : [],
      title: this.setMenuTitle(x),
      command: ({ item }) => {
        if (x.action && x.action === ESidebarAction.NAVIGATION) {
          this.navigateToSection(x, item);
        } else if (x.action && x.action === ESidebarAction.OPENDIALOG) {
          this.openDialog(x, item);
        } else if (x.action && x.action === ESidebarAction.IFRAME) {
          this.loadIFrame(x, item);
        } else {
          this.handleActiveItem(item);
        }
      },
      style: {
        borderBottom: '', // '1px solid #e9ecef',
        display: x.hidden ? 'none' : '',
      },
      onClick: x.onClick,
      onReturn: x.onReturn,
      disabled: x.disabled,
    }));
  }

  setMenuTitle(x: any): string {
    return x.tooltip ? x.tooltip : !x.label ? x.section : '';
  }

  setMenuItems(x: ISidebar): any {
    return x.items.map((menu) => ({
      label: menu.label,
      icon: menu.icon,
      id: menu.id,
      section: x.section,
      expanded: menu.expanded,
      title: this.setMenuTitle(x),
      command: ({ item }) => {
        if (x.action && x.action === ESidebarAction.NAVIGATION) {
          this.navigateToSection(menu, item);
        } else if (menu.action && menu.action === ESidebarAction.OPENDIALOG) {
          this.openDialog(menu, item);
        } else if (menu.action && menu.action === ESidebarAction.IFRAME) {
          this.loadIFrame(menu, x);
        }
        this.handleActiveItem(item);
      },
      style: {
        borderBottom: '', // '1px solid #e9ecef',
        display: menu.hidden ? 'none' : '',
      },
      onClick: menu.onClick,
      onReturn: menu.onReturn,
      disabled: menu.disabled,
    }));
  }

  loadIFrame(menu: ISidebar, item: any) {
    if (menu) {
      const dialogRef = this.dialogService.open(IframeComponent, {
        header: menu.section,
        width: menu.iFrame.width ? menu.iFrame.width : '90%',
        height: menu.iFrame.height ? menu.iFrame.height : '80%',
        data: { value: menu.iFrame.link, iFrameId: menu.section },
      });

      this.handleActiveItem(item);

      dialogRef.onClose.subscribe((data: any) => {
        this.handleActiveItem(item, false);
        if (data && menu.onReturn) {
          menu.onReturn(data);
        }
      });
    }
  }

  toggleSidebar() {
    this.toggleMenu = !this.toggleMenu;
    localStorage.setItem('toggleMenu', JSON.stringify(this.toggleMenu));
  }

  // apply user role permissions
  applyUserPermissions() {
    if (this.sidebarItemsList) {
      let totalItems: number = 0;
      let hiddenItems: number = 0;

      this.sidebarItemsList.forEach((item, index) => {
        let permissions: IPermission[] = item.permissions;
        let hasValidEditPermission = false;

        item.id = index.toString();
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
                  item.disabled = true;
                } else {
                  item.hidden = true;
                }
              } else if (permission.type === EPermissionType.EDIT) {
                if (isValid) {
                  hasValidEditPermission = true;
                  item.disabled = false;
                  item.hidden = false;
                } else {
                  item.disabled = true;
                }
              }
            }
          });
        }

        totalItems++;

        if (item.hidden) {
          hiddenItems++;
        }
      });

      this.isSidebarHidden = totalItems > 0 && totalItems === hiddenItems;
    }
  }

  /**
   *
   * @ param menu
   * @ param item
   * Passes the sidebar array to contain all ISidebar property like
   * Passes the event of the menu
   */
  openDialog(menu: ISidebar, item: any): void {
    const menuData = menu.data ? menu.data : menu;
    if (menu.component) {
      const dialogRef: DynamicDialogRef = this.dialogService.open(
        menu.component,
        menuData
      );
      this.openDialogs.push(dialogRef);
      this.handleActiveItem(item);

      if (this.openDialogs && this.openDialogs.length > 1) {
        this.openDialogs[0].close();
        this.openDialogs.shift();
      }

      dialogRef.onClose.subscribe((data: any) => {
        this.handleActiveItem(item, false);
        if (data && menu.onReturn) {
          menu.onReturn(data);
        }
      });
    }
  }

  /**
   *
   * @ param x
   * @ param item
   * Passes the sidebar array to contain all ISidebar property like
   * Passes the event of the menu
   */
  navigateToSection(x: ISidebar, item: any): void {
    this.instance
      .selectRootElement(`.${x.section.replace(/\s/g, '')}`, true)
      .scrollIntoView({ behavior: 'smooth' });
    this.handleActiveItem(item);
  }

  /**
   *
   * @param item
   * Passes the event of the menu
   */
  handleActiveItem({ icon }: any, closeDialog: boolean = true): void {
    this.menuItems = this.menuItems.map((x) =>
      x.icon === icon && closeDialog
        ? { ...x, styleClass: 'active-icon' }
        : {
            ...x,
            styleClass: '',
            style: {
              borderBottom: '1px solid #e9ecef',
              display: x.style?.display === 'none' ? 'none' : '',
            },
          }
    );
  }

  clickedMenu(menu: MenuItem[]) {
    menu.map((item: ISidebar) => {
      const matchedItem = this.sidebarItemsList.find((x) => x.id == item.id);
      if (
        item.styleClass === 'active-icon' &&
        matchedItem &&
        matchedItem.onClick
      ) {
        this.hyperlinkService
          .addHyperlinks(matchedItem)
          .then((response: any) => {
            if (matchedItem.linkId) {
              this.hyperlinkService.setSidebarLink(
                response,
                this.sidebarItemsList
              );
            } else {
              matchedItem.onClick(item);
            }
          });
      }
    });
  }
}
