import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Camera, CheckCircle, QrCode } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ScannerMode = () => {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState(null);
  const [qrInput, setQrInput] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const simulateScan = () => {
    const sampleData = {
      ownerName: 'Amit Kumar',
      studentName: 'Rahul',
      itemName: 'Water Bottle',
      mobile: '9876543210'
    };
    setScannedData(sampleData);
    setSmsSent(true);
    
    toast({
      title: "QR Code Scanned Successfully!",
      description: `SMS sent to ${sampleData.mobile}: 'Your ${sampleData.itemName} was found at school.'`,
    });
  };

  const parseQRInput = () => {
    if (!qrInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter QR data",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = JSON.parse(qrInput);
      const processedData = {
        ownerName: data.ownerName || 'Unknown Owner',
        studentName: data.studentName || data.name || 'Unknown',
        itemName: data.itemName || data.item || 'Item',
        mobile: data.mobile || 'Unknown'
      };
      setScannedData(processedData);
      setSmsSent(true);
      
      toast({
        title: "QR Data Parsed Successfully!",
        description: `SMS sent to ${processedData.mobile}: 'Your ${processedData.itemName} was found at school.'`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Invalid QR data format. Please use valid JSON.",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Camera className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Scan QR Code
            </h1>
            <p className="text-gray-600">
              Found a lost item? Scan the QR code to notify the owner
            </p>
          </div>

          {!scannedData ? (
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-12 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <QrCode className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-6">
                    Camera view would appear here in real app
                  </p>
                  <Button
                    onClick={simulateScan}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Simulate QR Scan
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or paste QR data</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder='Paste QR data here (e.g., {"name":"Rahul","item":"Water Bottle","mobile":"9876543210"})'
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={parseQRInput}
                  variant="outline"
                  className="w-full"
                >
                  Parse QR Data
                </Button>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm text-gray-600">
                  <strong>Note:</strong> In the real app, SMS would be sent automatically after user grants permission.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-6">
              {smsSent && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 ml-2">
                    Notification sent to owner successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">QR Code Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col p-3 bg-white rounded border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase">Tag Created By:</span>
                    <span className="text-xl font-bold text-gray-900">{scannedData.ownerName}</span>
                  </div>
                  
                  <div className="flex flex-col p-3 bg-white rounded border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase">Owner Contact Phone:</span>
                    <span className="text-xl font-bold text-gray-900">{scannedData.mobile}</span>
                  </div>

                  <div className="pt-2 border-t border-blue-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Student:</span>
                      <span className="font-semibold text-gray-700">{scannedData.studentName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Item Name:</span>
                      <span className="font-semibold text-gray-700">{scannedData.itemName}</span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>SMS sent to {scannedData.mobile}:</strong>
                  <br />
                  "Your {scannedData.itemName} was found at school. Please contact the owner at {scannedData.mobile}."
                </p>
              </div>

              <Button
                onClick={() => {
                  setScannedData(null);
                  setSmsSent(false);
                  setQrInput('');
                }}
                className="w-full"
                variant="outline"
              >
                Scan Another Item
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ScannerMode;
