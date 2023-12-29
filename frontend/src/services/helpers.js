import serverUrl from '../config'
async function getUser(userId) {
  try {
    const response = await fetch(
      `${serverUrl}/getUser?userId=${userId}`
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
