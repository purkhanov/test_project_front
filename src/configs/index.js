export const config = {
  baseUrl: 'http://localhost:8000',
  localStorageTokenKey: "omas-token-key",
  reEmail: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  rePassw: /^[A-Za-z0-9]\w{6,14}$/,
}