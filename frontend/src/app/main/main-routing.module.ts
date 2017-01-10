import {NgModule} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {ModuleContainerComponent} from "../modulecontainer/modulecontainer.component";
import {PlaceholderComponent} from "../placeholder/placeholder.component";
import {BrowserComponent} from "../browser/browser.component";
import {MainComponent} from "./main.component";

const mainRoutes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: ':id',
        component: ModuleContainerComponent,
      },
      {
        path: '',
        component: PlaceholderComponent,
      }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingComponent { }
