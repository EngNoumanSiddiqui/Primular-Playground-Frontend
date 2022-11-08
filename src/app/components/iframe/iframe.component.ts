import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IframeComponent implements OnInit, OnDestroy {
  url: any;
  id: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadIFrameData();
  }

  ngOnDestroy() {
    if (this.id) {
      const url: any = document.getElementById(this.id);
      this.ref.close(url.contentWindow.location.href);
    }
  }

  loadIFrameData() {
    if (
      this.config.data &&
      this.config.data.value &&
      this.config.data.iFrameId
    ) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.config.data.value
      );
      this.id = this.config.data.iFrameId;
    }
  }
}
