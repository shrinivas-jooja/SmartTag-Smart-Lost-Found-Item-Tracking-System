import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Menu, Bell, QrCode, User, UserPlus, List, LogOut, CheckCircle, Download, X, Phone, MapPin } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { getMembersByOwner, createQRCode } from '../lib/database';

const OwnerMode = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    item: '',
    mobile: ''
  });
  const [members, setMembers] = useState([]);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      itemName: 'Water Bottle',
      finderName: 'Amit Sharma',
      finderMobile: '9845612378',
      location: 'School Playground',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      itemName: 'Lunch Box',
      finderName: 'Priya Verma',
      finderMobile: '9876501234',
      location: 'Class 5-A',
      time: '5 hours ago',
      read: false
    }
  ]);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    }
    loadMembers();
  }, [navigate]);

  const loadMembers = async () => {
    try {
      const ownerId = localStorage.getItem('ownerId');
      if (ownerId) {
        const membersData = await getMembersByOwner(ownerId);
        setMembers(membersData);
      }
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.item || !formData.mobile) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const ownerId = localStorage.getItem('ownerId');
      const ownerName = localStorage.getItem('ownerName') || 'Owner';
      
      const newQR = {
        code: `QR-${Date.now()}`,
        data: JSON.stringify({ 
          ownerName: ownerName,
          studentName: formData.name, 
          itemName: formData.item, 
          mobile: formData.mobile 
        }),
        owner_id: ownerId,
        name: formData.name, // Display name
        item: formData.item,
        mobile: formData.mobile
      };
      
      const createdQR = await createQRCode(newQR);

      toast({
        title: "QR Code Generated Successfully!",
        description: `QR code created for ${formData.name}'s ${formData.item}`,
      });

      setGeneratedQR(createdQR);
      // Reset form but keep item details in view via generatedQR state
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  const handleDownloadQR = () => {
    if (!generatedQR) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 400;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 400);
    
    // QR Code Placeholder
    ctx.fillStyle = '#000000';
    const qrSize = 240;
    const startX = 30;
    const startY = 30;
    const cellSize = 8;

    // Draw positioning squares
    const drawPosSquare = (x, y) => {
      ctx.fillRect(x, y, 56, 56);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + cellSize, y + cellSize, 40, 40);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + cellSize * 2, y + cellSize * 2, 24, 24);
    };

    drawPosSquare(startX, startY);
    drawPosSquare(startX + qrSize - 56, startY);
    drawPosSquare(startX, startY + qrSize - 56);

    // Random pattern
    for (let i = 0; i < qrSize / cellSize; i++) {
      for (let j = 0; j < qrSize / cellSize; j++) {
        if ((i < 7 && j < 7) || (i > 22 && j < 7) || (i < 7 && j > 22)) continue;
        if (Math.random() > 0.4) {
          ctx.fillRect(startX + i * cellSize, startY + j * cellSize, cellSize, cellSize);
        }
      }
    }

    // Name at bottom
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(generatedQR.name, 150, 350);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SmartTag_${generatedQR.name}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });

    toast({
      title: "QR Code Downloaded!",
      description: "Simple tag with QR and Name only",
    });
  };



  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('ownerId');
    localStorage.removeItem('ownerName');
    navigate('/');
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };


  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => { navigate('/owner/profile'); setMenuOpen(false); }}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile & Members
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => { navigate('/owner/add-member'); setMenuOpen(false); }}
                >
                  <UserPlus className="w-4 h-4 mr-3" />
                  Add Member
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => { navigate('/owner/qr-list'); setMenuOpen(false); }}
                >
                  <List className="w-4 h-4 mr-3" />
                  Generated QR Codes
                </Button>
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-gray-900">Owner Dashboard</h1>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-sm text-gray-600">{unreadCount} new notification{unreadCount !== 1 ? 's' : ''}</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50' : ''}`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            Your {notif.itemName} was found!
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Found by: <span className="font-medium">{notif.finderName}</span>
                          </p>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          <span>{notif.finderMobile}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-2" />
                          <span>{notif.location}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notif.time}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${notif.finderMobile}`;
                          }}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Generate QR Code for Item
            </h2>
            <p className="text-gray-600">
              Create a QR code to attach to your belongings
            </p>
          </div>

          <form onSubmit={handleGenerateQR} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Owner/Student Name)</Label>
              <Input
                id="name"
                placeholder="e.g., Rahul Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">Item Name</Label>
              <Input
                id="item"
                placeholder="e.g., Water Bottle, Lunch Box, School Bag"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number (Registered)</Label>
              <Input
                id="mobile"
                placeholder="e.g., 9876543210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <QrCode className="w-5 h-5 mr-2" />
              Generate QR Code
            </Button>
          </form>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Fill in the details and generate QR code</li>
                  <li>Print and attach the QR code to your item</li>
                  <li>If someone finds your item, they scan the QR code</li>
                  <li>You'll automatically receive an SMS notification</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {generatedQR && (
          <Card className="p-8 mt-6 relative border-2 border-blue-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setGeneratedQR(null)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                QR Code Generated!
              </h3>
              <p className="text-gray-600 mb-8">
                Ready to print and attach to your belongings.
              </p>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* QR Display */}
                <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm inline-block">
                  <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300">
                    <div className="w-52 h-52 relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect x="5" y="5" width="25" height="25" fill="#2563eb" />
                        <rect x="10" y="10" width="15" height="15" fill="white" />
                        <rect x="13" y="13" width="9" height="9" fill="#2563eb" />
                        <rect x="70" y="5" width="25" height="25" fill="#2563eb" />
                        <rect x="75" y="10" width="15" height="15" fill="white" />
                        <rect x="78" y="13" width="9" height="9" fill="#2563eb" />
                        <rect x="5" y="70" width="25" height="25" fill="#2563eb" />
                        <rect x="10" y="75" width="15" height="15" fill="white" />
                        <rect x="13" y="78" width="9" height="9" fill="#2563eb" />
                        {Array.from({ length: 120 }).map((_, i) => {
                          const x = (i % 12) * 8 + 35;
                          const y = Math.floor(i / 12) * 8 + 35;
                          if (Math.random() > 0.4 && !(x < 35 && y < 35)) {
                            return <rect key={i} x={x} y={y} width="6" height="6" fill="black" />;
                          }
                          return null;
                        })}
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Smart School Tag</p>
                  </div>
                </div>

                {/* Details Display */}
                <div className="text-left space-y-4">
                  <div className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-100">
                    <div>
                      <Label className="text-gray-500 text-xs uppercase tracking-wider">Registered Owner</Label>
                      <p className="text-lg font-bold text-gray-900">{localStorage.getItem('ownerName') || 'You'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500 text-xs uppercase tracking-wider">Student Name</Label>
                      <p className="text-lg font-semibold text-gray-800">{generatedQR.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 text-xs uppercase tracking-wider">Item</Label>
                        <p className="font-medium text-gray-800">{generatedQR.item}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs uppercase tracking-wider">Contact</Label>
                        <p className="font-medium text-gray-800">{generatedQR.mobile}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleDownloadQR} size="lg" className="w-full bg-green-600 hover:bg-green-700 shadow-md">
                    <Download className="w-5 h-5 mr-2" />
                    Download PNG Image
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-left">
                <div className="flex items-center text-blue-800 mb-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-sm">QR Data encoded:</span>
                </div>
                <code className="text-xs bg-white p-2 rounded block border border-blue-100 overflow-x-auto text-blue-600 font-mono">
                  {JSON.stringify({ 
                    owner: localStorage.getItem('ownerName'),
                    student: generatedQR.name,
                    item: generatedQR.item,
                    contact: generatedQR.mobile
                  })}
                </code>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default OwnerMode;
