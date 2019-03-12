import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShappingComponent } from './shapping.component';

const routers: Routes = [
{
    path: '',
    component: ShappingComponent
}
];

@NgModule({
    imports: [RouterModule.forChild(routers)],
    exports: [RouterModule]
})

export class ShappingRouterModule {}
