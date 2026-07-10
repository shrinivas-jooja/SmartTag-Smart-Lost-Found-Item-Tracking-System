const BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8001/api';

// Owners
export const createOwner = async (ownerData) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ownerData),
  });
  if (!response.ok) throw new Error('Failed to create owner');
  const data = await response.json();
  return data.owner;
}

export const getOwner = async (id) => {
  // This could be implemented if needed, but signup/login return the owner
  return null;
}

export const updateOwner = async (id, updates) => {
  // Mock update
  return updates;
}

// Members
export const createMember = async (memberData) => {
  const response = await fetch(`${BASE_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) throw new Error('Failed to create member');
  return await response.json();
}

export const getMembersByOwner = async (ownerId) => {
  const response = await fetch(`${BASE_URL}/members?owner_id=${ownerId}`);
  if (!response.ok) throw new Error('Failed to fetch members');
  return await response.json();
}

export const updateMember = async (id, updates) => {
  return updates;
}

export const deleteMember = async (id) => {
  return;
}

// QR Codes
export const createQRCode = async (qrData) => {
  const response = await fetch(`${BASE_URL}/qrcodes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qrData),
  });
  if (!response.ok) throw new Error('Failed to create QR code');
  return await response.json();
}

export const getQRCodesByOwner = async (ownerId) => {
  const response = await fetch(`${BASE_URL}/qrcodes?owner_id=${ownerId}`);
  if (!response.ok) throw new Error('Failed to fetch QR codes');
  return await response.json();
}

export const getQRCode = async (id) => {
  return null;
}

export const updateQRCode = async (id, updates) => {
  return updates;
}

export const deleteQRCode = async (id) => {
  return;
}