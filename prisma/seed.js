// Import file system and csv-parser
const fs = require('fs');
const csv = require('csv-parser');

// Import the PrismaClient
const { PrismaClient } = require('@prisma/client');
const { time } = require('console');

// Instantiate the PrismaClient
const prisma = new PrismaClient();



async function main() {
  try {
 
    // Insert data into the "admins" table
    await prisma.admin.create({
      data: {
        email: 'z.anastasia11@gmail.com',
        subId: '1ffe23f',
        firstName: 'Anastasia',
        lastName: 'Zaika',
      },
    });

  
    // Insert data into the "customers" table

// CUSTOMERS
    //Hold "customers" table data in array
    const customersData = [
      {
        firstName: 'Pete',
        lastName: 'Mo',
        email: 'mpo@mail.com',
        subId: 'werff34r23f',
      },
      {
        firstName: 'Lyda',
        lastName: 'Feep',
        email: 'feep@mail.com',
        subId: '32141241241',
      },
      {
        firstName: 'Todd',
        lastName: 'Bangaran',
        email: 'tbang@mail.com',
        subId: '4324235',
      },
      {
        firstName: 'George',
        lastName: 'Till',
        email: 'gtill@mail.com',
        subId: '4234235235',
      },
      {
        firstName: 'Tyson',
        lastName: 'Meo',
        email: 'tmeo@mail.com',
        subId: '4234235332',
      }
    ];

    //  //Insert data into the "customers" table
    const createdCustomers = await prisma.customer.createMany({
      data: customersData,
    });
    //Get and store in var newly created customers to extract id dinamically
    const customers = await prisma.customer.findMany();
  


//ADDRESSES
    //Hold "customers" table data in array
    const addressesData = [
      {
        customerId: customers[0].id,
        street: '123 Main St',
        city: 'Denver',
        province: 'CO',
        country: 'USA',
        postal: '80202',
        phone: '111341789302',
        billing: true,
      },
      {
        customerId: customers[1].id,
        street: '325 Cycle St',
        city: 'Toronto',
        province: 'ON',
        country: 'CANADA',
        postal: 'M1S3X1',
        phone: '133341789302',
        billing: true,
      },
      {
        customerId: customers[2].id,
        street: '12 Too Ct',
        city: 'New York',
        province: 'NY',
        country: 'USA',
        postal: '10111',
        phone: '131341789302',
        billing: true,
      },
      {
        customerId: customers[3].id,
        street: '2882 Triple Ct',
        city: 'Tampa',
        province: 'FL',
        country: 'USA',
        postal: '22222',
        phone: '136341789302',
        billing: false,
      },

      {
        customerId: customers[4].id,
        street: '3567 Dice St',
        city: 'Vancouver',
        province: 'BC',
        country: 'CANADA',
        postal: 'B1N1L6',
        phone: '133343789302',
        billing: true,
      },
    ]
    // Insert data into the "addresses" table
    const createdAddresses = await prisma.address.createMany({
      data: addressesData,
    });

    //Get and store in var newly created addresses to extract id dinamically
    const addresses = await prisma.category.findMany();


//CATEGORIES
     //Hold "categories" table data in array
    const categoriesData = [
      { name: 'Acrylic Paintings' },
      { name: 'Oil Paintings' },
      { name: 'Watercolor Paintings' },
      { name: 'Sculptures' },
      { name: 'Photography' },
     
    ];
    //Insert data into the "categories" table
    const createdCategories = await prisma.category.createMany({
      data: categoriesData,
    });
    //Get and store in var newly created categories to extract id dinamically
    const categories = await prisma.category.findMany();


//PRODUCTS
    //Hold "products" table data in array
    const productsData = [];
    const streamData = fs.createReadStream('./prisma/data.csv').pipe(csv({ separator: '|' }));

    for await (const row of streamData) {
      // Add 00's to the end of the price
      const priceFormat = (parseFloat(row.price) * 100).toString();

      productsData.push({
        categoryId: parseInt(row.categoryId),
        name: row.name,
        artist: row.artist,
        country: row.country,
        dimensions: row.dimensions,
        price: parseInt(priceFormat),
        stock: parseInt(row.stock),
        image: row.image,
        description: row.description,
      });
    }

    // Create products in the database
    await prisma.product.createMany({
      data: productsData,
    });
  
    //get and store in var newly created products to extract id dinamically
    const products = await prisma.product.findMany({
      take: 5, // find only the first 5 records for demo cart
    });


//CARTS
    //Hold "carts" table data in array
    const cartsData = [
      { customerId: customers[0].id },
      { customerId: customers[1].id },
      { customerId: customers[2].id }
    ]

    //Insert data into the "carts" table
    const createdCarts = await prisma.cart.createMany({
      data: cartsData,
    });
    //get and store in var newly created carts to extract id dinamically
    const carts = await prisma.cart.findMany();


//CART ITEM
    //  Insert data into the "cart_items" table directly
    await prisma.cartItem.createMany({
      data: [
        { 
          cartId: carts[0].id,
          productId: products[0].id,
          qty: 2 
        },
        { 
          cartId: carts[0].id,
          productId: products[1].id,
          qty: 2 
        },
        { 
          cartId: carts[0].id,
          productId: products[2].id,
          qty: 3 
        },
        { 
          cartId: carts[0].id,
          productId: products[3].id,
          qty: 1 
        },
        { 
          cartId: carts[1].id,
          productId: products[0].id,
          qty: 2 
        },
        { 
          cartId: carts[2].id,
          productId: products[1].id,
          qty: 1 
        },
        { 
          cartId: carts[2].id,
          productId: products[1].id,
          qty: 4 
        },
        { 
          cartId: carts[2].id,
          productId: products[2].id,
          qty: 1 
        }, 
      ],
    });
   
   

//PAYMENTS
    // Hold "payments" table data in array
    const paymentsData = [
      {
        customerId: customers[0].id,
        date: new Date('2023-01-10T15:10:00Z'), 
        totalPrice: 42394, 
        stripeChargeId: 'aegrds2323',
      },
      {
        customerId: customers[1].id,
        date: new Date('2023-03-11T13:10:00Z'),
        totalPrice: 239,
        stripeChargeId: 'agrds2323',
      },
      {
        customerId: customers[2].id,
        date: new Date('2023-04-01T01:11:00Z'),
        totalPrice: 31124,
        stripeChargeId: 'ads23htr23',
      },
      {
        customerId: customers[2].id,
        date: new Date('2023-05-21T12:11:00Z'),
        totalPrice: 1347,
        stripeChargeId: 'ahgfds2323',
      },
      {
        customerId: customers[4].id,
        date: new Date('2023-08-23T04:13:00Z'),
        totalPrice: 7612,
        stripeChargeId: 'ad564s2323',
      },
    ];

    // Insert data into the "payments" table
    const createdPayments = await prisma.payment.createMany({
      data: paymentsData,
    });

    const payments = await prisma.payment.findMany();

    
//ORDERS
     // Hold "orders" table data in array
    const ordersData = [
      { 
        customerId: customers[1].id,
        paymentId: payments[0].id,
        orderDate: new Date('2023-01-10T15:10:00Z'), 
        totalPrice: 42394,
       },
      { 
        customerId: customers[1].id,
        paymentId: payments[1].id,
        orderDate: new Date('2023-03-11T13:10:00Z'),
        totalPrice: 239,
       },
      { 
        customerId: customers[2].id,
        paymentId: payments[2].id,
        orderDate: new Date('2023-04-01T01:10:00Z'),
        totalPrice: 31124,
       },
      { 
        customerId: customers[3].id,
        paymentId: payments[3].id,
        orderDate: new Date('2023-05-21T12:10:00Z'),
        totalPrice: 1347,
      },
      { 
        customerId: customers[4].id,
        paymentId: payments[4].id,
        orderDate: new Date('2023-08-23T04:10:00Z'),
        totalPrice: 7612,
      },
    ]

    // Insert data into the "orders" table
    const createdOrders = await prisma.order.createMany({
      data: ordersData,
    });
   
    //Find created orders to get ids dinamically from them
    const orders = await prisma.order.findMany();


//OREDER ITEMS
    // Insert data into the "order_items" table directly
    await prisma.orderItem.createMany({
      data: [
        { 
          orderId: orders[0].id,
          productId: products[0].id,
          qty: 1,
          price: 42394
        },
        { 
          orderId: orders[1].id,
          productId: products[2].id,
          qty: 2,
          price: 1195 
        },
        { 
          orderId: orders[2].id,
          productId: products[3].id,
          qty: 1,
          price: 31124
        },
        { 
          orderId: orders[3].id,
          productId: products[0].id,
          qty: 1,
          price: 1347
        },
        { 
          orderId: orders[4].id,
          productId: products[3].id,
          qty: 1,
          price: 7612
        },
      ],
    });


//WISHLISTS
    // Hold "orders" table data in array
    const wishlistsData = [
      { 
        customerId: customers[0].id,
        productId: products[1].id, 
      },
      {
        customerId: customers[2].id,
        productId: products[2].id,
      }, 
      { 
        customerId: customers[3].id,
        productId: products[0].id,
      }
    ]

    // Insert data into the "wishlists" table
    const createdWishlists = await prisma.wishlist.createMany({
      data: wishlistsData,
    });

    //?Find created wishlists to get ids dinamically from them
    const wishlists = await prisma.order.findMany();
    

//FEEDBACKS
    // Insert data into the "feedback" table directly
    await prisma.feedback.createMany({
      data: [
        { 
          customerId: customers[0].id,
          productId: products[0].id,
          rating: 5,
          comment: 'This is a great product!' 
        },
        { 
          customerId: customers[2].id,
          productId: products[1].id,
          rating: 3,
          comment: 'This is a decent item!' 
        },
        { 
          customerId: customers[2].id,
          productId: products[3].id,
          rating: 5,
          comment: 'This is a great product!' 
        },
        { 
          customerId: customers[2].id,
          productId: products[1].id,
          rating: 1,
          comment: 'This is a terrible product!' 
        },
      ],
    });

//DISCOUNTS
    // Insert data into the "discounts" table directly
    await prisma.discount.createMany({
      data: [
        { 
          productId: products[1].id,
          discount: 10,
          startDate: new Date('2023-08-01'),
          endDate: new Date('2024-09-30'),
          description: '10% off in August - September'
        },
        { 
          productId: products[0].id,
          discount: 20,
          startDate: new Date('2023-08-01'),
          endDate: new Date('2024-09-30'),
          description: '20% off in August - September' 
        },
        { 
          productId: products[3].id,
          discount: 40,
          startDate: new Date('2023-08-01'),
          endDate: new Date('2024-09-30'),
          description: '40% off in August - September' 
        },
      ],
    });


    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();