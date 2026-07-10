import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, User, Edit2, Save } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { createOwner, updateOwner } from '../lib/database';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    if (savedProfile) {
      setProfileData(savedProfile);
    } else {
      const defaultProfile = {
        name: 'Demo User',
        email: 'demo@school.com',
        mobile: '9876543210',
        address: '123 School Street, City'
      };
      setProfileData(defaultProfile);
      localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
    }
  };

  const handleSave = async () => {
    try {
      let ownerId = localStorage.getItem('ownerId');
      if (ownerId) {
        await updateOwner(ownerId, profileData);
      } else {
        const newOwner = await createOwner(profileData);
        ownerId = newOwner.id;
        localStorage.setItem('ownerId', ownerId);
      }
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate('/owner')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={profileData.mobile}
                onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>

            {isEditing ? (
              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
              <Button onClick={() => navigate('/owner/add-member')} size="sm" variant="outline">
                View All
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Manage your children's information for QR code generation
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
