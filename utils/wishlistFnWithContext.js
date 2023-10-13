//functiona to handle wishlist icon toggling and showing Please lohin for non-logeed in users
//call  handleAddToWishlist(userId, product, textToast) in productId and Products component and create test var to pass txt
//use LoginToast component too here
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginToast from '@/components/LoginToast';
import { useWishlist } from './wishlistContext';

//FOR logged in user to toggle add/delete from wishlist
export const useWishlistFunctions = () => {
  const { isInWishlist, addToWishlist, deleteFromWishlist } = useWishlist();
  const handleToggleWishlist = (userId, productId, textToast) => {

    if (isInWishlist(productId)) {
      console.log("15handleToggleWishlist");
      deleteFromWishlist(userId, productId);
    } else {
      console.log("18handleToggleWishlist");
      addToWishlist(userId, productId);
    }
  };


  //if youser is not logged in  show toast with login prompt
  const handleAddToWishlist = (userId, product, textToast) => {
    if (userId) {
      // User is logged in, so add to wishlist
      handleToggleWishlist(userId, product.id);
    } else {
      // User is not logged in, show a toast notification
      // showLoginToast(textToast);
      // User is not logged in, show a regular toast notification;
      toast.success(textToast, {
        progressStyle: {
          backgroundColor: '#b1889d', // Set the progress bar color
        },
        position: 'top-right',
        autoClose: 2000,
        style: {
          backgroundColor: '#F5C9C6', // Background color
          color: 'black', // Text color
        },
        icon: () => null,
      });
    }
  };

  // const showLoginToast = (textToast) => {
  //   toast.success(textToast, {
  //     // toast.success(<LoginToast text={textToast} />, {
  //     progressStyle: {
  //       backgroundColor: '#b1889d', // Set the progress bar color

  //     },
  //     position: 'top-right',
  //     autoClose: 2000,
  //     style: {
  //       backgroundColor: '#F5C9C6', // Background color
  //       color: 'black', // Text color

  //     },
  //     icon: () => null,
  //   });
  // };
  return { handleToggleWishlist, handleAddToWishlist };
}

