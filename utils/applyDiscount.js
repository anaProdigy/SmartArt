import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export const applyDiscountToProduct = async (productId, productPrice) => {
  try {
    const payload = {
      productId,
      productPrice,
    };

    const response = await axios.post(`${baseUrl}/api/applyDiscount`, payload);

    if (response.status === 200) {
      const data = await response.data;
      return data.discountedPrice;
    }
  } catch (error) {
    console.error('Error applying discount:', error);
    // You might want to throw the error or handle it appropriately
    throw error;
  }
};