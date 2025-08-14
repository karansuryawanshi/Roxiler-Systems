export function validateName(name) {
  if (!name) return "Name is required";
  if (name.length < 20) return "Name must be at least 20 characters";
  if (name.length > 60) return "Name must be at most 60 characters";
  return null;
}

export function validateAddress(address) {
  if (address && address.length > 400)
    return "Address must be at most 400 characters";
  return null;
}

export function validateEmail(email) {
  if (!email) return "Email is required";
  // simple email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email address";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8 || password.length > 16)
    return "Password must be 8-16 characters";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must include at least one special character";
  return null;
}
