import { defineStore } from 'pinia'
import type { ICategory } from '../types/category'
import { useCategories } from '~/composables/api/useCategories'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as ICategory[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    // Get category by ID
    getCategoryById: (state) => (categoryId: string) => {
      return state.categories.find(category => category.id === categoryId)
    },

    // Get category names for dropdown/select
    categoryOptions: (state) => {
      return [
        { label: 'All Categories', value: 'all' },
        ...state.categories.map(cat => ({
          label: cat.name,
          value: cat.id
        }))
      ]
    }
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const categoriesApi = useCategories()
        const data = await categoriesApi.getCategories(config.public.publicCloudfrontUrl)
        this.categories = data
      } catch (error) {
        this.error = 'Failed to fetch categories'
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },

    clearCategories() {
      this.categories = []
    }
  }
})

