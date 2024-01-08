import Link from 'next/link';
import prisma from 'utils/prisma';
import formatDate from 'utils/formatDate';
import formatPriceAlt from 'utils/formatPriceAlt';
import { applyDiscountToProduct } from '@/utils/applyDiscount';

import { Typography, Container, Paper, Button } from '@mui/material';



const OrdersHistoryList = ({ userOrders }) => {


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

  return (

    <Container className="flex flex-col pt-4">
      {userOrders.length === 0 ? (

        // <Typography variant="body1" style={{ paddingTop: "130px"}}>You have no order history.</Typography>
        <Container style={containerStyles}>
         
          <Paper elevation={3} style={paperStyles}>
            <Typography sx={{ fontSize: ['1rem', '1.2rem', '1.5rem', '1.5rem'] }}>
              {/* <FavoriteIcon style={{ fontSize: '3rem', color: "#5a716e", paddingRight: "10px" }} /> */}
              You have no order history.
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
          <div className="px-2 md:px-32 " >
            <Typography variant="h4" gutterBottom sx={{ fontSize: ['1.2rem', '1.5rem', '1.8rem', '2rem'], paddingTop: "30px", paddingBottom: "30px" }}>
            Your Order History
          </Typography>

          {userOrders.map((order) => (
            <div
              key={order.id}
              className="cart-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EEEEEE')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div className="cart-item-details" style={{ marginLeft: '20px', flex: '1' }}>
                <div className="flex justify-between pr-5 md:pr-20 pt-5">
                  <Typography  sx={{ fontWeight: 'bold', fontSize: ['1rem', '1.2rem', '1.5rem', '1.8rem'], }}>{`Order #${order.id}`}</Typography>
                  <Typography sx={{ fontWeight: 'bold', fontSize: ['0.8rem', '1.2rem', '1.5rem', '1.8rem'] }}>Total: ${formatPriceAlt(order.totalPrice)}</Typography>
                </div>
                <div className="flex justify-between pt-5">
                  <Typography variant="body2">{`Order Date: ${formatDate(order.orderDate)}`}</Typography>
                </div>
                <Typography variant="body2" style={{ marginBottom: '20px' }}>
                  Order Status:
                  <span style={{ color: order.orderStatus === "Completed" ? "green" : "inherit" }}>
                    {order.orderStatus}
                  </span>
                </Typography>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Order Items:</h4>
                  <ul>
                    {order.orderItem.map((item, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        {/* add an image here if needed */}
                        <div style={{ display: 'flex', flexDirection: 'column', paddingRight:'2px' }}>
                          <div>{`${item.qty}x ${item.product.name}`}</div>
                        
                          {item.price !== item.discountedPrice ? (
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              <div style={{ textDecoration: 'line-through', color: '#7D0012', paddingRight: '10px' }}>
                              ${(item.price / 100).toFixed(2)}
                              </div>
                              <div>
                                ${(item.discountedPrice / 100).toFixed(2)}
                              </div>
                            </div>
                          ) : (`$${(item.price / 100).toFixed(2)}`)}

                        </div>
                        
                       
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/orders/${order.id}`}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#324e4b',
                      color: 'white',
                      transition: 'background-color 0.3s',
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      '&:hover': {
                        backgroundColor: '#32434e',
                        width: '200px',
                        color: 'white',
                      },
                    }}
                  >
                    VIEW DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );

};

export async function getServerSideProps({ req }) {

  const sessionId = req.cookies.sessionId || null;
  const userId = parseInt(sessionId);


  try {
    // Fetch user-specific orders from Prisma
    const userOrders = await prisma.order.findMany({
      where: {
        customerId: userId,
      },
      orderBy: {
        orderDate: 'desc',
      },
      include: {
        orderItem: {
          include: {
            product: true, // Include the related product
          },
        },
      },
    });

    const serializedOrders = JSON.parse(JSON.stringify(userOrders));

    // Apply discounts to order items
    const ordersWithDiscounts = await Promise.all(serializedOrders.map(async (order) => {
      const orderItemWithDiscount = await Promise.all(order.orderItem.map(async (item) => {
        const discountedPrice = await applyDiscountToProduct(item.product.id, item.price);
        return {
          ...item,
          discountedPrice: discountedPrice || 0, // Provide a default value if discountedPrice is undefined
        };
      }));

      return {
        ...order,
        orderItem: orderItemWithDiscount,
      };
    }));

    return { props: { userOrders: ordersWithDiscounts } };

   

  } catch (error) {
    console.error('Error fetching user orders', error);
    return {
      props: {
        userOrders: [],
      },
    };
  }
}
export default OrdersHistoryList;