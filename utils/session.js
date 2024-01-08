import { useEffect, useState } from 'react';

//Security thru obscurity of a random cookie key to verify admin
const adminCookieKey = '!vrfvrf5441241267656234523412754673456%34521423421342134';

const setSession = async (user) => {

  await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(user.email),
    headers:
      { 'Content-Type': 'application/json' }
  }).then(res => res.json()).then(customer => {
    //console.log("customer session", customer)

    if (typeof window !== 'undefined') {
      // window.sessionStorage.setItem('sessionId', customerId);
      //  window.sessionStorage.getItem('sessionId');
      document.cookie = `sessionId=${customer.customerId}; path = /`;
      if (customer.adminAccount) {
        document.cookie = `${adminCookieKey}=true; path = /`;
      }
    }
  });
}

const clearSession = () => {
  if (typeof window !== 'undefined') {
   // window.sessionStorage.removeItem('sessionId');
    document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = `${adminCookieKey}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}


// Frontend hook to get the sessionId from the cookie
const useSessionId = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Find if there is a cookie with the field 'sessionId='
    const sessionIdCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith('sessionId='));

    // If there is a cookie, set the sessionIdValue to the value of the cookie else set it to null
    const sessionIdValue = sessionIdCookie ? sessionIdCookie.split('=')[1] : null;
    setSessionId(sessionIdValue);
   
  }, []);



  return Number(sessionId);
};


const isAdmin = (sessionId) => {
  const [adminAccount, setAdminAccount] = useState(null);

  useEffect(() => {
    const adminAccount = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${adminCookieKey}=`));
    const adminAccountBool = adminAccount ? adminAccount.split('=')[1] === 'true' : false;
    setAdminAccount(adminAccountBool);
  }, []);

  return adminAccount;
};


export { setSession, clearSession, useSessionId, isAdmin };
