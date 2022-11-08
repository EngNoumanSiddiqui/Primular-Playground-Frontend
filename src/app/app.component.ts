import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { AlertService, RequestService } from '@churchillliving/se-ui-toolkit';
import { environment } from '../environments/environment';
import { IMenu } from '@churchillliving/se-ui-toolkit';
import { EPermissionType } from '@churchillliving/se-ui-toolkit';
import { SideBarService } from '@churchillliving/se-ui-toolkit';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  hiddenPanelMenu: boolean = true;
  items: IMenu[];
  currentRoute: string;
  pageTitle: string;
  isLoggedIn: boolean = false;
  detail: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private requestService: RequestService,
    private sideBarService: SideBarService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.detail = `API: ${environment.baseUrl}<br> Version: 1.0`;
    this.currentRoute = this.router.url;

    this.route.queryParams.subscribe((params: Params) => {
      if (params.navHidden) {
        const navHidden: string = params.navHidden;
        if (navHidden === 'true') {
          this.hiddenPanelMenu = false;
        }
      }
    });

    this.initializeMenu();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.isAuthenticated();
        this.currentRoute = event.urlAfterRedirects;

        this.setPageTitle();
        this.titleService.setTitle(this.pageTitle);
        this.initializeMenu();
      }
    });
  }

  /**
   * Initializes menu items.
   */
  initializeMenu() {
    this.items = [
      {
        label: 'Grids',
        icon: 'pi pi-fw pi-file',
        expanded: this.sideBarService.isMenuExpanded(
          this.currentRoute,
          this.items,
          'Grids'
        ),
        // permissions: [
        //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
        // ],
        items: [
          {
            label: 'Basic Grid',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: ['grid-basic'],
            disabled: false,
          },
          {
            label: 'Grid with lookup',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: ['grid-lookup'],
            hidden: false,
          },
          {
            label: 'Grid client side pagination',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: ['grid-client-side-pagination'],
            // permissions: [
            //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
            // ],
          },
          {
            label: 'Grid global filters',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: ['grid-global-filters'],
          },
          {
            label: 'Grid selection',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: ['grid-selection'],
          },
          {
            label: 'Grid with server side pagination',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: ['grid-server-side-pagination'],
          },
          {
            label: 'Grid actions',
            icon: 'pi pi-fw pi-external-link',
            routerLink: ['grid-actions'],
          },
        ],
      },
      {
        label: 'Forms',
        icon: 'pi pi-fw pi-pencil',
        expanded: this.sideBarService.isMenuExpanded(
          this.currentRoute,
          this.items,
          'Forms'
        ),
        // permissions: [
        //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
        // ],
        items: [
          {
            label: 'Upload Files',
            icon: 'pi pi-fw pi-align-left',
            routerLink: ['upload-files'],
          },
          {
            label: 'Dynamic form',
            icon: 'pi pi-fw pi-align-left',
            routerLink: ['dynamic-form'],
          },
          {
            label: 'Multi dynamic form',
            icon: 'pi pi-fw pi-align-right',
            routerLink: ['multi-dynamic-form'],
          },
          {
            label: 'Multi fetch form',
            icon: 'pi pi-fw pi-align-right',
            routerLink: ['multi-fetch-form'],
          },
          {
            label: 'Form with grid',
            icon: 'pi pi-fw pi-align-center',
            routerLink: ['form-with-grid'],
          },
          {
            label: 'Form with sidebar',
            icon: 'pi pi-fw pi-external-link',
            routerLink: ['form-with-sidebar'],
          },
        ],
      },
      {
        label: 'Suite',
        icon: 'pi pi-fw pi-user',
        expanded: this.sideBarService.isMenuExpanded(
          this.currentRoute,
          this.items,
          'Suite'
        ),
        // permissions: [
        //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
        // ],
        items: [
          {
            label: 'Suite list',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['suite-list'],
          },
          {
            label: 'Suite amen',
            icon: 'pi pi-fw pi-user-minus',
            routerLink: ['suite-amen'],
          },
          // {
          //   label: 'suite detail',
          //   icon: 'pi pi-fw pi-user-minus',
          //   routerLink: ['suite-detail']
          // },
        ],
      },
      {
        label: 'grid Lead',
        icon: 'pi pi-fw pi-calendar',
        expanded: this.sideBarService.isMenuExpanded(
          this.currentRoute,
          this.items,
          'grid Lead'
        ),
        // permissions: [
        //   { type: EPermissionType.VIEW, roles: ['SalesRepManager'] },
        // ],
        items: [
          {
            label: 'Grid lead',
            icon: 'pi pi-fw pi-calendar-plus',
            routerLink: ['grid-lead'],
          },
          {
            label: 'Grid lead sp',
            icon: 'pi pi-fw pi-calendar-minus',
            routerLink: ['grid-lead-sp'],
          },
        ],
      },
      {
        label: 'Test',
        icon: 'pi pi-fw pi-calendar-plus',
        // routerLink: ['grid-lead'],
        command: () => {
          console.log('test');
        },
      },
    ];
  }

  setPageTitle() {
    if (this.items && this.items.length > 0) {
      this.items.forEach((x) => {
        if (x.items) {
          x.items.forEach((item) => {
            if (this.currentRoute?.substring(1) == item.routerLink) {
              this.pageTitle = item.label;
            }
          });
        }
      });
    }
  }

  logOut() {
    this.requestService.get<any, any>('/Data/Logout', {}).subscribe(
      (res) => {
        this.authLogout();
        this.hiddenPanelMenu = false;
      },
      (error) => {
        this.authLogout();
      }
    );
  }

  authLogout() {
    this.authService.logout();
    this.alertService.success('Successfully LogOut .');
    this.router.navigate(['login']);
  }
  onClickEvent() {
    this.router.navigate(['webclock']);
  }
}
