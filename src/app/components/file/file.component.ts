import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ESelectFileType } from 'src/app/models';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class fileComponent implements OnInit {
  @Input() url: string = '';
  @Input() caption: string = '';
  @Input() width: string = '';
  @Input() height: string = '200px';
  @Output() onDeleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() onSaveEvent: EventEmitter<any> = new EventEmitter();
  @Input() id: number;
  @Input() name: string = '';
  @Input() type: any;
  @Input() allowDownloadFile: boolean = false;
  @Input() allowEditableCaption: boolean = false;
  @Input() allowDeleteFile: boolean = false;
  editableCaption: boolean = false;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.checkFileExtension();
  }

  checkFileExtension() {
    switch (this.type) {
      case 'png':
      case 'jpeg':
      case 'jfif':
      case 'jpg': {
        this.type = ESelectFileType.IMAGE;
        break;
      }
      case 'xlsx':
      case 'xls':
      case 'xlsm':
      case 'txt': {
        this.type = ESelectFileType.EXCEL;
        break;
      }
      case 'pdf':
      case 'html': {
        this.type = ESelectFileType.PDF;
        break;
      }
      case 'doc':
      case 'docx': {
        this.type = ESelectFileType.DOCUMENT;
        break;
      }
    }
  }

  downloadFile(url: string) {
    const link: any = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

  captionClickEvent() {
    if (this.allowEditableCaption) {
      this.editableCaption = true;
    }
  }

  captionSave(
    id: number,
    name: string,
    url: string,
    type: any,
    caption: string
  ) {
    let obj = {
      id: id,
      name: name,
      blobfileurl: url,
      type: type,
      caption: caption,
    };
    if (caption !== null) {
      this.caption = caption;
      this.editableCaption = false;
      this.onSaveEvent.emit(obj);
    }
  }

  onDeleteFile(
    id: number,
    name: string,
    url: string,
    type: any,
    caption: string
  ) {
    let obj = {
      id: id,
      name: name,
      blobfileurl: url,
      type: type,
      caption: caption,
    };
    this.onDeleteEvent.emit(obj);
  }

  cancel() {
    this.editableCaption = false;
  }
}
