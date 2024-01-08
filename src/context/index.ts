import { getCurrentUser } from '@/lib/appwrite/api';
import { ref, provide, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Your IUser interface definition
interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
}


export const INITIAL_USER: IUser = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
};

const initialContext = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};

export const AuthContextSymbol = Symbol();

interface IAuthContext {
  user: IUser;
  isLoading: boolean;
  setUser: (user: IUser) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkAuthUser: () => Promise<boolean>;
}

export const useAuthContext = (): IAuthContext => {
  const authContext = inject<IAuthContext>(AuthContextSymbol);
  if (!authContext) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return authContext;
};

export function provideAuthContext() {
  const router = useRouter();

  const user = ref<IUser>({ ...INITIAL_USER });
  const isLoading = ref(false);
  const isAuthenticated = ref(false);

  const checkAuthUser = async (): Promise<boolean> => {
    isLoading.value = true;
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        Object.assign(user, { ...currentAccount });
        isAuthenticated.value = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    const cookieFallback = localStorage.getItem('cookieFallback');
    if (!cookieFallback || cookieFallback === '[]' || cookieFallback === null || cookieFallback === undefined) {
      router.push('/sign-in');
    }
    
    checkAuthUser();
    
  });

  const context: IAuthContext = {
    user: user.value,
    setUser: (newUser: IUser) => Object.assign(user, newUser),
    isLoading: isLoading.value,
    isAuthenticated: isAuthenticated.value,
    setIsAuthenticated: (value: boolean) => (isAuthenticated.value = value),
    checkAuthUser,
  };

  provide(AuthContextSymbol, context);
}
