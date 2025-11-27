export interface IOrder {
  id: string
  user_id: string
  order_number: string
  items: IOrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  customer_name: string
  email: string
  phone_number: string
  shipping_address: string  // JSON string (can be parsed to object if needed)
  tracking_number?: string
  carrier?: string
  estimated_delivery?: string
  payment_proof?: string  // Optional - uploaded after order creation
  payment_method: string
  payment_status: 'pending' | 'verified' | 'failed'
  status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  delivery_method?: 'meet_up' | 'pick_up' | 'ship_via_jt'
  notes?: string
  paper_bag_quantity?: number  // Number of paper bags
  paper_bag_cost?: number  // Cost of paper bags (0 if free)
  inventory_reserved?: boolean  // Whether inventory has been deducted
  inventory_restocked?: boolean  // Whether inventory has been returned (for cancelled orders)
  created_at: number  // Unix timestamp
  updated_at: number  // Unix timestamp
  delivered_at?: number  // Unix timestamp
}

export interface IOrderItem {
  id: string  // Product ID at time of purchase
  name: string  // Product name snapshot
  price: number  // Price at time of purchase
  quantity: number  // Quantity purchased
  image?: string  // Product image snapshot
  category?: string  // Product category snapshot
}

export interface IOrderInput {
  items: IOrderItem[]
  subtotal: number
  shipping_cost: number
  total: number
  customer_name: string
  email: string
  phone_number: string
  shipping_address: string
  payment_method: string
  delivery_method?: 'meet_up' | 'pick_up' | 'ship_via_jt'
  notes?: string
  paper_bag_quantity?: number  // Number of paper bags
  paper_bag_cost?: number  // Cost of paper bags (0 if free)
}

