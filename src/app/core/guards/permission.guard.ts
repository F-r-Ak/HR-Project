import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthHelper } from '../helpers/helper';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authHelper = inject(AuthHelper);
  const router = inject(Router);

  // Reload user data from localStorage to pick up any changes
  // (e.g., admin updated permissions and the client-side storage was updated)
  try {
    authHelper.refreshUserData();
  } catch (e) {
    // if refresh fails, continue using current data
    console.warn('Failed to refresh user data in permissionGuard', e);
  }

  const pageTitle = route?.data?.['pageTitle'] as string | undefined;
  const pageType = route?.data?.['pageType'] as string | undefined;

  // Map page types to required actions
  const actionRequired = pageType === 'add' ? 'Add' : pageType === 'edit' ? 'Edit' : null;

  if (!pageTitle || !actionRequired) {
    return true; // No specific action required for this route (e.g., list/view)
  }

  // Check if user has the required permission
  const hasPermission = authHelper.hasPageAction(pageTitle, actionRequired as 'Add' | 'Edit' | 'View' | 'Delete');

  if (!hasPermission) {
    router.navigate(['/error/403']);
    return false;
  }

  return true;
};
