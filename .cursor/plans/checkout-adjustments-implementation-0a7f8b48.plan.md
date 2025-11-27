<!-- 0a7f8b48-e174-45d0-b6ad-f4bc6e74dcf1 7ac5e96a-07a9-4bf9-9042-b94269157106 -->
# Checkout Adjustments Implementation Plan

## Overview

Add paper bag options and update shipping fee calculation on the checkout page. The implementation includes:

- Free paper bags for 4+ items (auto-calculated, 1 bag per 5 items, rounded up)
- Free paper bags for orders containing "Sets" category items
- Optional paper bag for <4 items with 20 pesos fee (disabled if Sets items present)
- Free shipping for orders with 5+ items (regardless of delivery method)

## Implementation Steps

### 1. Update Order Types (`app/types/order.d.ts`)

- Add `paper_bag_quantity?: number` to `IOrder` and `IOrderInput` interfaces
- Add `paper_bag_cost?: number` to `IOrder` and `IOrderInput` interfaces
- This ensures paper bag information is stored with the order

### 2. Update Checkout Page Logic (`app/pages/checkout.vue`)

#### 2.1 Add Paper Bag State Management

- Add reactive state for paper bag selection:
- `includePaperBag` (boolean) - tracks if user wants paper bag for <4 items
- Computed property for `totalItemCount` - sum of all item quantities from `cartStore.items`
- Computed property for `paperBagQuantity` - auto-calculated quantity based on item count

#### 2.2 Add Sets Category Detection

- Create computed `hasSetsItems`:
- Import `useProductsStore` to access product data
- For each cart item, look up the product using `productsStore.getProductById(item.id)`
- Check if any product's `category` field (category ID) matches "Sets"
- Return true if at least one item is from Sets category

#### 2.3 Add Paper Bag Cost Calculation

- Create computed `paperBagQuantity`:
- If `hasSetsItems` is true: return `Math.max(1, Math.ceil(totalItemCount / 5))` (free, minimum 1 bag for Sets regardless of total count)
- Example: Sets + 2 other items = 3 total items → returns 1 bag (not 0)
- If `totalItemCount >= 4`: return `Math.ceil(totalItemCount / 5)` (free)
- If `totalItemCount < 4` and `hasSetsItems` is false and `includePaperBag` is true: return 1
- Otherwise: return 0
- Create computed `paperBagCost`:
- Returns 0 if `hasSetsItems` is true (free bag for Sets, regardless of item count)
- Returns 0 if `totalItemCount >= 4` (free bags)
- Returns 0 if `totalItemCount < 4` and `includePaperBag` is false
- Returns 20 * `paperBagQuantity` if `totalItemCount < 4` and `includePaperBag` is true and no Sets items

#### 2.4 Update Shipping Cost Calculation

- Modify `shippingCost` computed property:
- If `totalItemCount >= 5`: return 0 (free shipping for all delivery methods)
- If `totalItemCount < 5`: keep existing logic (75 pesos for Ship via J&T, free for Meet up/Pick up)

#### 2.5 Update Order Total Calculation

- Modify `orderTotal` computed property to include paper bag cost:
- `cartStore.total + shippingCost.value + paperBagCost.value`

#### 2.6 Add Paper Bag UI Section

- Insert new section after "Delivery Method Selection" section (around line 174):
- Display paper bag information based on conditions:
- If 4+ items: Show "Free paper bag included (auto-calculated based on item count)"
- If has Sets items: Show "Free paper bag included (Sets category)"
- If <4 items and no Sets: Show checkbox "Add mini paper bag (+₱20)"
- Display calculated paper bag quantity
- Show helpful explanatory text about bag capacity (up to 5 jewelries per bag)
- Disable checkbox if Sets items are present (since it's already free)

#### 2.7 Update Order Summary Display

- Add paper bag line item in the Order Summary sidebar (after shipping, before total):
- Show "Paper Bag" label
- Display quantity and cost (or "FREE" if cost is 0)
- Example: "Paper Bag (x2)" with "FREE" or "₱20.00"

#### 2.8 Update Order Submission

- Modify `handleSubmitOrder` function to include paper bag fields in `orderInput`:
- Add `paper_bag_quantity: paperBagQuantity.value`
- Add `paper_bag_cost: paperBagCost.value`
- Ensure products store is accessible (import and initialize if needed)

### 3. UI/UX Considerations

- Display clear messaging about free shipping for 5+ items in shipping section
- Show paper bag information prominently with visual indicators (badges/icons) for free items
- Use green text or badges to highlight "FREE" items
- Ensure responsive design maintains readability on mobile devices
- Add informational tooltips or help text explaining the rules

## Key Files to Modify

1. `app/types/order.d.ts` - Add paper bag fields to order interfaces
2. `app/pages/checkout.vue` - Main implementation file with all logic and UI changes

## Business Rules Summary

- **Shipping**: 
- Free for 5+ items (all delivery methods)
- Otherwise: 75 pesos for Ship via J&T, free for Meet up/Pick up

- **Paper Bag**: 
- 4+ items: Free, auto-calculated (1 bag per 5 items, rounded up)
- Contains "Sets" category: Free, auto-calculated (1 bag per 5 items, rounded up)
- <4 items (and no Sets): Optional, 20 pesos per bag if selected
- Each bag can hold up to 5 jewelries

### To-dos

- [ ] Add paper_bag_quantity and paper_bag_cost fields to IOrder and IOrderInput interfaces in app/types/order.d.ts
- [ ] Add reactive state (includePaperBag) and computed properties (totalItemCount, paperBagQuantity) for paper bag selection in checkout.vue
- [ ] Create hasSetsItems computed property that checks if any cart item belongs to 'Sets' category by looking up products from products store
- [ ] Update shippingCost computed to return 0 for orders with 5+ items regardless of delivery method
- [ ] Create paperBagCost computed property that calculates cost based on item count, Sets category, and user selection
- [ ] Update orderTotal computed to include paper bag cost in the calculation
- [ ] Add UI section for paper bag selection with conditional display based on item count and Sets category, including checkbox for <4 items
- [ ] Update Order Summary sidebar to display paper bag quantity and cost information
- [ ] Include paper_bag_quantity and paper_bag_cost in orderInput when creating order in handleSubmitOrder function