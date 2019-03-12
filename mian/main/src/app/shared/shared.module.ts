import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { BannerComponent } from './banner/banner.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { SafeValuePipe } from '../common/pipe/safeValue.pipe';

const quillToolbarOptions = [
  [{ 'font': [] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }]                          // text direction
];

@NgModule({
  imports: [
    CommonModule,
    QuillModule.forRoot({
      modules: {
        toolbar: quillToolbarOptions
      }
    })
  ],
  declarations: [
    BannerComponent, DynamicComponent, SafeValuePipe],
  exports: [
    CommonModule,
    QuillModule,
    BannerComponent,
    SafeValuePipe
  ],
})
export class SharedModule { }
