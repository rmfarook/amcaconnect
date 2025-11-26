import { User } from '../types';

const USERS_KEY = 'ummah_users';
const CURRENT_USER_KEY = 'ummah_current_user';

export const authService = {
  // Register a new user
  register: (userData: any): { success: boolean; message: string; user?: User } => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if email already exists
    if (users.find((u: any) => u.email === userData.email)) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      gender: userData.gender,
      dob: userData.dob,
      address: userData.address,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Save user with password (in a real app, hash the password!)
    const userRecord = {
      ...newUser,
      password: userData.password 
    };

    users.push(userRecord);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return { success: true, message: 'Registration successful', user: newUser };
  },

  // Login
  login: (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Remove password before returning/storing in session
      const { password, ...safeUser } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return { success: true, message: 'Login successful', user: safeUser };
    }

    return { success: false, message: 'Invalid email or password.' };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current session
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};