import { SignJWT, jwtVerify } from 'jose';
import { setCookie, getCookie, removeCookie } from './cookies'; // Adjust the path

// Secret key and key encoding
const secretKey = 'basseer-internship';
const key = new TextEncoder().encode(secretKey);

// Encrypt function
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1hr')
    .sign(key);
}

// Decrypt function
export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// Create session and set cookie
export const createSession = async (accessToken) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ accessToken, expiresAt });

  setCookie('session', session, {
    path: '/',
    expires: expiresAt,
    secure: true,
    sameSite: 'lax',
  });
  // Redirect to your desired route (e.g., '/dashboard')
  // For example: history.push('/dashboard');
};

// Verify session and return auth status
export const verifySession = async () => {
  const session = getCookie('session');
  const payload = await decrypt(session);
  console.log(session,"\n payload:",payload);
  
  if (!payload || !payload.user.user_id) {
    // Redirect to login (e.g., '/login')
    // For example: history.push('/login');
    return { isAuth: false };
  }

  return { isAuth: true, userId: Number(payload.user.user_id) };
};

// Update session expiration
export const updateSession = async () => {
  const session = getCookie('session');
  const payload = await decrypt(session);

  if (!payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  setCookie('session', session, {
    path: '/',
    expires,
    secure: true,
    sameSite: 'lax',
  });
};

// Delete session
export const deleteSession = () => {
  removeCookie('session');
  // Redirect to login (e.g., '/login')
  // For example: history.push('/login');
};
