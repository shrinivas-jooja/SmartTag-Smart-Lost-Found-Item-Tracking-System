import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { QrCode, Shield } from 'lucide-react';

const ModeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart Solution to Reduce
            <br />
            Lost Belongings in School
          </h1>
          <p className="text-lg text-gray-600">
            Select how you want to use this application
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
            onClick={() => navigate('/scanner')}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                I Found / Got a Lost Item
              </h2>
              <p className="text-gray-600 mb-6">
                Scan the QR code on the lost item to notify the owner
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Open Scanner
              </Button>
            </div>
          </Card>

          <Card
            className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
            onClick={() => navigate('/login')}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900">
                Owner / Generate New QR Code
              </h2>
              <p className="text-gray-600 mb-6">
                Create and manage QR codes for your belongings
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Login / Register
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Scanner mode is used by the person who found the item.</p>
          <p>Owner mode is used by parents to generate and manage QR codes for their children's belongings.</p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
