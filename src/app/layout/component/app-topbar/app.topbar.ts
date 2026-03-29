import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';
import { LayoutService } from '../../service/layout.service';
import { VisitorsNotervice, ClientType } from '../../../pages/service/notification.service';
import { Subscription } from 'rxjs';
import { AuthHelper } from '../../../core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, BadgeModule],
  templateUrl: './app-topbar.html',
  styleUrl: './app-topbar.scss',
})
export class AppTopbar implements OnInit, OnDestroy {
  items!: MenuItem[];
  unreadNotifications = 0;
  private notificationSubscription!: Subscription;
  private userSub?: Subscription;
  userHasVisitorsModule = false;
  hasVisitorsItem = false;
  
  // Track which type of notifications this client should receive
clientRole: 'Adder' | 'Updater' | 'Both' = 'Both';

  notifications: any[] = [];
  userName: string = '';
 

  constructor(
    public layoutService: LayoutService,
    public visitorNot: VisitorsNotervice,
    private authHelper: AuthHelper,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {

    this.updateVisitorModuleFlags();
    // initialize username from AuthHelper if available
    try {
      this.userName = (this.authHelper && (this.authHelper as any).getName) ? (this.authHelper as any).getName() : '';
    } catch (e) {
      this.userName = '';
    }

    this.userSub = this.authHelper.userData$?.subscribe((user: any) => {
      this.updateVisitorModuleFlags();
      // prefer explicit user data, fallback to AuthHelper.getName()
      this.userName = user?.name || user?.fullName || (this.authHelper && (this.authHelper as any).getName ? (this.authHelper as any).getName() : '') || '';
    });
    
    // Determine client role based on user permissions or other logic
    this.determineClientRole();
    
    // Set client type before initializing connection
    await this.setClientTypeBasedOnRole();
    
    await this.initializeNotifications();
    this.setupNotificationSubscription();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    
    // Stop SignalR connection
    this.visitorNot.stopConnection().catch(error => {
      console.error('Error stopping connection in ngOnDestroy:', error);
    });
    
    console.log('🔌 AppTopbar destroyed, connections cleaned up');
  }

  private determineClientRole(): void {
    // Logic to determine if user should receive adder or updater notifications
    // This could be based on:
    // 1. User role/permissions
    // 2. Current page/route
    // 3. User preference
    // 4. Specific conditions
    
    // Example 1: Based on user permissions
    console.log('Determining client role based on user permissions',this.authHelper.hasRole('ادمن'));
    if (this.authHelper.hasRole('Admin')) {
      this.clientRole = 'Adder';

    } else if (this.authHelper.hasRole('SecretaryOffice')) {
      this.clientRole = 'Updater';
    }
    // } else {
    //   this.clientRole = 'Both'; // Default to both if no specific permission
    // }
    
    // Example 2: Based on current route
    // const currentRoute = this.router.url;
    // if (currentRoute.includes('/visitors/add')) {
    //   this.clientRole = 'Adder';
    // } else if (currentRoute.includes('/visitors/edit')) {
    //   this.clientRole = 'Updater';
    // }
    
    // console.log(`🎯 Client role determined as: ${this.clientRole}`);
  }

  private async setClientTypeBasedOnRole(): Promise<void> {
    let clientType: ClientType;
    console.log('Setting client type for role:', this.clientRole);
    
    switch(this.clientRole) {
      case 'Adder':
        clientType = ClientType.Adder;
        break;
      case 'Updater':
        clientType = ClientType.Updater;
        break;
      case 'Both':
        // For clients that should receive both, we need a strategy:
        // Option 1: Connect as General (receive all)
        // Option 2: Connect as Adder AND Updater (requires multiple connections)
        // We'll use Option 1 for simplicity
        clientType = ClientType.General;
        break;
      default:
        clientType = ClientType.General;
    }
    
    this.visitorNot.setClientType(clientType);
    console.log(`✅ Client type set to: ${clientType}`);
  }

  async initializeNotifications(): Promise<void> {
    const token = localStorage.getItem('accessToken');
   

    if (!token) {
      console.warn('No access token found for admin');
      return;
    }

    try {
      const senderId = this.visitorNot.generateGUID();
      const connectionResult = await this.visitorNot.startConnection(token, senderId);
      console.log('Admin connection initialized successfully:', connectionResult);
      
      // Set up event listeners for real-time notifications
      this.setupNotificationListeners();
      
    } catch (error) {
      console.error('Failed to initialize admin connection:', error);
    }
  }

  private setupNotificationSubscription(): void {
    // Subscribe to notifications observable
    this.notificationSubscription = this.visitorNot.notifications$.subscribe(
      (notifications) => {
        console.log('Received notifications from observable:', notifications);
        this.notifications = notifications;
        this.updateUnreadCount();
      }
    );
  }

  private updateVisitorModuleFlags(): void {
    this.userHasVisitorsModule = this.authHelper.hasModule('الزوار');
    // use the new page-based check
    this.hasVisitorsItem = this.authHelper.hasModulePage('الزوار', 'بحث الزوار');
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    console.log('📊 Unread count updated:', unreadCount);
    this.unreadNotifications = unreadCount;
  }

  private setupNotificationListeners(): void {
    // Listen for UpdateVisitors events
    this.visitorNot.onUpdateVisitors((notifications: any) => {
      console.log('UpdateVisitors received in component:', notifications);
      this.handleUpdateVisitors(notifications);
      this.updateUnreadCount();
    });

    // Listen for NewVisitors events
    this.visitorNot.onNewVisitors((notifications: any) => {
      console.log('NewVisitors received in component:', notifications);
      this.handleNewVisitors(notifications);
    
    });

    // Listen for general notifications
    this.visitorNot.onNotificationReceived((notification: any) => {
      console.log('General notification received in component:', notification);
      this.handleGeneralNotification(notification);
    });

    // Listen for visitor status changes
    this.visitorNot.onVisitorStatusChanged((visitorData: any) => {
      console.log('Visitor status changed in component:', visitorData);
      this.handleVisitorStatusChanged(visitorData);
        this.updateUnreadCount();
    });
  }

  private handleNewVisitors(notifications: any): void {
    // Check if this client should process new visitor notifications
    if (this.clientRole === 'Updater' && !this.clientRole.includes('Adder')) {
      console.log('⚠️ This client (Updater) received a NewVisitors notification, but will ignore it');
      return;
    }
    
    console.log('Processing NewVisitors in component:', notifications);
    this.showNotificationToast('زوار جدد', 'success');
  }

  private handleUpdateVisitors(notifications: any): void {
    // Check if this client should process update notifications
    console.log('Client role in handleUpdateVisitors:', this.clientRole);
    if (this.clientRole === 'Adder' && !this.clientRole.includes('Updater')) {
       this.updateUnreadCount();
      console.log('⚠️ This client (Adder) received an UpdateVisitors notification, but will ignore it');
      return;
    }
    
    console.log('Processing UpdateVisitors in component:', notifications);
    this.showNotificationToast('تم تحديث بيانات الزوار', 'info');
  }

  private handleGeneralNotification(notification: any): void {
    console.log('Processing general notification in component:', notification);
    this.showNotificationToast(notification.title || 'إشعار جديد', 'info');
  }

  private handleVisitorStatusChanged(visitorData: any): void {
    console.log('Processing visitor status change in component:', visitorData);
    this.showNotificationToast(`تم تغيير حالة الزائر: ${visitorData.status}`, 'warn');
  }

  private showNotificationToast(message: string, severity: string = 'info'): void {
    // You can integrate with PrimeNG toast service here
    console.log(`Toast: ${message} (${severity})`);
    
    // Example with PrimeNG toast (uncomment if you have ToastService)
    // this.messageService.add({
    //   severity: severity,
    //   summary: 'إشعار',
    //   detail: message,
    //   life: 3000
    // });
  }

  // UI Methods
  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ 
      ...state, 
      darkTheme: !state.darkTheme 
    }));
  }

  handleNotificationClick(notification: any) {
    // Mark as read
    if (!notification.read) {
      this.visitorNot.ReadNotification(notification.id).catch(error => {
        console.error('Failed to mark notification as read:', error);
        // Fallback: update locally
        notification.read = true;
        this.updateUnreadCount();
      });
    }
    
    console.log('Notification clicked:', notification);
    
    // Navigate if route is provided
    if (notification.route) {
      // this.router.navigate([notification.route]);
      console.log('Would navigate to:', notification.route);
    }
  }

  markAllAsRead() {
    this.visitorNot.markAllAsRead();
    this.updateUnreadCount();
    console.log('All notifications marked as read');
  }

  viewAllNotifications() {
    // Navigate to notifications page
    // this.router.navigate(['/notifications']);
    console.log('View all notifications');
  }

  handleLogOut() {
    console.log('logged out');
    // Stop SignalR connection
    this.visitorNot.stopConnection().catch(console.error);
    
    // Clear storage
    localStorage.setItem('id', '');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenData');
    localStorage.removeItem('organizationId');
    localStorage.clear();
    
    // Redirect
    location.href = '';
  }

  openChangePassword() {
     this.router.navigate(['/auth/change-password']);
  }

  isConnected(): boolean {
    return this.visitorNot.isConnected();
  }

  testConnection(): void {
    this.visitorNot.testConnection().then(success => {
      console.log('Connection test result:', success);
    });
  }

  // Helper method to get client type for display
  getClientTypeDisplay(): string {
    return this.visitorNot.getClientType() || 'Not set';
  }

  // Switch client role dynamically
  switchClientRole(newRole: 'Adder' | 'Updater' | 'Both'): void {
    this.clientRole = newRole;
    console.log(`🔄 Switching client role to: ${newRole}`);
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      let clientType: ClientType;
      switch(newRole) {
        case 'Adder': clientType = ClientType.Adder; break;
        case 'Updater': clientType = ClientType.Updater; break;
        case 'Both': clientType = ClientType.General; break;
      }
      
      this.visitorNot.switchClientType(clientType, token).then(success => {
        if (success) {
          console.log(`✅ Successfully switched to ${newRole} role`);
        } else {
          console.error(`❌ Failed to switch to ${newRole} role`);
        }
      });
    }
  }



  // Add these methods to your AppTopbar class

