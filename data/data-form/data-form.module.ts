import { NgModule } from '@angular/core';
import { DataFormComponent } from './data-form.component';
import { CommonModule } from '@angular/common';
import { NgxClrFormControlModule } from '@azlabsjs/ngx-clr-form-control';
import { NgxSmartFormModule } from '@azlabsjs/ngx-smart-form';
import { NgxCommonModule } from '@azlabsjs/ngx-common';

@NgModule({
  declarations: [DataFormComponent],
  imports: [
    CommonModule,
    NgxSmartFormModule,
    NgxClrFormControlModule,
    NgxCommonModule,
  ],
  exports: [DataFormComponent],
})
export class DataFormModule {}
