import { get, put } from 'aws-amplify/api';
import { fetchUserAttributes } from 'aws-amplify/auth';
import type { ICartItem } from '~/types/cart'

export interface IUser {
  id: string
  email: string
  given_name?: string
  family_name?: string
  phone_number?: string
  cart: ICartItem[]
  created_at?: string
  updated_at?: string
}

export const useUser = () => {
  const config = useRuntimeConfig()
  const apiName = config.public.apiName

  /**
   * Fetch the current user's data from DynamoDB Users table
   */
  const getUser = async (): Promise<IUser | null> => {
    try {
      // Get the logged-in user's ID from Cognito
      const userAttributes = await fetchUserAttributes();
      const userId = userAttributes.sub;

      if (!userId) {
        console.error('No user ID found in Cognito attributes');
        return null;
      }

      const operation = await get({
        apiName: apiName as string, 
        path: `/users/object/${userId}`
      }).response

      const data = await operation.body.json() as any

      console.log('Get User API Response:', data);

      return data as IUser
    }
    catch (error) {
      console.error("Get user API call failed:", error);
      return null
    }
  }

  /**
   * Update the current user's data in DynamoDB Users table
   * @param updates - Partial user object with fields to update
   */
  const updateUser = async (updates: Partial<IUser>): Promise<boolean> => {
    try {
      // First, get the current user data
      const currentUser = await getUser();

      if (!currentUser) {
        console.error('Cannot update user: user data not found');
        return false;
      }

      // Merge the updates with the current user data
      const mergedUserData = {
        ...currentUser,
        ...updates
      };

      const operation = await put({
        apiName: apiName as string, 
        path: '/users',
        options: {
          body: mergedUserData as any
        }
      }).response

      const response = await operation.body.json() as any

      console.log('Update User API Response:', response);

      return response?.success || false
    }
    catch (error) {
      console.error("Update user API call failed:", error);
      return false
    }
  }

  return { 
    getUser, 
    updateUser
  }
}

