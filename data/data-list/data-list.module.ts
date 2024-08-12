import { NgModule } from '@angular/core';
import { DataListComponent } from './data-list.component';
import { CommonModule } from '@angular/common';
import { DatagridModule } from '../../datagrid';
import { ClarityModule } from '@clr/angular';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import { DataCommonModule } from '../common';
import { DisabledActionPipe } from './pipes';

@NgModule({
  declarations: [DataListComponent, DisabledActionPipe],
  imports: [
    CommonModule,
    ClarityModule,
    DatagridModule,
    NgxCommonModule,
    DataCommonModule,
  ],
  exports: [DataListComponent],
})
export class DataListModule {}
