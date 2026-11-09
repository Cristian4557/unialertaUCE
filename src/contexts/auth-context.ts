import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasInitialized: boolean;
  isSigningOut: boolean;
}

export interface AuthContextType extends AuthState {
  refreshSession: () => Promise<void>;
  clearSession: () => void;
  setSigningOut: (value: boolean) => void;
}

// Keep context identity independent of provider/hook hot updates.
export const AuthContext = createContext<AuthContextType | null>(null);
