import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiflowComponent } from './uiflow.component';

const routes: Routes = [
    {
        path: '',
        component: UiflowComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UIflowRouterModule {

}

