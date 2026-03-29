import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login/login';
import { Error } from './error';
import { ChangPasswordComponent } from './users';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'change-password', component: ChangPasswordComponent }

] as Routes;
