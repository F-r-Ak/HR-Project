import { Injectable, signal } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  HttpTransportType
} from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ClientType {
  Adder = 'Adder',
  Updater = 'Updater',
  General = 'General'
}

@Injectable({
  providedIn: 'root',
})
export class VisitorsNotervice {
  private hubUrl = 'http://info.aswan.gov.eg/hubs/VisitorNotification';
  autoScrollEnabled = signal<boolean>(true);
  private hubConnection!: HubConnection;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  private clientType: ClientType = ClientType.General;
  
  public notifications$: Observable<any[]> = this.notificationsSubject.asObservable();

  // Set client type before connecting
  setClientType(type: ClientType): void {
    this.clientType = type;
    console.log(`🎯 Client type set to: ${type}`);
  }

  async startConnection(token: string, senderId?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        console.log('✅ Already connected to hub');
        resolve(true);
        return;
      }

      // Clean up previous connection
      if (this.hubConnection) {
        this.hubConnection.off('NewVisitors');
        this.hubConnection.off('UpdateVisitors');
        this.hubConnection.off('ReceiveNotification');
        this.hubConnection.off('VisitorStatusChanged');
        this.hubConnection.stop().catch(() => {});
      }

      // Build URL with client type parameter
      let url = this.hubUrl;
      const params = new URLSearchParams();
      
      if (senderId) {
        params.append('senderId', senderId);
      }
      
      // Add client type to query string
      params.append('clientType', this.clientType);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log(`🔗 Connecting to hub as ${this.clientType}:`, url);

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: () => token,
          skipNegotiation: false,
          transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling,
          // Add client type to headers (alternative approach)
          headers: {
            'X-Client-Type': this.clientType
          }
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .build();

      // Set up event listeners
      this.setupEventListeners();

