import type { IProduct, IProductInput } from '~/types/product'
import { get, post, put } from 'aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';
import { uploadData } from 'aws-amplify/storage';

export const useProducts = () => {
  const config = useRuntimeConfig()
  const apiName = config.public.apiName

  const getProducts = async (): Promise<IProduct[]> => {
    try {
      const operation = await get({
        apiName: apiName as string, path: '/products'
      }).response

      const data = await operation.body.json()

      console.log('API Response Data:', data);

      return data as unknown as IProduct[]
    }
    catch (error) {
      console.error("API call failed:", error);
      return []
    }
  }

  const addProduct = async (product: IProductInput): Promise<boolean> => {
    try {
      const productId = uuidv4();
      
      // Generate image paths for database (without 'public/' prefix)
      const imagePaths = product.images?.map((image, index) => {
        const fileName = image.name.substring(0, image.name.lastIndexOf('.'));
        const fileExtension = image.name.substring(image.name.lastIndexOf('.') + 1);
        return `${product.category}/${productId}/${fileName}-${index}.${fileExtension}`;
      }) || [];
      
      const operation = await post({
        apiName: apiName as string, path: '/products',
        options: {
          body: {
            id: productId,
            category: product.category,
            name: product.name,
            description: product.description,
            images: imagePaths,
            price: product.price,
            status: product.status,
            created_at: product.created_at,
            updated_at: product.updated_at
          }
        }
      }).response

      const response = await operation.body.json() as any

      console.log('API Response Data:', response);

      if(response && response.success && product.images) {
        // Upload all images to storage (with 'public/' prefix for S3)
        product.images.forEach((image, index) => {
          const s3Path = imagePaths[index];
          if (image && s3Path) {
            uploadData({
              path: `public/${s3Path}`,
              data: image,
              options: {
                contentType: image.type
              }
            })
          }
        })
      }

      return response?.success || false
    }
    catch (error) {
      console.error("API call failed:", error);
      return false
    }
  }

  const updateProduct = async (productId: string, product: IProductInput, existingImages?: string[]): Promise<boolean> => {
    try {
      let imagePaths: string[] = [];
      
      // If new images are provided, generate new paths and upload them
      if (product.images && product.images.length > 0) {
        imagePaths = product.images.map((image, index) => {
          const fileName = image.name.substring(0, image.name.lastIndexOf('.'));
          const fileExtension = image.name.substring(image.name.lastIndexOf('.') + 1);
          return `${product.category}/${productId}/${fileName}-${index}.${fileExtension}`;
        });
      } else if (existingImages) {
        // If no new images, keep existing ones
        imagePaths = existingImages;
      }
      
      const operation = await put({
        apiName: apiName as string, path: '/products',
        options: {
          body: {
            id: productId,
            category: product.category,
            name: product.name,
            description: product.description,
            images: imagePaths,
            price: product.price,
            status: product.status,
            created_at: product.created_at,
            updated_at: product.updated_at
          }
        }
      }).response

      const response = await operation.body.json() as any

      console.log('API Response Data:', response);

      // Only upload new images if they were provided
      if(response && response.success && product.images && product.images.length > 0) {
        // Upload all images to storage (with 'public/' prefix for S3)
        product.images.forEach((image, index) => {
          const s3Path = imagePaths[index];
          if (image && s3Path) {
            uploadData({
              path: `public/${s3Path}`,
              data: image,
              options: {
                contentType: image.type
              }
            })
          }
        })
      }

      return response?.success || false
    }
    catch (error) {
      console.error("API call failed:", error);
      return false
    }
  }

  return { getProducts, addProduct, updateProduct }
}