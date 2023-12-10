import React from 'react';
import prisma from 'utils/prisma';
import Wishlist from '../components/Wishlist';


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
    const serializedWishlistData = JSON.parse(JSON.stringify(wishlistData));
    console.log("serializedWishlistData", serializedWishlistData);
    return {
      props: {
        serializedWishlistData
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

