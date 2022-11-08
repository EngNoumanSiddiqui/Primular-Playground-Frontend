import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from '../components/grid/grid.component';
import { RequestService } from '../services/request.service';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AppFilterComponent } from '../components/app-filter/app-filter.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppGlobalFilterComponent } from '../components/app-global-filters/app-global-filters.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FilterMenuComponent } from '.././components/filter-menu/filter-menu.component';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DynamicFormComponent } from '../components/dynamic-form/dynamic-form.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NotesComponent } from '../components/notes/notes.component';
import { AddRowDirective } from '../directives/add-row.directive';
import { AppDropDownComponent } from '../components/app-dropdown/app-dropdown.component';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MenuBarComponent } from '../components/menu-bar/menu-bar.component';
import { HeaderComponent } from '../components/header/header.component';
import { ImageGalleryComponent } from '../components/image-gallery/image-gallery.component';
import { GalleriaModule } from 'primeng/galleria';
import { LoaderComponent } from 'src/app/components/loader/loader.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { InputNumberModule } from 'primeng/inputnumber';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { CardComponent } from '../components/cards/card.component';
import { CardModule } from 'primeng/card';
import { CaptionComponent } from '../components/caption/caption.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { fileComponent } from '../components/file/file.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [
    GridComponent,
    AppGlobalFilterComponent,
    FilterMenuComponent,
    DynamicFormComponent,
    NotesComponent,
    AddRowDirective,
    AppDropDownComponent,
    AppFilterComponent,
    MenuBarComponent,
    SidebarComponent,
    HeaderComponent,
    ImageGalleryComponent,
    LoaderComponent,
    FileUploadComponent,
    CardComponent,
    CaptionComponent,
    fileComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TabViewModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TriStateCheckboxModule,
    InputTextareaModule,
    TooltipModule,
    PanelMenuModule,
    MenuModule,
    GalleriaModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    AccordionModule,
    ConfirmDialogModule,
    MessagesModule,
    InputNumberModule,
    AvatarModule,
    CardModule,
    DragDropModule,
    InputSwitchModule,
  ],
  exports: [
    GridComponent,
    AppFilterComponent,
    AppGlobalFilterComponent,
    FilterMenuComponent,
    DynamicFormComponent,
    NotesComponent,
    AppDropDownComponent,
    MenuBarComponent,
    SidebarComponent,
    HeaderComponent,
    ImageGalleryComponent,
    LoaderComponent,
    FileUploadComponent,
    CardComponent,
    CaptionComponent,
    fileComponent,
  ],
  providers: [RequestService, DialogService],
})
export class SharedModule {}
