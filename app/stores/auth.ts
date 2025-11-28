import { defineStore } from 'pinia';
import { 
  fetchUserAttributes, 
  fetchAuthSession,
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  signOut,
  autoSignIn
} from 'aws-amplify/auth';
import { navigateTo } from 'nuxt/app';

interface PendingUser {
  email: string;
  password?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    isAuthenticated: false,
    loading: true,
    error: null as string | null,
    pendingUser: null as PendingUser | null,
  }),
  actions: {
    // This is the core logic to check auth status with Amplify
    async checkAuthStatus() {
      if (!this.loading && this.isAuthenticated) {
        return; // Already checked and authenticated
      }
      
      this.loading = true;
      try {
        const userAttributes = await fetchUserAttributes();
        const { tokens } = await fetchAuthSession();
        const groups = tokens?.accessToken?.payload['cognito:groups'] || [];
        const user = {userAttributes, groups};
        
        this.user = user;
        this.isAuthenticated = true;
        this.loading = false;
        // Note: Removed automatic redirect to '/' - let middleware handle routing
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.loading = false;
        // Optionally, clear local tokens if an error indicates an invalid session
      }
    },
    
    // Simple setter for logging out/in if you use the Auth UI components
    setUser(user: any | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    
    // Sign in action
    async signIn(email: string, password: string) {
      this.error = null;
      this.loading = true;
      
      try {
        const result = await amplifySignIn({ 
          username: email, 
          password 
        });
        
        // Check if sign-in was successful
        if (result.isSignedIn) {
          await this.checkAuthStatus();
          return { success: true };
        }
        
        // Handle additional steps if needed (MFA, etc.)
        return { success: false, nextStep: result.nextStep };
      } catch (error: any) {
        this.loading = false;
        
        // Handle specific error cases
        if (error.name === 'UserNotConfirmedException') {
          this.pendingUser = { email, password };
          return { 
            success: false, 
            error: 'Please verify your email before signing in.',
            code: 'UserNotConfirmedException'
          };
        } else if (error.name === 'NotAuthorizedException') {
          return { 
            success: false, 
            error: 'Incorrect email or password.',
            code: 'NotAuthorizedException'
          };
        } else if (error.name === 'UserNotFoundException') {
          return { 
            success: false, 
            error: 'User not found. Please check your email.',
            code: 'UserNotFoundException'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to sign in. Please try again.',
          code: error.name
        };
      }
    },
    
    // Sign up action
    async signUp(email: string, password: string, firstName: string, lastName: string, phone?: string) {
      this.error = null;
      this.loading = true;
      
      try {
        const attributes: any = {};
        
        // Set given_name and family_name (required by Cognito)
        attributes.given_name = firstName.trim();
        attributes.family_name = lastName.trim();
        
        if (phone) attributes.phone_number = phone;
        
        const result = await amplifySignUp({
          username: email,
          password,
          options: {
            userAttributes: attributes
          }
        });
        
        this.loading = false;
        this.pendingUser = { email, password };
        
        return { 
          success: true, 
          userId: result.userId,
          nextStep: result.nextStep
        };
      } catch (error: any) {
        this.loading = false;
        
        // Handle specific error cases
        if (error.name === 'UsernameExistsException') {
          return { 
            success: false, 
            error: 'An account with this email already exists.',
            code: 'UsernameExistsException'
          };
        } else if (error.name === 'InvalidPasswordException') {
          return { 
            success: false, 
            error: 'Password does not meet requirements.',
            code: 'InvalidPasswordException'
          };
        } else if (error.name === 'InvalidParameterException') {
          return { 
            success: false, 
            error: error.message || 'Invalid input. Please check your information.',
            code: 'InvalidParameterException'
          };
        } else if (error.name === 'NotAuthorizedException') {
          return { 
            success: false, 
            error: error.message || 'You are not authorized to perform this action. Please check your information.',
            code: 'NotAuthorizedException'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to sign up. Please try again.',
          code: error.name
        };
      }
    },
    
    // Confirm sign up (verify email)
    async confirmSignUp(email: string, code: string) {
      this.error = null;
      this.loading = true;
      
      try {
        await amplifyConfirmSignUp({
          username: email,
          confirmationCode: code
        });
        
        // Try to auto sign in if we have the password
        if (this.pendingUser?.password && this.pendingUser?.email === email) {
          const signInResult = await this.signIn(email, this.pendingUser.password);
          this.pendingUser = null;
          return signInResult;
        }
        
        this.loading = false;
        this.pendingUser = null;
        return { success: true };
      } catch (error: any) {
        this.loading = false;
        
        // Handle specific error cases
        if (error.name === 'CodeMismatchException') {
          return { 
            success: false, 
            error: 'Invalid verification code. Please try again.',
            code: 'CodeMismatchException'
          };
        } else if (error.name === 'ExpiredCodeException') {
          return { 
            success: false, 
            error: 'Verification code has expired. Please request a new one.',
            code: 'ExpiredCodeException'
          };
        } else if (error.name === 'LimitExceededException') {
          return { 
            success: false, 
            error: 'Too many attempts. Please try again later.',
            code: 'LimitExceededException'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to verify email. Please try again.',
          code: error.name
        };
      }
    },
    
    // Resend verification code
    async resendSignUpCode(email: string) {
      this.error = null;
      
      try {
        await amplifyResendSignUpCode({ username: email });
        return { success: true };
      } catch (error: any) {
        if (error.name === 'LimitExceededException') {
          return { 
            success: false, 
            error: 'Too many attempts. Please wait before requesting another code.',
            code: 'LimitExceededException'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to resend code. Please try again.',
          code: error.name
        };
      }
    },
    
    // Request password reset
    async resetPassword(email: string) {
      this.error = null;
      this.loading = true;
      
      try {
        const result = await amplifyResetPassword({ username: email });
        this.loading = false;
        
        return { 
          success: true,
          nextStep: result.nextStep
        };
      } catch (error: any) {
        this.loading = false;
        
        if (error.name === 'UserNotFoundException') {
          return { 
            success: false, 
            error: 'User not found. Please check your email.',
            code: 'UserNotFoundException'
          };
        } else if (error.name === 'LimitExceededException') {
          return { 
            success: false, 
            error: 'Too many attempts. Please try again later.',
            code: 'LimitExceededException'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to reset password. Please try again.',
          code: error.name
        };
      }
    },
    
    // Confirm password reset
    async confirmResetPassword(email: string, code: string, newPassword: string) {
      this.error = null;
      this.loading = true;
      
      try {
        await amplifyConfirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword
        });
        
        this.loading = false;
        return { success: true };
      } catch (error: any) {
        this.loading = false;
        
        if (error.name === 'CodeMismatchException') {
          return { 
            success: false, 
            error: 'Invalid verification code. Please try again.',
            code: 'CodeMismatchException'
          };
        } else if (error.name === 'ExpiredCodeException') {
          return { 
            success: false, 
            error: 'Verification code has expired. Please request a new one.',
            code: 'ExpiredCodeException'
          };
        } else if (error.name === 'InvalidPasswordException') {
          return { 
            success: false, 
            error: 'Password does not meet requirements.',
            code: 'InvalidPasswordException'
          };
        } else if (error.name === 'LimitExceededException') {
          return { 
            success: false, 
            error: 'Too many attempts. Please try again later.',
            code: 'LimitExceededException'
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to reset password. Please try again.',
          code: error.name
        };
      }
    },
    
    // You should also have sign-in/sign-out actions that update this state
    async signOut() {
      await signOut(); // Call Amplify signOut
      this.setUser(null);
      this.pendingUser = null;
      
      // Clear user and cart data from stores
      const { useUserStore } = await import('./user');
      const { useCartStore } = await import('./cart');
      
      const userStore = useUserStore();
      const cartStore = useCartStore();
      
      userStore.clearUser();
      cartStore.resetCart();
      
      navigateTo('/login');
    },
  },
});