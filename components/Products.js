import { useState, useEffect, use } from 'react';
import { handleAddToCart } from 'utils/cart';
import { useSessionId } from '../utils/session';
// import { checkIfProductIsInWishlist, toggleWishlist } from 'utils/wishlist';


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import NextLink from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useUser } from '@auth0/nextjs-auth0/client';
import Paginate from './Pagination';
import { averageRating } from 'utils/rating';

import formatPrice from 'utils/formatPrice';
import { Montserrat } from 'next/font/google';
import { useSearchState } from 'utils/search';

import { useWishlist } from '@/utils/wishlistContext';
import { useWishlistFunctions } from '@/utils/wishlistFnWithContext';
import { showLoginToast } from '@/utils/loginToast';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';



const montserrat = Montserrat({
  weight: '600',
  subsets: ['latin']
});


const Products = () => {
  const [products, setProducts] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [clicked, setClicked] = useState(false);
  const { user, error, isLoading } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(21);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const { searchResults, setSearchResults } = useSearchState();


  const { isInWishlist } = useWishlist();

  const userId = useSessionId();


  //-------------------WISHLIST LOGIC --------------------
  const textToastFav = "Please log in to add items to your wishlist.";
  const { handleAddToWishlist } = useWishlistFunctions();

  //---------------------CART LOGIC------------------------
  //additional fn to check if user is logged in before adding to cart
  const textToastCart = "Please log in to add items to your cart.";

  const handleAddToCartToast = (productId, userId, textToast) => {
    if (userId) {
      handleAddToCart(productId, userId);
    } else {
      // User is not logged in, show a toast notification
      showLoginToast(textToast);
    }
  };


  //handles scrolling to top when changing pages
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  //LOADER STYLE
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  if (error) return <div>{error.message}</div>;



  // Initial fetch of products from API endpoint
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch('/api/listProducts');
        if (response.ok) {
          const productData = await response.json();
          setProducts(productData);
          setTotalProducts(productData.length);
          setCurrentPage(1);
        } else {
          console.error('Error');
        }
      } catch (error) {
        console.error('Error', error);
      }
      finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);


  // Update products with search results
  useEffect(() => {
    if (searchResults !== null && searchResults.length > 0) {
      setProducts(searchResults);
      setTotalProducts(searchResults.length);
      setCurrentPage(1);
    }
    else {
      // Set products to empty array if no search results
      setProducts([]);
      setTotalProducts(0);
      setCurrentPage(1);
    }
  }, [searchResults]);


  // Find Products to display per page
  const lastProductOfPage = currentPage * productsPerPage;
  const firstProductOfPage = lastProductOfPage - productsPerPage;
  const pageProducts = products.slice(firstProductOfPage, lastProductOfPage);


  //Dialog fns
  const handleClickOpen = (productId) => {
    setOpenId(productId);
  };

  const handleClose = () => {
    setOpenId(null);
  };


  const theme = createTheme({
    palette: {
      primary: {
        main: '#324E4B'  //green
      },
      secondary: {
        main: '#F5C9C6'
      },
      warning: {
        main: '#B3001B'
      },
      info: {
        main: '#fff'
      }
    },
  });

