import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {}

  success(message: string) {
    this.toastr.success(message, '', { closeButton: true });
  }

  info(message: string) {
    this.toastr.info(message, '', { closeButton: true });
  }

  warning(message: string) {
    this.toastr.warning(message, '', { closeButton: true });
  }

  error(error: string, message?: string) {
    this.toastr.error(error, message, { closeButton: true });
  }

  apiError(error: any) {
    if (typeof error === 'string' || typeof error.error === 'string') {
      typeof error.error === 'string'
        ? this.error(error.error)
        : this.error(error);
    } else if (error && error.error && error.error.errorDetails) {
      const [responseError] = error.error.errorDetails;
      this.error(responseError.errorMessage);
    } else if (error && error.headers && error.status !== 401) {
      this.error('something went wrong during api request');
    }
  }

  confirm({
    message = 'Are you sure that you want to proceed?',
    header = 'Confirmation',
    icon = 'pi pi-exclamation-triangle',
  } = {}): Promise<any> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message,
        header,
        icon,
        accept: () => {
          resolve([{ severity: 'info', summary: 'Confirmed:', detail: 'Yes' }]);
        },
        reject: () => {
          resolve([{ severity: 'info', summary: 'Rejected:', detail: 'No' }]);
        },
      });
    });
  }
}
