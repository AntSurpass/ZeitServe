import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StemComponent } from './stem.component';

const routes: Routes = [
    {
        path: '',
        component: StemComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StemRouterModule {

}

