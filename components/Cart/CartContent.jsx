import React from 'react';
import CartItem from './CartItem';
import { useCartState } from '../../contexts/cartContext';
import { useAuthState } from '../../contexts';

export default function CartContent() {

  const cart = useCartState();
  const session = useAuthState();

  console.log(cart.length);

  return (
    <div className='my-10'>
      {session.user === 'signed out'
      ? <div className='text-center text-zinc-300 px-10 sm:px-auto text-2xl sm:text-3xl'>
          按右上 <i className='px-5 text-white font-bold'>用戶登入</i> 登入並享用會員專屬功能!
        </div>
      : cart.length === 0 
        ? <div className='text-center text-zinc-500 text-3xl'>
            購物車並未有任何商品! 
          </div>
        : null}
      <ul className='flex flex-col gap-3'>
        {cart.map((item) =>{
          return (
            <CartItem key={item.id} qty={item.qty} details={item.details} />
          )
        })} 
      </ul>
    </div>
  )
}
