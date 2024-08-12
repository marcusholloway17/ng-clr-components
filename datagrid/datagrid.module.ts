import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxClrSmartGridModule } from '@azlabsjs/ngx-clr-smart-grid';
import { DatagridComponent } from './datagrid.component';
import { GridDataQueryProvider } from './datagrid.query.service';
import { DataGridStateType } from './types';
import { DATAGRID_CONFIG } from './tokens';

@NgModule({
  declarations: [DatagridComponent],
  imports: [CommonModule, NgxClrSmartGridModule],
  exports: [DatagridComponent, NgxClrSmartGridModule],
  providers: [GridDataQueryProvider],
})
export class DatagridModule {
  static forRoot(
    gridConfig: DataGridStateType
  ): ModuleWithProviders<DatagridModule> {
    return {
      ngModule: DatagridModule,
      providers: [
        {
          provide: DATAGRID_CONFIG,
          useFactory: () => {
            return (
              gridConfig ?? {
                pagination: { page: 'page', perPage: 'per_page' },
                pageSize: 20,
              }
            );
          },
        },
      ],
    };
  }
}
