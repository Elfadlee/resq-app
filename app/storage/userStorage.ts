export type User = {
  id: string;
  name: string;
  jobTitle: string;
  area: string;
  phone: string;
  email: string;
  description: string;
  password: string;
  subscriptionPackage: string;
  subscriptionDuration: 'monthly' | 'quarterly';
  subscriptionPrice: number;
  token?:  string;
  createdAt: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  status: 'active' | 'expired';
};

let users: User[] = [];
let authToken: string | null = null;
let currentUser: User | null = null;

export const calcSubscriptionEnd = (
  start: string,
  duration: 'monthly' | 'quarterly'
) => {
  const end = new Date(start);
  if (duration === 'monthly') {
    end.setDate(end.getDate() + 30);
  } else {
    end.setDate(end.getDate() + 90);
  }
  return end. toISOString();
};

export const registerUser = (formData: {
  name: string;
  jobTitle: string;
  area: string;
  mobile: string;
  email: string;
  description: string;
  password: string;
  subscriptionPackage: string;
  subscriptionDuration: 'monthly' | 'quarterly';
  subscriptionPrice: number;
}): User => {
  const now = new Date().toISOString();
  const subscriptionEnd = calcSubscriptionEnd(now, formData.subscriptionDuration);

  const newUser: User = {
    id: `USER_${Date.now()}`,
    name: formData.name,
    jobTitle: formData. jobTitle,
    area: formData.area,
    phone: formData.mobile,
    email: formData.email,
    description: formData.description,
    password: formData.password,
    subscriptionPackage: formData.subscriptionPackage,
    subscriptionDuration: formData.subscriptionDuration,
    subscriptionPrice: formData.subscriptionPrice,
    createdAt: now,
    subscriptionStart: now,
    subscriptionEnd: subscriptionEnd,
    status: 'active',
    token: `TOKEN_${Date.now()}`,
  };

  users.push(newUser);
  currentUser = newUser;
  authToken = newUser.token || null;

  console.log('✅ تم تسجيل المستخدم:', newUser);
  console.log('📋 جميع المستخدمين:', users);
  console.log('💼 مستخدمي Business:', getBusinessUsers());

  return newUser;
};

export const loginUser = (mobile: string, password: string): User | null => {
  const user = users.find(u => u.phone === mobile && u. password === password);

  if (user) {
    authToken = user.token || `TOKEN_${Date.now()}`;
    currentUser = user;
    console.log('✅ تم تسجيل الدخول:', user);
    return user;
  }

  console. log('❌ فشل تسجيل الدخول');
  return null;
};

export const getCurrentUser = () => currentUser;

export const getAllUsers = () => users;

export const getBusinessUsers = () => {
  const businessUsers = users.filter(
    u => u.subscriptionPackage === 'أعمال' && u.status === 'active'
  );
  console.log('🔍 جلب مستخدمي Business:', businessUsers);
  return businessUsers;
};

export const getUserById = (id: string) => {
  return users.find(u => u. id === id);
};

export const saveToken = (token: string) => {
  authToken = token;
};

export const getToken = () => authToken;

export const logout = () => {
  authToken = null;
  currentUser = null;
  console.log('✅ تم تسجيل الخروج');
};

export const updateSubscriptionStatus = () => {
  const now = new Date();
  users.forEach(user => {
    const endDate = new Date(user.subscriptionEnd);
    if (endDate < now) {
      user.status = 'expired';
    }
  });
};