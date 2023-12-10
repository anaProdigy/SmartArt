/* eslint-disable camelcase */
/* eslint-disable func-style */
/* eslint-disable semi */
import React, { useState } from 'react';
import axios from 'axios';

import prisma from 'utils/prisma';

import Cart from '../components/Cart';


const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

const applyDiscountToProduct = async (productId, productPrice) => {
  try {
    const payload = {
      productId,
      productPrice,
    };

    // only full path works with port 3000, works on 127.0.0.1:80 by default
    // const response = await axios.post('http://127.0.0.1:3000/api/applyDiscount', payload);
    const response = await axios.post(`${baseUrl}/api/applyDiscount`, payload);

    if (response.status === 200) {
      const data = await response.data;
      return data.discountedPrice;
    }
  } catch (error) {
    console.error('Error applying discount:', error);
  }
};



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
