import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';

// locale
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import localeJaExtra from '@angular/common/locales/extra/ja';

// registerLocaleData(localeJa, 'ja', localeJaExtra);


// firebase
// import { FirebaseUIModule } from 'firebaseui-angular';
// import * as firebase from 'firebase';
// import * as firebaseui from 'firebaseui';
// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';


import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

// import * as firebase from 'firebase';
// import * as firebaseui from 'firebaseui';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { FirebaseUIModule, firebaseui, firebase } from 'firebaseui-angular';

// material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

// Component.Dialog
import { MessageDialogComponent } from './ViewItems/message-dialog/message-dialog.component';
import { SubjectAreaDialogComponent } from './ViewItems/subject-area-dialog/subject-area-dialog.component';

// Component
import { Route } from '@angular/compiler/src/core';
import { AppComponent } from './app.component';
import { TopComponent } from './hero/top/top.component';
import { UserMainComponent } from './user/user-main/user-main.component';
import { IntervalComponent } from './user/interval/interval.component';
import { AnalysisComponent } from './user/analysis/analysis.component';
import { SubjectDialogComponent } from './ViewItems/subject-dialog/subject-dialog.component';
import { SelectNextNextToGoDialogComponent } from './ViewItems/select-next-next-to-go-dialog/select-next-next-to-go-dialog.component';

import { LearningComponent } from './user/analysis/tabItem/learning/learning.component';
import { FinishedComponent } from './user/analysis/tabItem/finished/finished.component';
import { WorkItemViewComponent } from './ViewItems/work-item-view/work-item-view.component';
import { WorkCreateViewComponent } from './ViewItems/work-create-view/work-create-view.component';
import { IntervalItemViewComponent } from './ViewItems/interval-item-view/interval-item-view.component';
import { IntervalCreateViewComponent } from './ViewItems/interval-create-view/interval-create-view.component';
import { SideNaviMenuComponent } from './ViewItems/side-navi-menu/side-navi-menu.component';
import { UserLoginStateComponent } from './ViewItems/user-login-state/user-login-state.component';
import { LoginDialogComponent } from './ViewItems/login-dialog/login-dialog.component';


const routes: Routes = [
  { path: '', component: TopComponent },
  { path: 'user-main', component: UserMainComponent },
  { path: 'interval', component: IntervalComponent },
  { path: 'analysis', component: AnalysisComponent },
];


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  autoUpgradeAnonymousUsers: false, // 匿名認証ユーザー自動アップグレード
  signInFlow: 'popup', // redirect or popup
  signInOptions: [

    firebase.auth.GoogleAuthProvider.PROVIDER_ID,

    /*
    {
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
        auth_type: 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    */

    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,


    // firebase.auth.GithubAuthProvider.PROVIDER_ID,

    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },


    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,

    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],

  /*
  tosUrl: 'aaa',
  privacyPolicyUrl: 'プライバシーポリシーのURL',
  signInSuccessUrl: 'https://google.com',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  siteName: 'my-app',
  */
};

@NgModule({
  // app-xx Component
  declarations: [
    AppComponent,
    TopComponent,
    UserMainComponent,
    IntervalComponent,
    AnalysisComponent,
    MessageDialogComponent,
    SubjectAreaDialogComponent,
    SubjectDialogComponent,
    SelectNextNextToGoDialogComponent,
    LearningComponent,
    FinishedComponent,
    WorkItemViewComponent,
    WorkCreateViewComponent,
    IntervalItemViewComponent,
    IntervalCreateViewComponent,
    SideNaviMenuComponent,
    UserLoginStateComponent,
    LoginDialogComponent,
  ],
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: true,
        /*useHash: true, */
      }),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    // firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),　// FirebaseUI用のモジュール

    // material
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatStepperModule,
    MatTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    MatRadioModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],

  // not singleton Service
  // providers: [{ provide: LOCALE_ID, useValue: 'ja' }],
  // providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  providers: [],

  // entry point Component
  bootstrap: [AppComponent]
})

export class AppModule { }
