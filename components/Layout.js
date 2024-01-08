import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { useUser } from '@auth0/nextjs-auth0/client';
import { setSession, clearSession } from 'utils/session';
import { MoonLoader } from 'react-spinners';
import { css } from '@emotion/react';
import DrawerAppBar from './User/DrawerAppBar';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const isUserProfilePage = router.pathname === '/profile';
  const isOrdersPage = router.pathname.startsWith('/orders');
  const isReviewsPage = router.pathname === '/reviews';
  const isCartPage = router.pathname === '/cart';
  const isWishlistPage = router.pathname === '/wishlist';

  //LOADER STYLE
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col ">
        <MoonLoader color={'#1E2E2D'} loading={isLoading} css={override} size={50} />
        <div>Loading...</div>
      </div>
    );
  }
  console.log("USER Layout", user)
  if (error) return <div>{error.message}</div>;

  if (user) {

    return (
      <>
        {/* <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} > */}
        <Navigation sessionId={setSession(user)} />
        {(isUserProfilePage || isOrdersPage || isReviewsPage || isCartPage || isWishlistPage) && (
        <DrawerAppBar>{children}</DrawerAppBar>
        )}
        {children}
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

export default Layout;