import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle different HTTP methods
    console.log(req.body);
  if (req.method === 'GET') {
    // Handle GET request
    
    res.status(200).json({ message: 'GET request received' });
  } else if (req.method === 'POST') {
    // Handle POST request
    res.status(200).json({ message: 'POST request received' });
  } else {
    // Handle other HTTP methods
    res.status(405).end(); // Method Not Allowed
  }
}