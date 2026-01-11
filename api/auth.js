export default function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;

    // Check password
    if (password !== process.env.SITE_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    // Return the Supabase anon key
    return res.status(200).json({
        key: process.env.SUPABASE_ANON_KEY
    });
}
