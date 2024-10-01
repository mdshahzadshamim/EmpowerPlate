export const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
}