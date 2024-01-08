/* eslint-disable camelcase */
/* eslint-disable func-style */
/* eslint-disable semi */
import React, { useState } from 'react';
import axios from 'axios';
import { applyDiscountToProduct } from '../utils/applyDiscount'
import prisma from 'utils/prisma';

import Cart from '../components/Cart';


export default function CartPage({ productDetails, subtotal }) {
    return (
        <Cart productDetails={productDetails} subtotal={subtotal} />
    );
  }

  

export async function getServerSideProps({ req }) {
 
  const sessionId = req.cookies.sessionId || null;
  const userId = parseInt(sessionId);

  try {
    // Query the database to find the user's cart.
    const userCart = await prisma.cart.findFirst({
      where: {
        customerId: userId,
      },
      include: {
        cartItems: true, // This includes the associated cartItems.
      },
    });

    const cartItems = userCart ? userCart.cartItems : [];
    const serializedCartItems = JSON.parse(JSON.stringify(cartItems));
    const productDetails = [];
    

    for (const cartItem of serializedCartItems) {
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(cartItem.productId),
        },
      });

      if (product) {
        // Convert price to a plain number
        const price = Number(await applyDiscountToProduct(product.id, product.price))
        const originalPrice = Number(product.price);

        const totalPerProduct = price * cartItem.qty;

        productDetails.push({
          productId: product.id,
          name: product.name,
          originalPrice: originalPrice,
          price: price,
          description: product.description,
          qty: cartItem.qty,
          image: product.image,
          totalPerProduct: totalPerProduct,
        });
      }
    }

    // Calculate subtotal
    const subtotal = productDetails.reduce((acc, item) => acc + item.totalPerProduct, 0);

    return { props: { productDetails, subtotal } };

  } catch (error) {
    console.error('Error fetching cart items:', error);
    return { props: { cartItems: [] } };
  }
}