      this.hubConnection
        .start()
        .then(() => {
          console.log(`✅ Successfully connected to visitor hub as ${this.clientType}`);
          console.log('🔗 Connection ID:', this.hubConnection.connectionId);
          resolve(true);
        })
        .catch((err) => {
          console.error('❌ Connection failed:', err);
          // Use tryFallbackConnection method - fixed reference
          this.tryFallbackConnection(url, token, resolve, reject);
        });
    });
  }

  private tryFallbackConnection(url: string, token: string, resolve: any, reject: any): void {
    console.log('🔄 Trying fallback connection with LongPolling...');
    
    const fallbackConnection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => token,
        skipNegotiation: false,
        transport: HttpTransportType.LongPolling,
        headers: {
          'X-Client-Type': this.clientType
        }
      })
      .build();

    fallbackConnection
      .start()
      .then(() => {
        console.log('✅ Connected using LongPolling fallback');
        this.hubConnection = fallbackConnection;
        this.setupEventListeners();
        resolve(true);
      })
      .catch((fallbackErr) => {
        console.error('❌ Fallback connection also failed:', fallbackErr);
        reject(fallbackErr);
      });
  }

  private setupEventListeners(): void {
    if (!this.hubConnection) return;

    // Connection events
    this.hubConnection.onclose((error) => {
      console.log('🔌 Connection closed', error);
    });

    this.hubConnection.onreconnecting((error) => {
      console.log('🔄 Connection reconnecting...', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('✅ Connection reconnected. Connection ID:', connectionId);
    });

    // Application events
    this.hubConnection.on('NewVisitors', (notifications: any) => {
      console.log('🆕 Received notifications from NewVisitors event:', notifications);
      this.handleNewVisitors(notifications);
    });

    this.hubConnection.on('UpdateVisitors', (notifications: any) => {
      console.log('🔄 Received notifications from UpdateVisitors event:', notifications);
      this.handleUpdateVisitors(notifications);
    });

    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      console.log('📨 Received general notification:', notification);
      this.handleGeneralNotification(notification);
    });

    this.hubConnection.on('VisitorStatusChanged', (visitorData: any) => {
      console.log('📊 Visitor status changed:', visitorData);
      this.handleVisitorStatusChanged(visitorData);
    });
  }

  // Add specialized event handlers for client types
  onNewVisitorAdded(callback: (notification: any) => void): void {
    this.hubConnection?.on('NewVisitorAdded', callback);
  }

  onVisitorUpdated(callback: (notification: any) => void): void {
    this.hubConnection?.on('VisitorUpdated', callback);
  }

  // Event listener methods
  onUpdateVisitors(callback: (notifications: any) => void): void {
    this.hubConnection?.on('UpdateVisitors', callback);
  }

  onNewVisitors(callback: (notifications: any) => void): void {
    this.hubConnection?.on('NewVisitors', callback);
    
  }

  onNotificationReceived(callback: (notification: any) => void): void {
    this.hubConnection?.on('ReceiveNotification', callback);
  }

  onVisitorStatusChanged(callback: (visitorData: any) => void): void {
   
    this.hubConnection?.on('VisitorStatusChanged', callback);
   
  }

  // Notification handling methods
  private handleNewVisitors(notifications: any): void {
    try {
      const currentNotifications = this.notificationsSubject.value;
      let newNotifications = [];
      
      if (Array.isArray(notifications)) {
        newNotifications = notifications.map(notification => ({
          ...notification,
          id: notification.id || this.generateGUID(),
          timestamp: notification.timestamp || new Date().toISOString(),
          read: false,
          type: 'new-visitor'
        }));
      } else {
        newNotifications = [{
          ...notifications,
          id: notifications.id || this.generateGUID(),
          timestamp: notifications.timestamp || new Date().toISOString(),
          read: false,
          type: 'new-visitor'
        }];
      }
      
      const updatedNotifications = [...newNotifications, ...currentNotifications];
      console.log('🔄 handleNewVisitors - Before update:', currentNotifications.length);
      console.log('🔄 handleNewVisitors - Adding:', newNotifications.length);
      console.log('🔄 handleNewVisitors - After update:', updatedNotifications.length);
      
      this.notificationsSubject.next(updatedNotifications);
      
    } catch (error) {
      console.error('❌ Error handling new visitors:', error);
    }
  }

  private handleUpdateVisitors(notifications: any): void {
    try {
      console.log('🔄 Processing updated visitors:', notifications);
      
      const currentNotifications = this.notificationsSubject.value;
      let updatedNotifications = [...currentNotifications];
      
      if (Array.isArray(notifications)) {
        notifications.forEach(updatedNotification => {
          const index = updatedNotifications.findIndex(n => n.id === updatedNotification.id);
          if (index !== -1) {
            updatedNotifications[index] = {
              ...updatedNotifications[index],
              ...updatedNotification,
              updated: true,
              updateTimestamp: new Date().toISOString()
            };
          } else {
            updatedNotifications.push({
              ...updatedNotification,
              id: updatedNotification.id || this.generateGUID(),
              timestamp: updatedNotification.timestamp || new Date().toISOString(),
              read: false,
              type: 'updated-visitor'
            });
          }
        });
      } else {
        const index = updatedNotifications.findIndex(n => n.id === notifications.id);
        if (index !== -1) {
          updatedNotifications[index] = {
            ...updatedNotifications[index],
            ...notifications,
            updated: true,
            updateTimestamp: new Date().toISOString()
          };
        } else {
          updatedNotifications.push({
            ...notifications,
            id: notifications.id || this.generateGUID(),
            timestamp: notifications.timestamp || new Date().toISOString(),
            read: false,
            type: 'updated-visitor'
          });
        }
      }
      
      this.notificationsSubject.next(updatedNotifications);
      console.log('✅ Updated visitors processed successfully');
    } catch (error) {
      console.error('❌ Error handling updated visitors:', error);
    }
  }

  private handleGeneralNotification(notification: any): void {
    try {
      const currentNotifications = this.notificationsSubject.value;
      const newNotification = {
        ...notification,
        id: notification.id || this.generateGUID(),
        timestamp: notification.timestamp || new Date().toISOString(),
        read: false,
        type: 'general'
      };
      
      const updatedNotifications = [newNotification, ...currentNotifications];
      this.notificationsSubject.next(updatedNotifications);
      
      console.log('✅ General notification processed:', newNotification);
    } catch (error) {
      console.error('❌ Error handling general notification:', error);
    }
  }

  private handleVisitorStatusChanged(visitorData: any): void {
    try {
      console.log('📊 Processing visitor status change:', visitorData);
      
      const currentNotifications = this.notificationsSubject.value;
      const updatedNotifications = currentNotifications.map(notification => {
        if (notification.visitorId === visitorData.visitorId || notification.id === visitorData.id) {
          return {
            ...notification,
            status: visitorData.status,
            statusUpdateTime: visitorData.updateTime || new Date().toISOString(),
            updated: true
          };
        }
        return notification;
      });
      
      this.notificationsSubject.next(updatedNotifications);
      console.log('✅ Visitor status change processed');
    } catch (error) {
      console.error('❌ Error handling visitor status change:', error);
    }
  }

  // Connection management
  stopConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return this.hubConnection
        .stop()
        .then(() => {
          console.log('🔌 Disconnected from visitor hub');
        })
        .catch((err) => {
          console.error('❌ Disconnection error', err);
          throw err;
        });
    }
    return Promise.resolve();
  }

  // Hub methods
  NewUser(email: string): Promise<any> {
    if (!this.isConnected()) {
      return Promise.reject('Not connected to hub');
    }

    return this.hubConnection
      .invoke('NewUser', email)
      .then((data) => {
        console.log('✅ Notification sent successfully:', data);
        return data;
      })
      .catch((error) => {
        console.error('❌ Error sending notification:', error);
        throw error;
      });
  }

  ReadNotification(id: number): Promise<void> {
    if (!this.isConnected()) {
      return Promise.reject('Not connected to hub');
    }

    return this.hubConnection
      .invoke('ReadNotification', id)
      .then(() => {
        console.log('✅ Notification marked as read');
        // Update local state
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        );
        this.notificationsSubject.next(updatedNotifications);
      })
      .catch((error) => {
        console.error('❌ Error marking notification as read:', error);
        throw error;
      });
  }

  // Connection state methods
  getConnectionState(): HubConnectionState {
    return this.hubConnection?.state || HubConnectionState.Disconnected;
  }

  isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  getConnectionId(): string | null {
    return this.hubConnection?.connectionId || null;
  }

  // Get current client type
  getClientType(): ClientType {
    return this.clientType;
  }

  // Utility methods
  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Get current notifications
  getCurrentNotifications(): any[] {
    return this.notificationsSubject.value;
  }

  // Clear all notifications
  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  // Mark all as read
  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notificationsSubject.next(updatedNotifications);
    console.log('✅ All notifications marked as read');
  }

  // Add test notification manually
  addTestNotification(): void {
    const testNotification = {
      id: Date.now(),
      title: 'اختبار إشعار',
      message: 'هذا إشعار تجريبي من الخدمة',
      description: 'هذا إشعار تجريبي',
      createdDate: new Date().toLocaleString('ar-EG'),
      timestamp: new Date().toISOString(),
      icon: 'pi pi-info-circle',
      read: false,
      type: 'test'
    };
    
    console.log('🧪 Adding test notification from service...');
    this.handleGeneralNotification(testNotification);
  }

  // Method to manually test connection
  async testConnection(): Promise<boolean> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('❌ No access token found');
        return false;
      }

      const testSenderId = this.generateGUID();
      return await this.startConnection(token, testSenderId);
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  // Method to switch client type dynamically
  async switchClientType(newType: ClientType, token: string): Promise<boolean> {
    console.log(`🔄 Switching client type from ${this.clientType} to ${newType}`);
    
    // Stop current connection
    if (this.isConnected()) {
      await this.stopConnection();
    }
    
    // Set new client type
    this.setClientType(newType);
    
    // Start new connection with new type
    const senderId = this.generateGUID();
    return await this.startConnection(token, senderId);
  }
}