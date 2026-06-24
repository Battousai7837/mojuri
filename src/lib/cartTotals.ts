export type PricedItem = { price: number; quantity: number };
export function calculateCartTotals(items: PricedItem[], freeShippingAt = 400, standardShipping = 20) {
  const subtotal = items.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const shippingFee = subtotal >= freeShippingAt ? 0 : standardShipping;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}
