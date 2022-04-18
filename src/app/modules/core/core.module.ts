import { NgModule } from "@angular/core";
import { ApiService } from './services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { OwlModule } from 'ngx-owl-carousel';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { TreeTableModule } from 'primeng/treetable';
// import {NgxPaginationModule} from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatSelectModule } from '@angular/material/select';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatChipsModule} from '@angular/material/chips';
// import {MatIconModule} from '@angular/material/icon';
// import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
// import { MatInputModule } from '@angular/material/input';
// import {
//     MatButtonModule,
//     MatCheckboxModule,
//     MatExpansionModule,
//     MatDatepickerModule,
//     MAT_DATE_LOCALE,
//     MAT_DATE_FORMATS,
//     DateAdapter,
//     MatFormFieldModule,
//     MatSelectModule,
//     MatSnackBarModule,
//     MatDialogModule,
//     MatIconModule,
//     MatInputModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatProgressSpinnerModule,
//     MatSortModule,
//     MatCardModule,
//     MatTabsModule,


// } from "@angular/material";
// import {
//     MatMomentDateModule,
//     MAT_MOMENT_DATE_FORMATS,
//     MomentDateAdapter
// } from "@angular/material-moment-adapter";

const appModules = [
    FormsModule, ReactiveFormsModule
    // , NgxPaginationModule
]

// const primesModules = [
//     TreeTableModule
// ]

// const materialModules = [
//     MatButtonModule,
//     MatCheckboxModule,
//     MatExpansionModule,
//     MatDatepickerModule,
//     // MatMomentDateModule,
//     MatFormFieldModule,
//     MatSelectModule,
//     MatSnackBarModule,
//     MatDialogModule,
//     MatIconModule,
//     MatInputModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatProgressSpinnerModule,
//     MatSortModule,
//     MatCardModule,
//     MatTabsModule,
//     MatStepperModule,
//     DragDropModule

// ];

@NgModule({
    imports: [
        MatDialogModule,
        // MatDialogModule,MatSelectInfiniteScrollModule,MatSelectModule,MatFormFieldModule,MatInputModule,MatAutocompleteModule,
        //  MatIconModule,MatChipsModule,
        appModules],
    exports: [
        MatDialogModule,
        // MatDialogModule,MatSelectInfiniteScrollModule,MatSelectModule,MatFormFieldModule,MatInputModule,MatAutocompleteModule
        // ,MatIconModule,MatChipsModule,
        appModules],
    providers: [ApiService]
})
export class CoreModule { }
