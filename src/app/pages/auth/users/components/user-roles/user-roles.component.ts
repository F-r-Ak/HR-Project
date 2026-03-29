import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Added import for HttpClient
import { CardModule } from 'primeng/card';
import { AccountService, PrimeDataTableComponent, PrimeTitleToolBarComponent } from '../../../../../shared';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { TableOptions } from '../../../../../shared/interfaces';
import { AddEditUserRoleComponent } from '../add-edit-user-role/add-edit-user-role.component';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [ RouterModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent extends BaseListComponent {
  @Input() userId: string = '';
  isEnglish = false;
  tableOptions!: TableOptions;
  service = inject(AccountService);
  http = inject(HttpClient); // Added HttpClient injection

  constructor(activatedRoute: ActivatedRoute) {
    super(activatedRoute);
  }

  override ngOnInit(): void {
    this.initializeTableOptions();
     console.log('User ID in UserRolesComponent:', this.userId);
    super.ngOnInit();
  }

  initializeTableOptions() {
    this.tableOptions = {
      inputUrl: {
        getAll: 'accounts/getuserrolespaged',
        getAllMethod: 'POST',
        delete: 'accounts/delete'
      },
      inputCols: this.initializeTableColumns(),
      inputActions: this.initializeTableActions(),
      permissions: {
        componentName: 'SONO-TRACKER-Marina-ORGANIZATION',
        allowAll: true,
        listOfPermissions: []
      },
      bodyOptions: {
        filter: {
          "id": this.userId
        }
      },
      responsiveDisplayedProperties: ['nameAr', 'nameEn']
    };
  }

  initializeTableColumns(): TableOptions['inputCols'] {
    return [
      {
        field:  'nameAr',
        header: 'اسم الصلاحية',
        filter: true,
        filterMode: 'text'
      },  
    ];
  }

  initializeTableActions(): TableOptions['inputActions'] {
    return [
      {
        name: 'DELETE',
        icon: 'pi pi-trash',
        color: 'text-error',
        allowAll: true,
        isCallBack: true, // Changed to callback
        call: (row) => {
            const payload = {
                userId: this.userId,
                roleId: row.id // Assuming row.id is the roleId
            };
            this.service.RemoveRoleFromUser(payload).subscribe({
                next: () => {
                    // Refresh the table after successful deletion
                    this.alert.success('تم إزالة الصلاحية بنجاح');
                    this.loadDataFromServer(); // Refresh data method from BaseListComponent
          
                },
                error: (err) => {
                    console.error('Error removing role from user:', err);
                }
            });
        }
      }
    ];
  }

  openAdd() {
    this.openDialog(AddEditUserRoleComponent, 'إضافة صلاحية', {
      pageType: 'add',
      row: { userId: this.userId }
    });
  }

  openEdit(rowData: any) {
    this.openDialog(AddEditUserRoleComponent, 'تعديل صلاحية', {
      pageType: 'edit',
      row: { rowData }
    });
  }

  /* when leaving the component */
  override ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
