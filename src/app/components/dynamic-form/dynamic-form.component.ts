import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  ComponentFactory,
  ViewContainerRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  EFormControl,
  EHyperlink,
  EValidator,
  IDictionary,
  IDynamicForm,
  IFormField,
  IFormSection,
} from 'src/app/models';
import { FormService } from '../../services/form.service';
import { AlertService } from '../../services/alert.service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotesComponent } from 'src/app/components/notes/notes.component';
import { EPermissionType, IPermission, IUserInfo } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as utilities from '../../services/utilities.service';
import { IframeComponent } from '../iframe/iframe.component';
import { Router } from '@angular/router';
import { IDynamicCard } from '@churchillliving/se-ui-toolkit';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  @Input() stickyActions: boolean = true;
  @Input() form: IDynamicForm;
  @Input() hideSaveButton: boolean = false;
  @Input() hideCancelButton: boolean = false;
  @Output() saveForm: EventEmitter<IFormSection[]> = new EventEmitter();
  @Output() cancelForm: EventEmitter<IFormSection[]> = new EventEmitter();
  @Output() dropDownChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  sectionClickedEvent: EventEmitter<IFormSection> = new EventEmitter();

  @ViewChildren('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer: QueryList<ViewContainerRef>;

  dynamicCase = EFormControl;
  permissionType = EPermissionType;
  roles: string[] = [];
  isFormDisabled: boolean = false;
  isFormHidden: boolean = false;
  componentsList: IDictionary[] = [];
  fileUploadUrl: string;
  showfileUploadError: boolean = false;
  setFileId: number;
  cardList: IDynamicCard;

  constructor(
    private authService: AuthenticationService,
    private formService: FormService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (
      this.form &&
      this.form.formSections &&
      this.form.formSections.length > 0
    ) {
      this.roles = this.authService.getUserRoles();
      this.removeWhiteSpaces();

      // start cardList reference break functionality
      let formValues = { ...this.form };
      formValues.formSections?.forEach((formSection) => {
        if (formSection.fields) {
          formSection.fields.forEach((field: any) => {
            if (field.control === EFormControl.CARD) {
              this.form = {};
              setTimeout(() => {
                field.card?.data?.forEach((x) => {
                  if (
                    field.card.formSections &&
                    field.card.formSections.length > 0
                  ) {
                    x.dynamicForm = {
                      formSections: JSON.parse(
                        JSON.stringify(field.card.formSections)
                      ),
                    };
                  }
                });
                this.form = formValues;
              }, 500);
            }
            // End cardList reference break functionality
            if (field.control === EFormControl.CHECKBOX) {
              field.value =
                field.value?.toString()?.toLowerCase() === 'true' ||
                field.value?.toString()?.toLowerCase() === 'y' ||
                field.value?.toString() === '1'
                  ? true
                  : false;
            }
          });
        }
      });

      // apply user role permissions on form
      this.applyUserPermissions();
      this.applyRequiredFieldValidation();
      this.setHyperlinkComponentRoute();
    }
  }

  /**
   * Checks if form has any field with dynamic component;
   * Creates component instance using componentFactoryResolver
   * Injects component through viewRef.createComponent()
   * Passes data to component
   * Subscribes to the events passed to the components
   * Finally forces Angular to detech changes
   */

  loadDynamicComponents() {
    this.componentsList = [];
    this.form?.formSections?.forEach((formSection) => {
      formSection.fields.forEach((field, fieldIndex) => {
        if (field.control === EFormControl.COMPONENT) {
          const viewRef = this.dynamicComponentContainer.find(
            (x) =>
              x.element.nativeElement.id == `${formSection.name}-${fieldIndex}`
          );
          const {
            component: Component,
            data,
            handlers,
          } = field.componentControl;
          const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
            Component
          );
          // Passing data to component
          const componentRef = viewRef.createComponent(componentFactory);
          Object.entries(data ?? {}).forEach(([key, value]) => {
            componentRef.instance[key] = value;
          });
          this.componentsList.push({
            name: field.componentControl?.id,
            value: componentRef,
          });
          // Subscribes to the events passed to the components
          if (handlers) {
            Object.entries(handlers).forEach(([event, handler]) => {
              (componentRef.instance[event] as EventEmitter<any>)?.subscribe(
                (response) => {
                  handler(response);
                }
              );
            });
          }
          // invoke change detection
          this.cdr.detectChanges();
        }
      });
    });
  }

  removeWhiteSpaces() {
    this.form?.formSections.forEach((section) => {
      if (section.class) section.class = section.class.replace(/\s/g, '');
    });
  }

  setHyperlinkComponentRoute() {
    this.form?.formSections?.forEach((formSection) => {
      formSection.fields.forEach((field) => {
        if (
          field.control === EFormControl.HYPERLINK &&
          field.hyperlink.component
        ) {
          this.router.resetConfig([
            {
              path: 'hyperlink' + field.label,
              component: field.hyperlink.component,
            },
            ...this.router.config,
          ]);
        }
      });
    });
  }

  ngAfterViewInit() {
    // load dynamic components if exist in form
    setTimeout(() => {
      this.loadDynamicComponents();
      this.onDynamicFormStateChange();
    }, 500);
  }

  /**
   * Listens any change in Dynamic Form component State
   */
  onDynamicFormStateChange() {
    utilities.onDynamicFormStateChange().subscribe((response) => {
      if (response.id && response.data) {
        const componentRefObj = this.componentsList.find(
          (x) => x.name === response.id
        );
        if (componentRefObj) {
          Object.entries(response.data ?? {}).forEach(([key, value]) => {
            componentRefObj.value.instance[key] = value;
          });
          componentRefObj.value.instance.ngOnInit();
        }
      }
    });
  }

  // apply user role permissions
  applyUserPermissions() {
    if (this.form && this.form.formSections) {
      let totalFields: number = 0;
      let disabledFields: number = 0;
      let hiddenFields: number = 0;

      this.form.formSections.forEach((formSection) => {
        if (formSection.fields) {
          formSection.fields.forEach((formField) => {
            let permissions: IPermission[] = formField.permissions;
            let sectionPermissions: IPermission[] = [];
            if (!permissions) sectionPermissions = formSection.permissions;
            if (!permissions) permissions = this.form.permissions;
            let hasValidEditPermission = false;

            if (sectionPermissions && sectionPermissions.length > 0) {
              sectionPermissions.forEach((permission) => {
                let isValid: boolean = false;
                permission.roles.forEach((role) => {
                  if (!isValid && this.roles && this.roles.includes(role)) {
                    isValid = true;
                  }

                  if (permission.type === EPermissionType.VIEW) {
                    if (isValid) {
                      formField.disabled = true;
                    } else {
                      formSection.hidden = true;
                    }
                  } else if (permission.type === EPermissionType.EDIT) {
                    if (isValid) {
                      formField.disabled = false;
                      formSection.hidden = false;
                    } else {
                      formSection.accordionDisabled = true;
                      formSection.disabled = true;
                      formField.disabled = true;
                    }
                  }
                });
              });
            } else if (permissions && permissions.length > 0) {
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
                      formField.disabled = true;
                    } else {
                      formField.hidden = true;
                    }
                  } else if (permission.type === EPermissionType.EDIT) {
                    if (isValid) {
                      hasValidEditPermission = true;
                      formField.disabled = false;
                      formField.hidden = false;
                    } else {
                      if (
                        formField.permissions &&
                        formField.permissions.length > 0
                      ) {
                        formSection.disabled = false;
                        formSection.accordionDisabled = true;
                        formField.disabled = true;
                      } else {
                        formSection.disabled = true;
                        formSection.accordionDisabled = true;
                        formField.disabled = true;
                      }
                    }
                  }
                }
              });
            }

            totalFields++;

            if (formField.disabled) {
              disabledFields++;
            }

            if (formField.hidden) {
              hiddenFields++;
            }
          });
        }
      });

      this.isFormDisabled = totalFields > 0 && totalFields === disabledFields;
      this.isFormHidden = totalFields > 0 && totalFields === hiddenFields;
    }
  }

  /**
   * Disabled the formSection
   */
  sectionDisabled(formSection: IFormSection) {
    if (formSection.disabled) {
      if (formSection.showAccordion) formSection.accordionDisabled = true;
      formSection.fields.map((field: IFormField) => {
        field.disabled = true;
      });
      return formSection;
    } else {
      return formSection;
    }
  }

  /**
   * Open IFrame in hyperlink Control
   */
  loadIFrame(formField: IFormField) {
    this.handleClickEvent(formField);
    const ref = this.dialogService.open(IframeComponent, {
      header: formField.hyperlink?.header
        ? formField.hyperlink?.header
        : formField.label,
      width: formField.hyperlink.width ? formField.hyperlink.width : '90%',
      height: formField.hyperlink.height ? formField.hyperlink.height : '80%',
      data: { value: formField.hyperlink.link, iFrameId: formField.label },
    });

    ref.onClose.subscribe((res) => {
      if (res) {
        if (formField.onReturn) {
          formField.onReturn(res);
        }
      }
    });
  }

  /**
   * open Dialog in hyperlink Control
   */
  hyperlinkDialog(formField: IFormField) {
    if (formField.hyperlink.target === EHyperlink.BLANK) {
      var value = formField.hyperlink.params;
      window.open('hyperlink' + formField.label);
    } else if (formField.hyperlink.target === EHyperlink.SELF) {
      this.router.navigate(['hyperlink' + formField.label], {
        queryParams: formField.hyperlink.params,
      });
    } else if (formField.hyperlink.target === EHyperlink.DIALOG) {
      this.onClickEvent(formField);
      const dialog = this.dialogService.open(formField.hyperlink.component, {
        header: formField.label,
        width: formField.hyperlink.width ? formField.hyperlink.width : '90%',
        height: formField.hyperlink.height ? formField.hyperlink.height : '80%',
        data: formField.hyperlink.params,
      });
      dialog.onClose.subscribe((res) => {
        if (res) {
          if (formField.onReturn) {
            formField.onReturn(res);
          }
        }
      });
    }
  }

  /**
   * open Iframe on Label
   */
  loadLabelControlIFrame(formField: IFormField) {
    const ref = this.dialogService.open(IframeComponent, {
      header: formField.label.name,
      width: formField.label.labelControl.hyperlink.width
        ? formField.hyperlink.width
        : '90%',
      height: formField.label.labelControl.hyperlink.height
        ? formField.hyperlink.height
        : '80%',
      data: {
        value: formField.label.labelControl.hyperlink.link
          ? formField.label.labelControl.hyperlink.link
          : '',
        iFrameId: formField.label.name,
      },
    });

    ref.onClose.subscribe((res) => {
      if (res) {
        if (formField.onReturn) {
          formField.onReturn(res);
        }
      }
    });

    if (formField && formField.onClick) {
      formField.onClick();
    }
  }

  /**
   * find the required field in form
   */
  applyRequiredFieldValidation() {
    this.form?.formSections?.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.validations && field.validations.length > 0) {
          field.validations.forEach((valid) => {
            if (valid.type === EValidator.REQUIRED) {
              field.requiredField = true;
            }
          });
        }
      });
    });
  }

  fileUrl(fileUrl: any) {
    if (fileUrl && fileUrl.length > 0) {
      this.fileUploadUrl = fileUrl;
      this.setFileId = fileUrl.id;
      this.showfileUploadError = false;
    }
  }
  fileIds: number[] = [];
  fileDeletedIds(ids: number[]) {
    if (ids && ids.length > 0) {
      this.fileIds = ids;
    }
  }

  onSaveForm() {
    this.form.formSections.forEach((formSection) => {
      if (formSection.fields) {
        formSection.fields.forEach((field) => {
          // set uploadFile URL in FormField in case of FILE_UPLOAD
          if (field.control === EFormControl.FILE_UPLOAD) {
            field.value = this.fileUploadUrl;

            if (field.validations && field.validations.length > 0) {
              field.validations.forEach((x) => {
                console.log('url:', field.value);
                if (x.type === EValidator.REQUIRED && !field.value) {
                  this.showfileUploadError = true;
                }
              });
            }
          }
        });
      }
    });

    let validity = true;
    this.form.formSections.forEach((formSection) => {
      if (formSection.fields) {
        if (!this.formService.checkValidity(formSection.fields)) {
          let field = formSection.fields.some(
            (field) => field.requiredField && field.errorMessage && !field.value
          );
          if (validity && field) {
            this.alertService.error(
              'Required fields are missing',
              'REQUIRED FIELD'
            );
          } else {
            this.alertService.error('Some fields are invalid', 'INVALID FIELD');
          }
          validity = false;
        }

        formSection.fields.forEach((field) => {
          if (field.control === EFormControl.CARD) {
            if (field.card && field.card.data?.length > 0) {
              let selectedData = field.card.data.filter(
                (x) => x.selectedCard && x.selectedCard.length > 0
              );
              if (selectedData && selectedData.length > 0) {
                field.card.data = selectedData;
              }
            }
          }
        });
      }
    });
    if (validity) {
      // set value as 1 or 0 in case of checkbox
      this.form.formSections?.forEach((formSection) => {
        if (formSection.fields && validity) {
          formSection.fields.forEach((field) => {
            if (field.value === '') {
              field.value = null;
            }
            if (field.control === EFormControl.CHECKBOX) {
              field.value = field.value ? 1 : 0;
            }
          });
        }
      });

      if (this.fileIds && this.fileIds.length > 0) {
        this.form.formSections['fileIds'] = this.fileIds;
      }
      this.saveForm.emit(this.form.formSections);
      this.form.formSections?.forEach((formSection) => {
        if (formSection.fields) {
          formSection.fields.forEach((field) => {
            if (field.control === EFormControl.CHECKBOX) {
              field.value = field.value === 1 ? true : false;
            }
          });
        }
      });
    }
  }

  onCancelForm() {
    this.cancelForm.emit(this.form.formSections);
    utilities.removeActiveIconClass();
  }

  /**
   * set the dynamic dialog data
   */
  setDialogData(formField: IFormField, data: any) {
    if (data && formField) {
      data = utilities.objConvertToLower(data);
      let selection: string = '';
      let value: any;
      if (formField.value && typeof formField.value === 'object') {
        if (
          formField.value &&
          formField.value.text &&
          formField.value.text.toString().trim()
        ) {
          selection = formField.value.text.toString().trim();
          if (formField.displayField) {
            value = formField.value.value.toString().trim();
          }
        }
      } else if (formField.value && formField.value.toString().trim()) {
        selection = formField.value.toString().trim();
      }

      return this.dialogService.open(data.component, {
        ...data.data,
        data: {
          selection: selection,
          field: formField.field,
          value: value,
          valueField: data.data?.valueField,
          ...data.data.data,
        },
      });
    }
  }

  /**
   * open dialog on lookupControl label
   */
  selectLookupLabel(formField: IFormField) {
    if (
      formField.label &&
      formField.label.labelControl &&
      formField.label.labelControl.lookupControl
    ) {
      const ref = this.setDialogData(
        formField,
        formField.label.labelControl.lookupControl
      );
      ref.onClose.subscribe(
        (res) => {
          formField.value = utilities.setDialogResponse(
            formField,
            formField?.label.labelControl.lookupControl,
            res
          );
          this.onFocusOutEvent(formField);
          if (formField.label.onReturn)
            formField.label.onReturn(formField.value);
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
    }
    this.onClickEvent(formField);
  }

  /**
   * open dialog on lookupControl field
   */
  selectLookupField(formField: IFormField) {
    if (formField.lookupControl) {
      const ref = this.setDialogData(formField, formField.lookupControl);
      ref.onClose.subscribe(
        (res) => {
          document.getElementById(formField.field).focus();
          if (res) {
            formField.value = utilities.setDialogResponse(
              formField,
              formField.lookupControl,
              res
            );
            this.onFocusOutEvent(formField);
            if (formField.onReturn) formField.onReturn(formField.value, res);
          }
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
    }
  }

  /**
   *  open dropdown options on tab
   */
  tabFocusEvent(formField) {
    const className = this.el.nativeElement.querySelector(
      '.' + formField.field
    );
    if (className) {
      className.click();
    }
  }

  /**
   * onClick event invoked
   */
  onClickEvent(formField: IFormField) {
    if (formField.onClick) {
      formField.onClick();
    }
  }

  /**
   * onClick event invoked && open Dialog on lookupControl field/label
   */
  handleClickEvent(formField: IFormField) {
    if (formField) {
      this.onClickEvent(formField);

      if (formField.lookupControl) {
        this.selectLookupField(formField);
        this.selectLookupLabel(formField);
      }
    }
  }

  /**
   * invoked section Clicked event
   */
  clickedSection(section: IFormSection) {
    this.sectionClickedEvent.emit(section);
  }

  /**
   * open dialog in Note_Field conrtrol
   */
  handleNoteFieldDialog(formfield: IFormField) {
    const dialogRef = this.dialogService.open(NotesComponent, {
      header: formfield.label as string,
      width: '50%',
      data: {
        value: formfield.value,
        disabledText: formfield.disabledText,
      },
    });

    dialogRef.onClose.subscribe(
      (data) => {
        if (data) {
          formfield.onReturn(data);
        }
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }

  setClassName(formField: IFormField): string {
    if (formField.hidden) return ' hidden';
    else return '';
  }

  autoSearch(event: any, formField: any) {
    if (formField && event) {
      formField.onReturn(event.query, formField);
    }
  }

  /**
   * invoked onFocusOut Event
   */
  onFocusOutEvent(formField: IFormField) {
    let record = {};
    this.form.formSections.forEach((section) => {
      section.fields.forEach((formField) => {
        if (formField.field) {
          record[formField.field] = formField.value;
        }
      });
    });

    utilities.setHyperlinkParamValue(record, this.form);
    if (formField && formField.onFocusOut) {
      this.formService.checkValidity([formField]);
      formField.onFocusOut(formField);
    }
  }

  onBackSpaceEvent(formField: IFormField) {
    if (typeof formField.value === 'object') {
      formField.value.text = formField.value.text.substring(
        0,
        formField.value.text.length - 1
      );
      if (formField.value.text.length === 1) {
        formField.value = undefined;
        this.formService.checkValidity([formField]);
      }
    }
    if (formField.value && formField.value.length === 1) {
      formField.value = undefined;
      this.formService.checkValidity([formField]);
    }
  }

  /**
   * clear the dropdown value when click on x
   */
  onClearValue(formField: IFormField, event: any) {
    this.dropDownChangeEvent.emit(formField);
    if (!event.value) {
      this.onFocusOutEvent(formField);
    }
  }

  typeOf(value) {
    return typeof value;
  }

  selectedCardClickEvent(data: any) {
    if (
      this.form &&
      this.form.formSections &&
      this.form.formSections.length > 0
    ) {
      this.form.formSections.forEach((section: any) => {
        section.fields.forEach((field: any) => {
          if (field.control === EFormControl.CARD) {
            if (field.card && field.card.data?.length > 0) {
              let obj = field.card.data[data.index];
              if (obj) {
                if (obj.selectedCard) {
                  delete obj.selectedCard;
                } else {
                  obj['selectedCard'] = 'card-active';
                }
              }
            }
          }
        });
      });
    }
    if (data.selectedCard) {
      data['selectedCard'] = '';
    } else {
      data['selectedCard'] = 'card-active';
    }
  }
}
