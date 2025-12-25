import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id:  string;
  name: string;
  jobTitle: string;
  area: string;
  mobile: string; // ✅ Changed from 'phone' to 'mobile'
  email: string;
  description: string;
  password:  string;
  subscriptionPackage: string;
  subscriptionDuration: 'monthly' | 'quarterly';
  subscriptionPrice: number;
  token?: string;
  createdAt: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  status: 'active' | 'expired';
  profileImage?: string;
};

const USERS_KEY = 'allUsers';
const CURRENT_USER_KEY = 'userProfile'; // ✅ Same key as ProfileBanner
const TOKEN_KEY = 'userToken';

// 🔹 Load all users from AsyncStorage
export const loadUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// 🔹 Save all users to AsyncStorage
const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// 🔹 Save current user to AsyncStorage
const saveCurrentUser = async (user:  User): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(TOKEN_KEY, user.token || '');
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

// 🔹 Calculate subscription end date
export const calcSubscriptionEnd = (
  start: string,
  duration: 'monthly' | 'quarterly'
) => {
  const end = new Date(start);
  if (duration === 'monthly') {
    end.setMonth(end.getMonth() + 1);
  } else {
    end.setMonth(end. getMonth() + 3);
  }
  return end.toISOString();
};

// 🔹 Register new user
export const registerUser = async (formData: {
  name: string;
  jobTitle: string;
  area: string;
  mobile: string;
  email:  string;
  description: string;
  password: string;
  subscriptionPackage: string;
  subscriptionDuration: 'monthly' | 'quarterly';
  subscriptionPrice: number;
  profileImage?: string;
}): Promise<User> => {
  const now = new Date().toISOString();
  const subscriptionEnd = calcSubscriptionEnd(now, formData.subscriptionDuration);

  const newUser: User = {
    id: `USER_${Date.now()}`,
    name: formData.name,
    jobTitle: formData.jobTitle,
    area: formData.area,
    mobile: formData.mobile, // ✅ Fixed
    email: formData.email,
    description: formData.description,
    password: formData. password,
    subscriptionPackage: formData.subscriptionPackage,
    subscriptionDuration:  formData.subscriptionDuration,
    subscriptionPrice: formData.subscriptionPrice,
    createdAt: now,
    subscriptionStart: now,
    subscriptionEnd: subscriptionEnd,
    status: 'active',
    token: `TOKEN_${Date.now()}`,
    profileImage: formData.profileImage,
  };

  // ✅ Save to AsyncStorage
  const users = await loadUsers();
  users.push(newUser);
  await saveUsers(users);
  await saveCurrentUser(newUser);

  console.log('✅ تم تسجيل المستخدم:', newUser);
  return newUser;
};

// 🔹 Login user
export const loginUser = async (
  mobile: string,
  password: string
): Promise<User | null> => {
  const users = await loadUsers();
  const user = users.find(
    u => u.mobile === mobile && u.password === password
  );

  if (user) {
    await saveCurrentUser(user);
    console.log('✅ تم تسجيل الدخول:', user);
    return user;
  }

  console. log('❌ فشل تسجيل الدخول');
  return null;
};

// 🔹 Get current logged-in user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// 🔹 Get all users
export const getAllUsers = async (): Promise<User[]> => {
  return await loadUsers();
};

// 🔹 Get business users only
export const getBusinessUsers = async (): Promise<User[]> => {
  const users = await loadUsers();
  return users.filter(
    u => u.subscriptionPackage === 'أعمال' && u.status === 'active'
  );
};

// 🔹 Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const users = await loadUsers();
  return users.find(u => u.id === id) || null;
};

// 🔹 Get auth token
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

// 🔹 Logout user
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([CURRENT_USER_KEY, TOKEN_KEY]);
    console.log('✅ تم تسجيل الخروج');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// 🔹 Update user profile
export const updateUserProfile = async (
  updates:  Partial<User>
): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updates };
    
    // Update in users list
    const users = await loadUsers();
    const index = users.findIndex(u => u.id === currentUser. id);
    if (index !== -1) {
      users[index] = updatedUser;
      await saveUsers(users);
    }

    // Update current user
    await saveCurrentUser(updatedUser);
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};

// 🔹 Delete user account
export const deleteUserAccount = async (): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    // Remove from users list
    const users = await loadUsers();
    const filtered = users.filter(u => u.id !== currentUser.id);
    await saveUsers(filtered);

    // Clear current user
    await logout();
    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    return false;
  }
};

// 🔹 Update subscription status
export const updateSubscriptionStatus = async (): Promise<void> => {
  const users = await loadUsers();
  const now = new Date();
  
  let updated = false;
  users.forEach(user => {
    const endDate = new Date(user.subscriptionEnd);
    if (endDate < now && user.status === 'active') {
      user.status = 'expired';
      updated = true;
    }
  });

  if (updated) {
    await saveUsers(users);
  }
};