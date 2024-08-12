import { NgModule } from '@angular/core';
import { DataDetailComponent } from './data-detail.component';
import { CommonModule } from '@angular/common';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import { DataCommonModule } from '../common';
import { ArrayPipe } from './pipes';
@NgModule({
  imports: [CommonModule, NgxCommonModule, DataCommonModule],
  exports: [DataDetailComponent],
  declarations: [DataDetailComponent, ArrayPipe],
})
export class DataDetailModule {}
