import React, { useEffect, useState } from 'react';

import { useSessionId } from '/utils/session';
import { useWishlist } from '@/utils/wishlistContext';
import { Typography, Container, Button, Paper, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';

import Link from 'next/link';


const Wishlist = ({ serializedWishlistData: defaultWishlistData }) => {

  const [wishlistData, setWishlistData] = useState(defaultWishlistData);
  const [loading, setLoading] = useState(true);

  const userId = useSessionId();
  const { deleteFromWishlist } = useWishlist();

  useEffect(() => {
    setWishlistData(defaultWishlistData);
    setLoading(false);
  }, [defaultWishlistData]);


  // Handle onClisk when deleting from wishlist
  const handleDeleteFromWishlist = async (userId, productId) => {
    const result = await deleteFromWishlist(userId, productId);
    // console.log("result", result);
    if (result.success) {

      setWishlistData(result.data.data); // Update wishlistData here
    } else {
      console.error('Error deleting item from wishlist:', result.error);
    }
  };


  // Define the styles for the CircularProgress component
  const circularProgressStyle = {
    position: 'absolute', // Adjust positioning as needed
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Center it horizontally and vertically
    color: 'secondary',
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px', // Adjust the margin as needed
  };

  const paperStyles = {
    padding: '50px',
    textAlign: 'center',
    maxWidth: '400px',
    // margin: '0 auto',
    marginBottom: '40px',
    marginTop: '40px'
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <CircularProgress style={circularProgressStyle} />
        <Typography variant="h6" style={{ color: 'blue' }}>Loading...</Typography>
      </div>
    );

  }


  return (
    <Container className="px-32 flex flex-col pt-4">
      {wishlistData.length === 0 ? (
        <Container style={containerStyles}>
          <FavoriteIcon style={{ fontSize: '3rem', color: "#5a716e" }} />
          <Paper elevation={3} style={paperStyles}>
            <Typography sx={{ fontSize: ['1rem', '1.2rem', '1.5rem', '1.5rem'] }}>
              {/* <FavoriteIcon style={{ fontSize: '3rem', color: "#5a716e", paddingRight: "10px" }} /> */}
              Your wishlist is empty.
            </Typography>
          </Paper>
          <Link href={`/`}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1E2E2D',
                color: 'white',
                fontSize: ['1rem', '1.2rem', '1.5rem', '1.6rem'],
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
            <FavoriteIcon style={{ fontSize: '3rem', color: '#5a716e', paddingRight: '10px' }} />
            Your Wishlist
          </Typography>

          {wishlistData.map((item, index) => (
            <div
              key={index}
              className="flex items-center flex-col md:justify-between md:flex-row mb-10 shadow-md transition duration-300"
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EEEEEE')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div className=" flex flex-col md:flex-row items-center"> 

              <Link href={`/products/${item.product.id}`}>
                <img className=" w-[109px] h-[134px]" src={`/uploads/${item.product.image}`} alt={item.product.name} />
              </Link>

                <div className="text-sm text-center md:text-md lg:text-lg ml-[10px] mr-[10px] md:ml-[20px]">

                <Link href={`/products/${item.product.id}`}>
                  <Typography>{item.product.name}</Typography>
                </Link>

                  <div className="items-center pt-10 md:flex">
                    <div style={{  paddingRight: '10px' }}>Price: </div>
                    {item.product.price !== item.product.discountedPrice ? (
                      <div style={{ display: 'flex', flexDirection: 'row', paddingLeft:'10px' }}>
                        <div style={{ textDecoration: 'line-through', color: '#7D0012', paddingRight: '10px' }}>
                          ${(item.product.price / 100).toFixed(2)}
                        </div>
                        <div>
                          ${(item.product.discountedPrice / 100).toFixed(2)}
                        </div>
                      </div>
                    ) : (`$${(item.product.price / 100).toFixed(2)}`)}

                  {/* Add any other details you want to display */}
                </div>
              </div>
              </div>
              
              <Button
                onClick={() => handleDeleteFromWishlist(userId, item.product.id)}

                variant="contained"
                style={{
                  backgroundColor: '#893F04',
                  minWidth: 'unset',
                  marginRight: '10px',
                  marginTop:'10px',
                  marginBottom:'10px',
                  color: 'white',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: 'darkgray',
                  },
                }}
              >
                <DeleteIcon />
                <div className="hidden md:block">Delete</div>
              </Button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Wishlist;