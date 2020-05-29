import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

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

// Component.Dialog
import { LogintypeSelectorComponent } from './hero/top/logintypeSelector.component';
import { MessageDialogComponent } from './user/message-dialog/message-dialog.component';
import { SubjectAreaDialogComponent } from './user/user-main/subject-area-dialog/subject-area-dialog.component';

// Component
import { Route } from '@angular/compiler/src/core';
import { AppComponent } from './app.component';
import { TopComponent } from './hero/top/top.component';
import { UserMainComponent } from './user/user-main/user-main.component';
import { IntervalComponent } from './user/interval/interval.component';
import { AnalysisComponent } from './user/analysis/analysis.component';
import { SubjectDialogComponent } from './user/user-main/subject-dialog/subject-dialog.component';

const routes: Routes = [
  { path: '', component: TopComponent },
  { path: 'user-main', component: UserMainComponent },
  { path: 'interval', component: IntervalComponent },
  { path: 'analysis', component: AnalysisComponent },
];

@NgModule({
  // app-xx Component
  declarations: [
    AppComponent,
    TopComponent,
    UserMainComponent,
    IntervalComponent,
    AnalysisComponent,
    LogintypeSelectorComponent,
    MessageDialogComponent,
    SubjectAreaDialogComponent,
    SubjectDialogComponent,
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
    // material
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
  providers: [],

  // entry point Component
  bootstrap: [AppComponent]
})

export class AppModule { }
