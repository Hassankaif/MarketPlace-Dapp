// src/utils/ipfs.js
import axios from 'axios';
import { PINATA_API_KEY, PINATA_SECRET_KEY } from '../config/constants';

export const uploadToIPFS = async (file) => {
  
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API keys are not configured');
  }


  // setIsLoading(true); // Start loading
  try {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({ name: file.name });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({ cidVersion: 0 });
    formData.append("pinataOptions", options);

    console.log('Uploading to Pinata...'); // Debug log
    
    const response = await axios({
      method: 'post',
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        'Content-Type': `multipart/form-data;`,
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY
      },
      maxBodyLength: Infinity,
    });

    console.log('Pinata response:', response.data); // Debug log
    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }finally {
    // setIsLoading(false);
};
}
export const getIPFSGatewayURL = (ipfsURI) => {
  if (!ipfsURI) return '/api/placeholder/400/400';
  const hash = ipfsURI.replace('ipfs://', '');
  return `https://ipfs.io/ipfs/${hash}`;
};





// Add this function to ipfs.js for testing
export const testPinataConnection = async () => {
    try {
      const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      });
      console.log('Pinata connection test:', response.data);
      return true;
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      return false;
    }
  };