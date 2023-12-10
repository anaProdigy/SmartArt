import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { useSessionId } from 'utils/session';
import checkout from '../pages/api/checkout';

import { Button, Paper } from "@mui/material";
import { Typography, Container } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';



const Cart = ({ productDetails: defaultProducts, subtotal }) => {

  const [productDetails, setProductDetails] = useState(defaultProducts);
  const [total, setTotal] = useState(subtotal);
  const [cart, setCart] = useState([]);

  const userId = useSessionId();

  const lineItems = productDetails.map((item) => {
    return {
      quantity: item.qty,
      price_data: {
        currency: "CAD",
        product_data: {
          name: item.name,
          description: item.description || undefined,
          images: item.image ? [item.image] : [],
        },
        // original_unit_amount: item.originalPrice,
        unit_amount: parseInt(item.price),
      }
    };
  });

  const getCartIdForUser = async (userId) => {
    try {
      const response = await axios.get(`/api/getCartId/?userId=${userId}`);

      if (response.status === 200) {
        return response.data.cartId;
      } else {
        //  the request was not successful
        console.error('Error getting cartId:', response.statusText);
        return null;
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error getting cartId:', error);
      return null;
    }
  };


  const handleCheckout = async () => {
    try {

      // Use the userId to get the cartId
      const cartId = await getCartIdForUser(userId);
      // Call the checkout function with cartId
      const session = await checkout({
        cartId, // Pass the cartId as an argument to checkout
        lineItems, // Your lineItems data

      });
      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };


  // Function to delete an item from the cart 
  const calculateTotalPrice = (products) => products.reduce((acc, item) => {
    acc += item.qty * item.price;
    return acc;
  }, 0);

  const deleteFromCart = async (productId) => {
    try {
      const payload = {
        userId,
        productId,
      };
      // only extract through data
      const response = await axios.delete('/api/cart', { data: payload });
      if (response.status === 200) {
        //  update the cart items state, new product details
        const newProductDetails = productDetails.reduce((list, item) => {
          if (item.productId !== productId) {
            list.push(item);
            return list;
          }
          if (item.qty === 1) {
            return list;
          }
          item.qty--;
          list.push(item);
          return list;
        }, []);
        const totalPrice = calculateTotalPrice(newProductDetails);
        setProductDetails(newProductDetails);
        setTotal(totalPrice);
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };


  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const payload = {
        userId,
        productId,
        quantity: newQuantity,
      };
      const response = await axios.put('/api/cart', payload); // Make a PUT request
      if (response.status === 200) {
        const newProductDetails = productDetails.map((item) => {
          if (item.productId === productId) {
            // Update the quantity for the matching product
            return {
              ...item,
              qty: newQuantity,
            };
          }
          return item;
        });
        const totalPrice = calculateTotalPrice(newProductDetails);
        setProductDetails(newProductDetails);
        setTotal(totalPrice);
      }
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };


  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  };

  const paperStyles = {
    padding: '50px',
    textAlign: 'center',
    maxWidth: '400px',
    marginBottom: '40px',
    marginTop: '40px'
  };

  //to display on top of cart
  // const getTotalItems = (items) =>
  //   items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <>
      <Container className="px-32 flex flex-col pt-4">
        {productDetails.length === 0 ? (
          <Container style={containerStyles}>
            <AddShoppingCartIcon style={{ fontSize: '3rem', color: "#5a716e", paddingRight: "10px" }} />
            <Paper elevation={3} style={paperStyles}>
              <Typography sx={{ fontSize: ['1rem', '1.2rem', '1.5rem', '1.5rem'] }}>
                Your cart is empty.
              </Typography>
            </Paper>
            <Link href={`/`}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1E2E2D',
                  color: 'white',
                  fontSize: ['1rem', '1.2rem', '1.5rem', '1.5rem'],
                  marginBottom: '3rem',
                  alignSelf: 'center',
                }}
              >
                Go to the main page
              </Button>
            </Link>
          </Container>
        ) : (
          <div className="px-[30px] md:px-[100px] lg:px-[[150px] ">
            <Typography variant="h4" gutterBottom sx={{ fontSize: ['1.2rem', '1.5rem', '1.8rem', '2rem'], paddingTop: "30px", paddingBottom: "30px" }}>
              <AddShoppingCartIcon sx={{ fontSize: ['2rem', '2.5rem', '2.8rem', '3rem'], color: "#5a716e", paddingRight: "10px" }} /> Your Shopping Cart
            </Typography>

            {productDetails.map((item, index) => (
              <div
                key={index}
                // className="cart-item"
                // style={{
                //   display: 'flex',
                //   alignItems: 'center',
                //   marginBottom: '20px',
                //   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                //   transition: 'background-color 0.3s',
                //   '&:hover': {
                //     backgroundColor: 'lightgray', // Change the background color on hover
                //   },
                // }}
                className="flex items-center flex-col md:justify-between md:flex-row mb-10 shadow-md transition duration-300"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EEEEEE')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >

                {/* <div className=" flex flex-col md:flex-row md:justify-between items-center"> */}

                  <Link href={`/products/${item.productId}`}>
                    <img className="w-[109px] h-[134px]" src={`uploads/${item.image}`} alt={item.name} />
                  </Link>

                <div className="text-sm text-center md:text-md lg:text-lg ml-[10px] mr-[10px] md:ml-[20px] md:w-1/2">

                    <Link href={`/products/${item.productId}`}>
                      <Typography>{item.name}</Typography>
                    </Link>

                    <div className=" flex justify-between items-center pt-5 md:flex"
                    // style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%', paddingTop: '10px' }}
                    >
                      <div  style={{ display: 'flex', flexDirection: 'column' }}>
                        {item.price !== item.originalPrice ? (
                          <div>
                            <div style={{ textDecoration: 'line-through', color: '#7D0012' }}> ${(item.originalPrice / 100).toFixed(2)} </div> 
                            <div>${(item.price / 100).toFixed(2)}</div> 
                          </div>
                        ) : (`$${(item.price / 100).toFixed(2)}`)}
                      </div>
                      <div className="pl-[40px]">
                        <Typography variant="body2">Total: </Typography>
                        <div>${(item.qty * item.price / 100).toFixed(2)}</div>
                      </div>

                    </div>
                  </div>

                  <div className="flex justify-between items-center py-[10px] md:pr-[20px]"
                  // style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  paddingTop: '10px' }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      style={{
                        backgroundColor: '#ea8b85',
                        color: 'white',
                        transition: 'background-color 0.3s',
                        fontSize: "15px",
                      }}
                      onClick={() => deleteFromCart(item.productId)}
                    >
                      -
                    </Button>
                    <div className="px-2 font-bold">{item.qty}</div>
                    <Button
                      size="small"
                      variant="contained"
                      style={{
                        backgroundColor: '#324e4b',
                        color: 'white',
                        transition: 'background-color 0.3s',
                        fontSize: "15px",

                      }}
                      onClick={() => updateCartItemQuantity(item.productId, item.qty + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              // </div>
            ))}
            <div className="cart-total" style={{ textAlign: 'right', paddingTop: '20px' }}>
              <Typography variant="h6">Total: ${(total / 100).toFixed(2)}</Typography>
            </div>
            <div className="inline-block pb-20 flex justify-end">
              <Button

                variant="contained"
                style={{
                  backgroundColor: '#283e3c',
                  color: 'white',
                  transition: 'background-color 0.3s',
                }}
                type="submit"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}

      </Container>

    </>
  );
};

export default Cart;