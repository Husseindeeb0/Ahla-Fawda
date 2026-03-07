import { useCheckAuthQuery } from "../state/services/authApi";

export const useAuth = () => {
  const { data, isLoading, isFetching, error, status, isSuccess, isError } =
    useCheckAuthQuery(undefined);

  const isAuthenticated = isSuccess && !!data;

  return {
    user: data,
    isAuthenticated,
    isLoading,
    isFetching,
    error,
    status,
    isError,
  };
};
