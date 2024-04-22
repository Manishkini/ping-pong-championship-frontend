export const get = async (url) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
    });

    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      console.log('res.status', res.status)
      throw new Error(res.status);
    }

    const data = await res.json();
    return data;
}

export const post = async (url, body) => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(body),
    });

    // Throw error with status code in case Fetch API req failed
    if (!res.ok) {
      throw new Error(res.status);
    }

    const data = await res.json();
    return data;
}