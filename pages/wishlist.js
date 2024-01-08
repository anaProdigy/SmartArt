import React from 'react';
import prisma from 'utils/prisma';
import Wishlist from '../components/Wishlist';
import { applyDiscountToProduct } from '@/utils/applyDiscount';

export default function WishlistPage({ serializedWishlistData }) {

  return (
        <Wishlist serializedWishlistData={serializedWishlistData} />
  );
}


export async function getServerSideProps({ req }) {
  const sessionId = req.cookies.sessionId || null;
  const userId = parseInt(sessionId);

  const wishlistData = await prisma.wishlist.findMany({
    where: {
      customerId: userId,
    },
    include: {
      product: true,
    },
  });
  try {
    // Apply discounts to each product in the wishlist
    const wishlistWithDiscounts = await Promise.all(wishlistData.map(async (wishlistItem) => {
      const discountedPrice = await applyDiscountToProduct(wishlistItem.product.id, wishlistItem.product.price);
      return {
        ...wishlistItem,
        product: {
          ...wishlistItem.product,
          discountedPrice,
        },
      };
    }));

    const serializedWishlistData = JSON.parse(JSON.stringify(wishlistWithDiscounts));

    return {
      props: {
        serializedWishlistData,
      },
    };
  } catch (error) {
    console.error("Error serializing wishlistData:", error);
    return {
      props: {
        serializedWishlistData: [],
      },
    };
  }
}

