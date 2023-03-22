import React from 'react';
import CartItem from './CartItem';
import { useCartState } from '../../contexts/cartContext';
import { useAuthState } from '../../contexts';


const cartDetailsColSpans = [7, 3, 2];
const cartDetailsColNames = ['商品', '單價', '數量', '小計'];

export default function CartContent() {

  const cart = useCartState();
  const session = useAuthState();

  console.log(cart.length);

  return (
    <div className='sm:w-[80%] my-10'>
      {session.user === 'signed out'
      ? <div className='text-center text-zinc-300 text-3xl'>
          按右上 <i className='px-5 text-white'>用戶登入</i> 以享用會員專屬功能!
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
