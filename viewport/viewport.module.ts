import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ViewPortComponent } from './viewport.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ViewPortComponent],
  exports: [ViewPortComponent],
})
export class ViewportModule {}
