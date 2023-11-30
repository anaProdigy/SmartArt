import Link from 'next/link';
import prisma from 'utils/prisma';
import formatDate from 'utils/formatDate';
import formatPriceAlt from 'utils/formatPriceAlt';
import Layout from '../../components/Layout';
import UserLayout from '@/components/User/UserLayout';

import { Typography, Container } from '@mui/material';
import Button from '@mui/material/Button';

const OrdersHistoryList = ({ userOrders }) => {

  return (
    <Layout>
      <UserLayout>
      <Container className="px-32 flex flex-col pt-4">


        {userOrders.length === 0 ? (
          <Typography variant="body1">You have no order history.</Typography>
        ) : (

          <div style={{ paddingRight: "150px", paddingLeft: "150px" }}>

              <Typography variant="h4" gutterBottom style={{ paddingTop: "30px", paddingBottom: "30px" }}>
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
                  <div className="flex justify-between" style={{  paddingRight:'60px', paddingTop:'20px' }}>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{`Order #${order.id}`}</Typography>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>Total: ${formatPriceAlt(order.totalPrice)}</Typography>
                  </div>
                  <div className="flex justify-between w-1/2 pt-5">
                    <Typography variant="body2">{`Order Date: ${formatDate(order.orderDate)}`}</Typography>
                    {/* Add more order-related information here */}
                  </div>
                  <Typography variant="body2">{`Order Status: ${order.orderStatus}`}</Typography>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>Order Items:</h4>
                    <ul>
                      {order.orderItem.map((item, index) => (
                        <li key={index} className="flex items-center space-x-4">
                          {/* You can add an image here if needed */}
                          <span>{`${item.qty}x ${item.product.name} - $${(item.price / 100).toFixed(2)}`}</span>
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
                        marginBottom:'1rem',
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
      </UserLayout>
    </Layout>
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

    return { props: { userOrders: serializedOrders } };

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