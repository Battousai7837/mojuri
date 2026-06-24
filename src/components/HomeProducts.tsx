import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { api } from '../lib/api';
import type { Product } from '../types';
import './client.css';

export default function HomeProducts(){
  const[mount,setMount]=useState<HTMLElement|null>(null);
  const trendingQuery=useQuery({queryKey:['products','featured'],queryFn:()=>api<{items:Product[]}>('/products?featured=true&limit=4')});
  const newestQuery=useQuery({queryKey:['products','newest'],queryFn:()=>api<{items:Product[]}>('/products?limit=4')});
  // The portal target is created by the preserved Mojuri HTML during commit.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{setMount(document.getElementById('dynamic-home-products'))},[]);
  const trending=trendingQuery.data?.items??[];const newest=newestQuery.data?.items??[];
  if(!mount||(!trending.length&&!newest.length))return null;
  return createPortal(<><section className="home-dynamic"><div className="store-title"><small>Curated for you</small><h1>Trending Jewelry</h1></div><div className="product-grid">{trending.map(item=><ProductCard product={item} key={item._id}/>)}</div></section><section className="home-dynamic" style={{background:'#f7f4ef'}}><div className="store-title"><small>Just arrived</small><h1>New Pieces</h1></div><div className="product-grid">{newest.map(item=><ProductCard product={item} key={item._id}/>)}</div></section></>,mount)
}
