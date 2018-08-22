export const getSecret = () => {
  if (!process.env.JWT_SECRET) 
    return 'Hackerbay'
  return process.env.JWT_SECRET
}