
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

export {getUser};
