// auth.helper.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

export interface Permission {
  name: string;
  value: string;
}

export interface ModulePage {
  page: string;
  pagePermissions: string; // raw string from API (e.g. "[Add,Edit,View]")
}

export interface Module {
  name: string;
  // some endpoints previously used `items` property; we keep it optional for backward
  // compatibility but the current data model uses `pages`.
  pages?: ModulePage[];
  items?: ModulePage[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthHelper {
  private userData: any = null;
  public userData$ = new BehaviorSubject<any>(null);
  
  constructor() {
    this.loadUserData();
  }

  /**
   * Load user data from localStorage
   */
  private loadUserData(): void {
    try {
      const tokenData = localStorage.getItem("tokenData");
      if (tokenData) {
        this.userData = JSON.parse(tokenData);
        this.userData$.next(this.userData);
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error);
      this.userData = null;
      this.userData$.next(null);
    }
  }

  /**
   * Check if user has a specific module
   */
  hasModule(moduleLabel: string): boolean {
    console.log('Checking module for:', this.userData?.modules.map((m: Module) => m.name));
    if (!this.userData?.modules || !Array.isArray(this.userData.modules)) {
      return false;
    }

    return this.userData.modules.some((module: Module) => module.name === moduleLabel);
  }
getName(namelabel: string): string {
  console.log('Getting name:', this.userData?.name);
  return this.userData?.name === namelabel ? this.userData?.name : '';
  }
  /**
   * Check if user has a specific item within a module
   */
  /**
   * Check if user has access to a specific page inside a module.
   *
   * The API returns a `pages` array for each module where each entry
   * has a `page` property. Older versions used `items` so we also
   * support that field for backward compatibility.
   */
  hasModulePage(moduleLabel: string, pageLabel: string): boolean {
    if (!this.userData?.modules) {
      return false;
    }

    const module = this.userData.modules.find((m: Module) => m.name === moduleLabel);
    if (!module) {
      return false;
    }

    const pages: ModulePage[] = [];

    if (Array.isArray(module.pages)) {
      pages.push(...module.pages);
    }
    if (Array.isArray(module.items)) {
      // items used variable names similar to ModulePage after migration
      pages.push(...module.items);
    }

    return pages.some((p: ModulePage) => p.page === pageLabel);
  }

  /**
   * Check if user has specific permissions for a module
   */
  hasPermission(permissionName: string): boolean {
    console.log('Checking permission for:', this.userData);
    if (!this.userData?.permissions || !Array.isArray(this.userData.permissions)) {
      return false;
    }

    return this.userData.permissions.some((permission: Permission) => permission.name === permissionName);
  }

  hasModuleWithPermission(moduleLabel: string): boolean {
    return this.hasModule(moduleLabel) && this.hasPermission(moduleLabel);
  }

  /**
   * Return the list of actions a user may perform on a page (Add,Edit,View,etc).
   * This is a small wrapper around `getAllPermissions(pageName)` that always
   * returns a string array.
   */
  getPageActions(pageName: string): string[] {
    const perms = this.getAllPermissions(pageName);
    return Array.isArray(perms) ? perms as string[] : [];
  }

  /**
   * Convenience check for a specific action on a page.  Usage:
   *   authHelper.hasPageAction('المراسلات', 'Add');
   */
  hasPageAction(pageName: string, action: 'Add' | 'Edit' | 'View' | 'Delete'): boolean {
    const actions = this.getPageActions(pageName);
    console.log(`Checking page action for page "${pageName}":`, actions);
    return actions.includes(action);
  }

  /**
   * Legacy compatibility helper.  Some components still call
   * `hasModuleItem`; this simply delegates to `hasModulePage`.
   */
  hasModuleItem(moduleLabel: string, pageLabel: string): boolean {
    return this.hasModulePage(moduleLabel, pageLabel);
  }

  getAllModules(): Module[] {
    return this.userData?.modules || [];
  }

  /**
   * Return complete permissions list (raw objects) or, if a page name
   * is supplied, parse and return the actions available on that page.
   *
   * The API currently stores the allowed actions in the `value` field
   * as a string such as "[Add,Edit,View]".  This helper will attempt to
   * parse JSON first and fall back to a simple split in case the string
   * isn't valid JSON.
   */
  getAllPermissions(pageName?: string): Permission[] | string[] {
    const perms: Permission[] = this.userData?.permissions || [];
    if (!pageName) {
      return perms;
    }

    const match = perms.find(p => p.name === pageName);
    if (!match || !match.value) {
      return [];
    }

    // try parsing the value string (it should look like "[Add,Edit,View]")
    try {
      const parsed = JSON.parse(match.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // ignore and fall back to manual parsing below
    }

    const trimmed = match.value.replace(/^[\[\]\s]+|[\[\]\s]+$/g, "");
    return trimmed ? trimmed.split(',') : [];
  }

  /**
   * Return pages for a given module.  This replaces the previous
   * `getModuleItems` method and is recommended going forward.
   */
  getModulePages(moduleLabel: string): ModulePage[] {
    const module = this.userData?.modules?.find((m: Module) => m.name === moduleLabel);
    if (!module) {
      return [];
    }

    // prefer the new `pages` property but fall back to `items` for old data
    return module.pages || module.items || [];
  }

  // keep old name around for compatibility until callers are updated
  getModuleItems(moduleLabel: string): ModulePage[] {
    return this.getModulePages(moduleLabel);
  }

  hasAnyModule(moduleLabels: string[]): boolean {
    return moduleLabels.some(label => this.hasModule(label));
  }

  hasAllModules(moduleLabels: string[]): boolean {
    return moduleLabels.every(label => this.hasModule(label));
  }

  getLeaderOrg(): string | null {
    return this.userData?.isLeaderOrganization
    
  }

  getUserRole(): string | null {
    return this.userData?.role || null;
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

  
  getUserId(): string | null {
    return this.userData?.id || null;
  }

  getUserName(): string | null {
    return this.userData?.name || null;
  }

  getOrganizationId(): string | null {
    return this.userData?.organizationId || null;
  }

  getEmployeeId(): string | null {
    return this.userData?.employeeId || null;
  }

  /**
   * Clear user data
   */
  clearUserData(): void {
    this.userData = null;
    localStorage.removeItem("tokenData");
    this.userData$.next(null);
  }

  /**
   * Set user data (for testing or manual updates)
   */
  setUserData(userData: any): void {
    this.userData = userData;
    localStorage.setItem("tokenData", JSON.stringify(userData));
    this.userData$.next(this.userData);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.userData !== null;
  }

  /**
   * Get full user data
   */
  getUserData(): any {
    return this.userData;
  }

  /**
   * Debug method to print user data
   */
  debugUserData(): void {
    console.log('User Data:', this.userData);
    console.log('Modules:', this.userData?.modules);
    console.log('Permissions:', this.userData?.permissions);
    console.log('Role:', this.userData?.role);
  }
  
  /**
   * Force reload user data from storage and emit.
   */
  public refreshUserData(): void {
    this.loadUserData();
  }
}