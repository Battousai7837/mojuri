import { describe, expect, it } from 'vitest';
import { calculateCartTotals } from './cartTotals';

describe('calculateCartTotals',()=>{
  it('calculates quantity, shipping and total',()=>expect(calculateCartTotals([{price:100,quantity:2}])).toEqual({subtotal:200,shippingFee:20,total:220}));
  it('gives free shipping at $400',()=>expect(calculateCartTotals([{price:200,quantity:2}])).toEqual({subtotal:400,shippingFee:0,total:400}));
  it('handles an empty cart',()=>expect(calculateCartTotals([])).toEqual({subtotal:0,shippingFee:20,total:20}));
});
