import { defineStore } from 'pinia'
import type { IProduct, IProductInput } from '../types/product'
import { useProducts } from '~/composables/api/useProducts'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as IProduct[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    // Get products by category
    getProductsByCategory: (state) => (categoryId: string) => {
      if (categoryId === 'all') {
        return state.products
      }
      return state.products.filter(product => product.category === categoryId)
    },

    // Get product by ID
    getProductById: (state) => (productId: string) => {
      return state.products.find(product => product.id === productId)
    },

    // Get in-stock products
    inStockProducts: (state) => state.products.filter(product => product.status === 'in_stock'),

    // Get out-of-stock products
    outOfStockProducts: (state) => state.products.filter(product => product.status === 'out_of_stock')
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const productsApi = useProducts()
        const data = await productsApi.getProducts()
        this.products = data
      } catch (error) {
        this.error = 'Failed to fetch products'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async addProduct(product: IProductInput) {
      this.loading = true
      this.error = null
      
      try {
        const productsApi = useProducts()
        const success = await productsApi.addProduct(product)
        
        if (success) {
          // Refresh products after adding
          await this.fetchProducts()
        } else {
          this.error = 'Failed to add product'
        }
        
        return success
      } catch (error) {
        this.error = 'Failed to add product'
        console.error('Error adding product:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async updateProduct(productId: string, product: IProductInput, existingImages?: string[]) {
      this.loading = true
      this.error = null
      
      try {
        const productsApi = useProducts()
        const success = await productsApi.updateProduct(productId, product, existingImages)
        
        if (success) {
          // Refresh products after updating
          await this.fetchProducts()
        } else {
          this.error = 'Failed to update product'
        }
        
        return success
      } catch (error) {
        this.error = 'Failed to update product'
        console.error('Error updating product:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    clearProducts() {
      this.products = []
    }
  }
})