//Icons on each product - wishlist, cart, expand
  const IconStyled = styled(Button)`
    width: fit-content;
   
    color: ${theme.palette.primary.main};
    @media (min-width: 769px) {
    visibility: hidden;
  }
    `;

  const ContainerStyled = styled("div")`
    &:hover {
      .icon-button {
        visibility: visible;
      }
    }  
   }
   `;



  const now = new Date();

  const productList = () => (pageProducts.map((product) =>

    <Grid item="true" xs={12} sm={6} md={4}
      sx={{ maxWidth: '100%', margin: 'auto', color: theme.palette.primary.main }}
      key={product.id}
      className={montserrat.className}
      
    >
      <ContainerStyled>
        <Card sx={{ boxShadow: 1 }}
          key={product.id}
          variant='outlined'
        >
          <CardMedia
            component="img"
            image={`./uploads/${product.image}`}
            sx={{
              display: 'block', objectFit: "contain", width: 300, height: 300,
              height: window.innerWidth < 600 ? 'fitContent' : '300px',
            }}
          />
          <CardContent>

            <Grid item="true" m={0} >
              <Grid container style={{ height: '100%' }} justifyContent="center">
                <CardActions>
                  <div className="flex justify-evenly">
                    {/* Always display the favorite icon */}
                    <div>
                      <IconStyled
                        sx={{
                          width: 'fit-content',
                          // visibility: 'hidden',
                          color: '#324E4B' // Set the color here
                        }}
                        variant="text"
                        type="button"
                        className="icon-button"
                        onClick={() => handleAddToWishlist(userId, product, textToastFav)}
                      >
                        {isInWishlist(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconStyled>
                    </div>

                    <IconStyled
                      variant="text"
                      className="icon-button"
                      onClick={() => handleAddToCartToast(product.id, userId, textToastCart)}
                    >
                      <AddShoppingCartIcon />
                    </IconStyled>
                    <IconStyled
                      variant="text"
                      className="icon-button"
                      onClick={() => handleClickOpen(product.id)}
                    >
                      <OpenInFullIcon />
                    </IconStyled>
                    <Dialog
                      className={montserrat.className}
                      open={openId === product.id}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      align="center"
                      PaperProps={{
                        sx: {
                          maxWidth: "md",
                          minHeight: 200
                        }
                      }}
                    >
                      <div className='flex justify-between'>
                        <Button
                          variant="text"
                          onClick={handleClose}
                          id={product.id}
                        >
                          <CloseIcon />
                        </Button>
                        <div>
                          <Button
                            sx={{
                              color: theme.palette.primary.main,
                            }}
                            variant="text"
                            type="button"
                            className="icon-button"
                            onClick={() => handleAddToWishlist(userId, product, textToastFav)}
                          >
                            {isInWishlist(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          </Button>

                          {/* Render the ToastContainer */}
                          {/* <ToastContainer position="top-right" autoClose={2000} /> */}

                          <Button
                            sx={{ color: theme.palette.primary.main }}
                            variant="text"
                            className="icon-button"
                            onClick={() => handleAddToCartToast(product.id, userId, textToastCart)}
                          >
                            <AddShoppingCartIcon />
                          </Button>
                        </div>
                      </div>



                      <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
                        <NextLink
                          sx={{ color: theme.palette.primary.main }}
                          href={{
                            pathname: "/products/[productId]",
                            query: { productId: product.id },
                          }}
                          passHref
                          overlay="true"
                          underline="none"
                        >
                          <Typography gutterBottom variant="h7" align="center" sx={{ color: theme.palette.primary.dark }}>
                            {product.name}
                          </Typography>
                        </NextLink>
                      </DialogTitle>


                      <Typography variant="h7" sx={{ color: theme.palette.secondary.dark }}>
                        {product.dimensions}
                      </Typography>

                      <Typography variant="h7" sx={{ color: theme.palette.primary.dark }}>
                        {product.discount && product.discount.length > 0 &&
                          new Date(product.discount[0].startDate) <= now &&
                          new Date(product.discount[0].endDate) >= now ? (
                          <span>
                            <span style={{ textDecoration: 'line-through', color: theme.palette.warning.dark }}>
                              ${formatPrice(product.price)}
                            </span>
                            {' '}
                            ${formatPrice(product.price - (product.price * (product.discount[0].discount / 100)))}
                          </span>
                        ) : (
                          `$${formatPrice(product.price)}`
                        )}
                      </Typography>

                      <div className="flex flex-col p-6 md:flex-row items-center">
                        <CardMedia
                          component="img"
                          image={`./uploads/${product.image}`}
                          alt="work portfolio"
                          sx={{ display: 'block', objectFit: "contain", width: 300, paddingRight: "1em", paddingBottom: "1em" }}
                        />
                        <DialogContentText id="alert-dialog-description" sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="h9" sx={{ color: theme.palette.primary.dark }}>
                            {product.description}
                          </Typography>
                        </DialogContentText>
                      </div>
                    </Dialog>
                  </div>
                  {/* // adjust backdrop to be transparent */}
                </CardActions>

                <Typography gutterBottom variant="h7" align="center" sx={{ color: theme.palette.primary.dark, padding: "0 px" }}>
                  <NextLink
                    href={{
                      pathname: "/products/[productId]",
                      query: { productId: product.id },
                    }}
                    passHref
                    overlay="true"
                    underline="none"
                  >
                    {product.name}
                  </NextLink>
                </Typography>
                <Typography variant="h8" align="center" sx={{
                  fontSize: {
                    xs: '12px',  
                    sm: '14px',  
                    md: '16px',  
                    lg: '18px',  
                    xl: '20px',  
                  }, color: theme.palette.secondary.dark
                }}>
                  {product.dimensions}
                </Typography>
              </Grid>
            </Grid>

            <Grid item="true" sx={{ padding: 0 }}>
              <NextLink
                href={{
                  pathname: "/products/[productId]",
                  query: { productId: product.id },
                }}
                passHref
                overlay="true"
                underline="none"
                
              >
                <Typography sx={{ overflow: "hidden", padding: "0 px" }}>
                  <Rating
                    id={product.id}
                    name="read-only"
                    readOnly
                    precision={0.1}
                    // how to access nested select value and average it?
                    value={averageRating(product.feedback)}
                   
                    
                  >
                  </Rating>
                </Typography>
              </NextLink>
            </Grid>

            <Grid item="true" sx={{ padding: 0 }}>
              <Grid container sx={{ height: '100%' }} justifyContent="center">
                <Typography
                  variant="h8"
                  align="center"
                  sx={{ padding: 0, color: theme.palette.primary.dark }}
                >
                  {product.discount && product.discount.length > 0 &&
                    new Date(product.discount[0].startDate) <= now &&
                    new Date(product.discount[0].endDate) >= now ? (
                    <span>
                      <span style={{ textDecoration: 'line-through', color: theme.palette.warning.dark }}>
                        ${formatPrice(product.price)}
                      </span>
                      {' '}
                      ${formatPrice(product.price - (product.price * (product.discount[0].discount / 100)))}
                    </span>
                  ) : (
                    `$${formatPrice(product.price)}`
                  )}
                </Typography>
              </Grid>
            </Grid>

          </CardContent>
        </Card >
      </ContainerStyled>
    </Grid >
  ));

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col ">
        <MoonLoader color={'#1E2E2D'} loading={loading} css={override} size={50} />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container
        align="center"
        justify-content="center"
        maxWidth="90%"
        // paddingTop="5em"
        // paddingLeft="10em"
        // paddingRight="10em"
        // paddingBottom="1em"
        margin="auto"
        spacing={6}
      >

        {totalProducts === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2em', color: 'gray' }}>
            No results found
          </div>
        ) : (
          productList()
        )}

        <Paginate
          count={Math.ceil(totalProducts / productsPerPage)}
          page={currentPage}
          onChange={(e, value) => {
            setCurrentPage(value);
            scrollToTop();

          }}
          sx={{ shape: "rounded", marginTop: "1.5em" }}
        />

      </Grid>
    </ThemeProvider>
  );

};

export default Products;