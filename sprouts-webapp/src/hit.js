const API_URL = process.env.NEXT_PUBLIC_API_URL;

const hit = async ({ url, method, overrideBaseUrl }, body, headers) => {
  const rawResponse = await fetch((overrideBaseUrl || API_URL) + url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
  });
  let parsedResponse;
  try {
    parsedResponse = await rawResponse.json();
  } catch (err) {
    //
  }
  if (rawResponse.status < 200 || rawResponse.status >= 300) {
    if (parsedResponse && parsedResponse.error) return parsedResponse;
    return { error: true };
  }
  if (rawResponse.status === 204) return {};
  return parsedResponse;
};

export default hit;
