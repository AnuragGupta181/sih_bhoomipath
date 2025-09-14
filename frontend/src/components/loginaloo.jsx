import { useEffect } from "react";

function GoogleLogin() {
  useEffect(() => {
    /* global google */
    window.google.accounts.id.initialize({
      client_id: "1042368150095-tnmfmm3avtsnqdemg2k1h61i2o84ls2d.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large" } // customize
    );
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);

    // 👇 Yeh response.credential ek JWT hota hai
    // Google ka token jo tum JWT decode library se parse kar sakte ho
    const userObject = JSON.parse(atob(response.credential.split('.')[1]));
    console.log("User Info:", userObject);
  };

  return <div id="googleButton"></div>;
}

export default GoogleLogin;
