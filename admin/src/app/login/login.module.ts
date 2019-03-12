import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppService } from '../app.service';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        loadChildren: '../admin/admin.module#AdminModule'
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes),
        NgZorroAntdModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [RouterModule],
    declarations: [LoginComponent]
})
export class LoginModule {
    
}