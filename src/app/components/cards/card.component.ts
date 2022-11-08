import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { IDynamicCard, IDynamicForm, IFile } from 'src/app/models';
import { GridService } from 'src/app/services/grid.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import * as utilities from '../../services/utilities.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Output() selectedCard: EventEmitter<any> = new EventEmitter();
  @Input() data: any = [];
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() card: IDynamicCard;
  dynamicForm: IDynamicForm;
  fileProp: IFile;
  showFiles: boolean = false;

  constructor(
    public dialogService: DialogService,
    private gridService: GridService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.card) {
      const { data, files, formSections } = this.card;
      this.data = this.gridService.setDataFields(data);
      this.dynamicForm = { formSections };
      this.fileProp = files;

      /** In case of when we are using this component for stand alone then if formSection is exist in 
          the this.card and then add in the data array. 
      */
      if (this.data) {
        this.data.forEach((x: any) => {
          if (!x.dynamicform) {
            x.dynamicform = JSON.parse(JSON.stringify(this.dynamicForm));
          }
          utilities.setCardFieldsData(x);
        });
      }

      const file = this.card?.files;
      if (
        file &&
        (file.allowDownloadFile ||
          file.allowDeleteFile ||
          file.allowEditableCaption)
      ) {
        this.showFiles = true;
      }
    }
  }

  dragAndDrop(event: any) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    event.item?.element?.nativeElement;
    this.card.data = this.data;
    this.card['change'] = true;
    if (this.card && this.card.onSort) {
      this.card.onSort(this.data);
    }
  }

  deleteImage(event) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Image?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'handlecolumnActions',
      accept: () => {
        if (this.data && event) {
          let arr = [...this.data];
          const index = arr.findIndex(
            (i) => i.blobfileurl === event.blobfileurl
          );
          let obj = arr[index];
          arr.splice(index, 1);
          this.data = [...arr];

          if (this.card && this.card.onDelete) {
            this.card.onDelete(obj);
          }
        }
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  saveCaption(event) {
    if (this.data && event) {
      let arr = [...this.data];
      const index = arr.findIndex((i) => i.blobfileurl === event.blobfileurl);
      let obj = arr[index];

      if (index !== -1) {
        obj.filecaption = event.caption;
        arr.splice(index, 1, obj);
        this.card.data = arr;
        this.card['change'] = true;
      }

      if (this.card && this.card.files?.onCaptionSave) {
        this.card.files.onCaptionSave(obj);
      }
    }
  }

  onClickEvent(data: any, index: number) {
    data['index'] = index;
    this.selectedCard.emit(data);
  }
}
