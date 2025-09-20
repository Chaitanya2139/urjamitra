// Mock authentication system to replace Firebase
export interface MockUser {
  uid: string;
  email: string;
  displayName?: string;
}

class MockAuth {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    // Call immediately with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      this.currentUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };
      
      // Notify all listeners
      this.listeners.forEach(listener => listener(this.currentUser));
      
      return { user: this.currentUser };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      this.currentUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };
      
      // Notify all listeners
      this.listeners.forEach(listener => listener(this.currentUser));
      
      return { user: this.currentUser };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async signOut(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentUser = null;
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(null));
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }
}

export const mockAuth = new MockAuth();
