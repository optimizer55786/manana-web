import { getGlobal, getDispatch } from "reactn";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

const getTokenHeader = () => {
  const token = getGlobal().token;

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const createUrl = (url, queryParams) => {
  const params =
    queryParams &&
    Object.keys(queryParams)
      .map((key) => {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(queryParams[key])
        );
      })
      .join("&");

  return params ? `${url}?${params}` : url;
};

export const makeRequest = async (method, url, payload = null) => {
  try {
    const config = {
      method,
      url: `${process.env.REACT_APP_API_URL}${url}`,
      headers: getTokenHeader(),
    };

    if (method !== "get" && payload) {
      config.data = payload;
    }

    const response = await axios(config);

    return response.data;
  } catch (err) {
    const logout = getDispatch().logout;

    if (err.response.status === 401 || err.response.status === 403) {
      logout();
    }

    if (err.response.data && err.response.data.msg) {
      throw new Error(err.response.data.msg);
    }
    throw new Error(
      "Unknown error encountered. Please refresh the page and try again."
    );
  }
};

export const useApiGet = (
  cacheName,
  url,
  queryParams = undefined,
  params = {}
) => {
  return useQuery(
    [cacheName, url, queryParams],
    async () => {
      const response = await makeRequest("get", createUrl(url, queryParams));
      return response;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 300000,
      ...params,
    }
  );
};

export const useApiPost = (url, callback) => {
  return useMutation(async (payload) => {
    const response = await makeRequest("post", url, payload);
    if (typeof callback === "function") {
      callback(response);
    }
    return response;
  });
};

export const useApiPut = (url, callback) => {
  return useMutation(async (payload) => {
    const response = await makeRequest("put", url, payload);
    if (typeof callback === "function") {
      callback(response);
    }
    return response;
  });
};

export const useApiWrite = (url, method, callback) => {
  return useMutation(async (payload) => {
    const response = await makeRequest(method, url, payload);
    if (typeof callback === "function") {
      callback(response);
    }
    return response;
  });
};

export const useApiDelete = (callback) => {
  return useMutation(async (url) => {
    const response = await makeRequest("delete", url);
    if (typeof callback === "function") {
      callback(response);
    }
    return response;
  });
};
