async function getHelper() {
  try {
    const response = await fetch(`http://127.0.0.1:3000/getHelpers`);
    if (response.ok) {
      const helpers = await response.json();
      return helpers;
    } else {
      console.log("Request failed with status:", response.status);
    }
  } catch (e) {
    console.log(e);
  }
}

async function getUser(userId) {
  try {
    const response = await fetch(
      `/getUser?userId=${userId}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.user;
    } else {
      console.log("Request failed with status:", response.status);
    }
  } catch (e) {
    console.log(e);
  }
}

async function generateOTP() {
  const characters = "0123456789";
  let OTP = "";

  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * characters.length);
    OTP += characters[index];
  }

  return OTP;
}
export { getHelper, getUser, generateOTP };
