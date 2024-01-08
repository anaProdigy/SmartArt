import prisma from 'utils/prisma';
import formatDate from 'utils/formatDate';
import Link from 'next/link';
import { Typography, Container } from '@mui/material';
import formatPriceAlt from '@/utils/formatPriceAlt';
import { applyDiscountToProduct } from '@/utils/applyDiscount';



const OrderPage = ({ order }) => {
  console.log("order.orderItem", order.orderItem)
  if (!order) {
    return <div>Loading...</div>;
  }

  return (
      <Container className="px-32 flex flex-col pt-4" style={{ paddingRight: "150px", paddingLeft: "150px" }}>
        <div className="flex justify-between" style={{ paddingLeft: '15px' }}>
          <Typography variant="h4" gutterBottom>
            Order #{order.id}
          </Typography>
        </div>

        <div className="flex items-center pb-5 pt-5">
          <div className="flex-grow" style={{ marginLeft: '20px' }}>
            <div className="flex justify-between" style={{ marginBottom: '10px' }}>
              <Typography variant="h6">{`Order Date: ${formatDate(order.orderDate)}`}</Typography>
              <Typography variant="h6">{`Total: $${formatPriceAlt(order.totalPrice)}`}</Typography>
            </div>
            <Typography variant="body2" style={{ marginBottom: '20px' }}>
              Order Status:{" "}
              <span style={{ color: order.orderStatus === "Completed" ? "green" : "inherit" }}>
                {order.orderStatus}
              </span>
            </Typography>
            <div>
              <ul>
                {order.orderItem.map((item, index) => (
                  <li
                    key={index}
                    className="cart-item" // Use the same cart-item class
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
                    <Link href={`/products/${item.product.id}`}>
                      <img className="w-[109px] h-[134px]" src={`../uploads/${item.product.image}`} alt={`Order #${order.id}`} />
                    </Link>
                    <div className="cart-item-details" style={{ marginLeft: '20px', flex: '1' }}>
                      <Link href={`/products/${item.product.id}`}>
                        <Typography variant="h6">{item.product.name}</Typography>
                      </Link>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%', paddingTop: '10px' }}>
                        <Typography variant="body2">
                          Price: 

                         
                        </Typography>
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
                    </div>
                  </li>
                ))}
              </ul>
           
            </div>
          </div>
        </div>
      </Container>
  );
};

export async function getServerSideProps( {req, params }) {

  const orderId = params.orderId;
  const sessionId = req.cookies.sessionId || null;
  const userId = parseInt(sessionId);
  //  const userId = 3;

  try {
    // Fetch the order by ID
    const order = await prisma.Order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      // Handle order is not found
      return {
        notFound: true,
      };
    }

    // Check if the user is authorized to view the order
    if (order.customerId !== userId) {
      // Handle unauthorized access
      return {
        redirect: {
          destination: '/forbidden',
          permanent: false,
        },
      };
    }

    // Apply discounts to order items
    const orderItemsWithDiscounts = await Promise.all(
      order.orderItem.map(async (item) => {
        const discountedPrice = await applyDiscountToProduct(item.product.id, item.price);
        return {
          ...item,
          discountedPrice,
        };
      })
    );

    const orderWithDiscounts = {
      ...order,
      orderItem: orderItemsWithDiscounts,
    };

    const serializedOrder = JSON.parse(JSON.stringify(orderWithDiscounts));

    return { props: { order: serializedOrder } };
  } catch (error) {
    console.error('Error fetching the order', error);
    return {
      props: {
        order: null, 
      },
    };
  }
}

export default OrderPage;
