import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, QrCode, Trash2, Calendar } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { getQRCodesByOwner, deleteQRCode } from '../lib/database';

const GeneratedQRList = () => {
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ownerId = localStorage.getItem('ownerId');
      if (ownerId) {
        const qrCodesData = await getQRCodesByOwner(ownerId);
        setQrCodes(qrCodesData);
        // For members, if needed, fetch separately or assume from QR data
        const savedMembers = JSON.parse(localStorage.getItem('members') || '[]');
        setMembers(savedMembers);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQRCode(id);
      const updatedQRCodes = qrCodes.filter(qr => qr.id !== id);
      setQrCodes(updatedQRCodes);
      toast({
        title: "QR Code Deleted",
        description: "The QR code has been removed from your list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete QR code",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupQRCodesByMember = () => {
    const grouped = {};
    qrCodes.forEach(qr => {
      if (!grouped[qr.name]) {
        grouped[qr.name] = [];
      }
      grouped[qr.name].push(qr);
    });
    return grouped;
  };

  const groupedQRCodes = groupQRCodesByMember();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate('/owner')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generated QR Codes</h1>
            <p className="text-gray-600">View and manage all your QR codes</p>
          </div>

          {qrCodes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No QR codes generated yet</p>
              <Button onClick={() => navigate('/owner')} className="bg-blue-600 hover:bg-blue-700">
                Generate Your First QR Code
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedQRCodes).map((memberName) => (
                <div key={memberName} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Badge variant="secondary" className="mr-2">
                      {groupedQRCodes[memberName].length}
                    </Badge>
                    {memberName}'s Items
                  </h3>
                  <div className="space-y-3">
                    {groupedQRCodes[memberName].map((qr) => (
                      <Card key={qr.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <QrCode className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg mb-1">{qr.item}</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Owner: {qr.name}</p>
                                <p>Mobile: {qr.mobile}</p>
                                <p className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Created: {formatDate(qr.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(qr.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs font-mono text-gray-600">
                            QR Data: {JSON.stringify({ name: qr.name, item: qr.item, mobile: qr.mobile })}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GeneratedQRList;
