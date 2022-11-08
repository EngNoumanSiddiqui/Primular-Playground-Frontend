import { Injectable } from '@angular/core';
import { EFormControl, IDynamicForm } from '../models';
import { AlertService } from './alert.service';
import { RequestService } from './request.service';
import * as utilities from 'src/app/services/utilities.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(
    private requestService: RequestService,
    private alertService: AlertService
  ) {}

  deleteImage(
    imageInfo: any,
    uniqueKey: string,
    dynamicForm: IDynamicForm,
    cardLabel: string
  ) {
    let imageToDelete =
      imageInfo.id && imageInfo.id > 0
        ? { UniqueKey: uniqueKey, RecordId: imageInfo.id }
        : { UniqueKey: uniqueKey, RecordId: imageInfo.suitimageid };
    this.requestService.get('/Upload/Delete', imageToDelete).subscribe(
      (response: any) => {
        this.deleteFile(imageInfo, dynamicForm, cardLabel);
        if (imageInfo.suitimageid > 0) {
          this.deleteImageFromTable(imageInfo.suitimageid, uniqueKey);
        } else {
          this.alertService.success('Image deleted successfully.');
        }
      },
      ({ error }) => {
        this.alertService.apiError(error);
      }
    );
  }

  deleteImageFromTable(suitImageId: any, uniqueKey: string) {
    this.requestService
      .get('/Data/Delete', {
        UniqueKey: uniqueKey,
        Id: suitImageId,
      })
      .subscribe(
        (response) => {
          this.alertService.success('Image deleted successfully.');
        },
        ({ error }) => {
          this.alertService.apiError(error);
        }
      );
  }

  getCardData(formSections: any, label: string): any {
    let arr = {};
    formSections.forEach((formSection: any) => {
      formSection.fields?.forEach((field: any) => {
        if (
          field.control === EFormControl.CARD &&
          field.label === label &&
          field.card.data
        ) {
          arr = { data: field.card.data, change: field.card.change };
        }
      });
    });
    return arr;
  }

  setFileUploadData(response: any, dynamicForm: any, label: string) {
    if (response) {
      dynamicForm.formSections.forEach((x: any) => {
        x.fields.forEach((field: any) => {
          if (field.control === EFormControl.CARD && field.label === label) {
            field.card?.data?.unshift(...response);
          }
        });
      });
    }
  }
  deleteFile(cardInfo: any, dynamicForm: IDynamicForm, label: string) {
    let cardData = this.getCardData(dynamicForm.formSections, label)?.data;
    cardData = [...this.deleteFromArray(cardData, cardInfo)];

    dynamicForm.formSections?.forEach((section) => {
      let card = section.fields.find(
        (x) => x.control === EFormControl.CARD && x.label === label
      );
      if (card && card.card) {
        card.card.data = cardData;
      }
    });
  }

  deleteFromArray(arr: any[] = [], cardInfo: any) {
    arr = utilities.setDataFields(arr);
    cardInfo = utilities.objConvertToLower(cardInfo);
    const index = arr.findIndex((i) => i.blobfileurl === cardInfo.blobfileurl);

    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
}