activeFilter: 'all' | 'new' | 'updated' = 'all';

// Filter notifications based on active filter
getFilteredNotifications(): any[] {
  if (this.clientRole === 'Adder') {
    return this.notifications.filter(n => n.type === 'new-visitor');
  } else if (this.clientRole === 'Updater') {
    return this.notifications.filter(n => n.type === 'updated-visitor');
  } else {
    // For 'Both' role, apply filter
    switch (this.activeFilter) {
      case 'new':
        return this.notifications.filter(n => n.type === 'new-visitor');
      case 'updated':
        return this.notifications.filter(n => n.type === 'updated-visitor');
      default:
        return this.notifications;
    }
  }
}

// Get appropriate icon for notification type
getNotificationIcon(notification: any): string {
  if (notification.icon) return notification.icon;
  
  switch (notification.type) {
    case 'new-visitor':
      return 'pi pi-user-plus';
    case 'updated-visitor':
      return 'pi pi-user-edit';
    default:
      return 'pi pi-bell';
  }
}

// Get notification title
getNotificationTitle(notification: any): string {
  if (notification.title) return notification.title;
  if (notification.description) return notification.description;
  
  switch (notification.type) {
    case 'new-visitor':
      return 'زائر جديد';
    case 'updated-visitor':
      return 'تحديث بيانات زائر';
    default:
      return 'إشعار جديد';
  }
}

// Get notification message
getNotificationMessage(notification: any): string {
  if (notification.message) return notification.message;
  if (notification.description) return notification.description;
  
  if (notification.visitorName) {
    return `الزائر: ${notification.visitorName}`;
  }
  
  return 'لديك إشعار جديد';
}

// Format notification time
formatNotificationTime(notification: any): string {
  const date = notification.createdDate || 
               notification.timestamp || 
               notification.time;
  
  if (!date) return 'قبل قليل';
  
  // Try to parse date
  const notificationDate = new Date(date);
  if (isNaN(notificationDate.getTime())) {
    return date; // Return as-is if not a valid date
  }
  
  const now = new Date();
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  
  // Format as date
  return notificationDate.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
}