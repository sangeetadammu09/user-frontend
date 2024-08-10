import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './Components/user-list/user-list.component';
import { AddUserComponent } from './Components/add-user/add-user.component';
import { PagenotfoundComponent } from './Components/pagenotfound/pagenotfound.component';

const routes: Routes = [ 
  {path: 'add-user', component: AddUserComponent},
  {path: '', component: UserListComponent},
  {path: '**', component: PagenotfoundComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
