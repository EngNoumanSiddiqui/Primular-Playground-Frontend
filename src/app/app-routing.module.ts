import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridclientsidepaginationComponent } from './pages/grid-clientside-pagination/grid-clientside-pagination.component';
import { GridlookupComponent } from './pages/grid-lookup/grid-lookup.component';
import { GridpaginationComponent } from './pages/grid-pagination/grid-pagination.component';
import { GridViewComponent } from './pages/grid-view/grid-view.component';
import { GridGlobalFiltersComponent } from './pages/grid-global-filters/grid-global-filters.component';
import { LeadListComponent } from './pages/lead-list/lead-list.component';
import { LeadListSpComponent } from './pages/lead-list-sp/lead-list-sp.component';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { FormComponent } from './pages/form/form.component';
import { SuiteDetailComponent } from './pages/suite-detail/suite-detail.component';
import { SuiteAmenComponent } from './pages/suite-amen/suite-amen.component';
import { SuiteListComponent } from './pages/suite-list/suite-list.component';
import { SuiteReasonComponent } from './pages/suite-reason/suite-reason.component';
import { SuiteHoldComponent } from './pages/suite-hold/suite-hold.component';
import { ActiveGridComponent } from './pages/grid-actions/grid-actions.component';
import { GridSelectionComponent } from './pages/grid-selection/grid-selection.component';
import { MultiDynamicFormComponent } from './pages/multi-dynamic-form/multi-dynamic-form.component';
import { GridWithFormComponent } from './pages/grid-with-form/grid-with-form.component';
import { formWithSidebarComponent } from './pages/form-with-sidebar/form-with-sidebar.component';
import { formLogin } from './pages/form-login/form-login.component';
import { AuthGuard } from './services/guards/auth-guard.service';
import { WorkflowUserSelectionComponent } from './pages/shared/workflowuser-selection.component';
import { BuildingSelectionComponent } from './pages/shared/building-selection.component';
import { CodeSelectionComponent } from './pages/shared/code-selection.component';
import { MulitiFetchFormComponent } from './pages/muliti-fetch-form/muliti-fetch-form.component';
import { UploadFilesComponent } from './pages/upload-files/upload-files.component';

const routes: Routes = [
  {
    path: 'grid-basic',
    component: GridViewComponent,
    //canActivate: [AuthGuard],
  },
  { path: 'login', component: formLogin },
  { path: 'grid-lookup', component: GridlookupComponent },
  { path: 'grid-server-side-pagination', component: GridpaginationComponent },
  {
    path: 'grid-client-side-pagination',
    component: GridclientsidepaginationComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'grid-global-filters',
    component: GridGlobalFiltersComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'grid-selection',
    component: GridSelectionComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'dynamic-form',
    component: FormComponent,
    //canActivate: [AuthGuard]
  },
  { path: 'grid-lead', component: LeadListComponent },
  { path: 'grid-lead-sp', component: LeadListSpComponent },
  { path: 'grid-company', component: CompanyListComponent },
  { path: 'suite-detail', component: SuiteDetailComponent },
  { path: 'suite-amen', component: SuiteAmenComponent },
  { path: 'suite-hold', component: SuiteHoldComponent },
  { path: 'suite-list', component: SuiteListComponent },
  { path: 'suite-reason', component: SuiteReasonComponent },
  {
    path: 'grid-actions',
    component: ActiveGridComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'multi-dynamic-form',
    component: MultiDynamicFormComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'multi-fetch-form',
    component: MulitiFetchFormComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'form-with-grid',
    component: GridWithFormComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'upload-files',
    component: UploadFilesComponent,
    //canActivate: [AuthGuard],
  },
  { path: 'form-with-sidebar', component: formWithSidebarComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingAppComponents = [
  GridGlobalFiltersComponent,
  GridSelectionComponent,
  MultiDynamicFormComponent,
  MulitiFetchFormComponent,
  GridWithFormComponent,
  GridViewComponent,
  formWithSidebarComponent,
  GridlookupComponent,
  GridpaginationComponent,
  GridclientsidepaginationComponent,
  LeadListComponent,
  CompanyListComponent,
  LeadListSpComponent,
  SuiteReasonComponent,
  LeadListComponent,
  SuiteHoldComponent,
  SuiteAmenComponent,
  FormComponent,
  SuiteListComponent,
  SuiteDetailComponent,
  ActiveGridComponent,
  formLogin,
  WorkflowUserSelectionComponent,
  BuildingSelectionComponent,
  CodeSelectionComponent,
  UploadFilesComponent,
];
