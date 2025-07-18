import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Wallet } from "lucide-react";
import { useLocation } from "wouter";

const RegistrationSection = () => {
  const [formData, setFormData] = useState({
    tiktok_username: "",
    email: "",
    phone: "",
    ewallet_type: "",
    ewallet_number: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Validasi TikTok username (harus dimulai dengan @ dan 3-24 karakter)
    const tiktokPattern = /^@[a-zA-Z0-9._]{2,23}$/;
    if (!tiktokPattern.test(formData.tiktok_username)) {
      toast({
        title: "TikTok Username Invalid",
        description: "Username harus dimulai dengan @ dan terdiri dari 3-24 karakter (huruf, angka, titik, underscore)",
        variant: "destructive"
      });
      return false;
    }

    // Validasi email dengan format yang benar
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast({
        title: "Email Invalid",
        description: "Masukkan email yang valid (contoh: nama@gmail.com)",
        variant: "destructive"
      });
      return false;
    }

    // Validasi nomor telepon Indonesia (08xxxxxxxxx atau +62xxxxxxxxx)
    const phonePattern = /^(\+62|62|0)[8-9][0-9]{8,11}$/;
    if (!phonePattern.test(formData.phone)) {
      toast({
        title: "Nomor Telepon Invalid",
        description: "Masukkan nomor telepon Indonesia yang valid (contoh: 081234567890)",
        variant: "destructive"
      });
      return false;
    }

    // Validasi e-wallet number (minimal 10 digit)
    if (formData.ewallet_number.length < 10 || !/^\d+$/.test(formData.ewallet_number)) {
      toast({
        title: "Nomor E-Wallet Invalid",
        description: "Nomor e-wallet harus berisi minimal 10 digit angka",
        variant: "destructive"
      });
      return false;
    }

    // Validasi field kosong
    if (!formData.tiktok_username || !formData.email || !formData.phone || !formData.ewallet_type || !formData.ewallet_number) {
      toast({
        title: "Form Belum Lengkap",
        description: "Semua field harus diisi dengan benar!",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('creators')
        .insert([{
          ...formData,
          total_earnings: 0,
          video_count: 0
        }]);

      if (error) {
        console.error('Registration error:', error);
        
        // Check if it's a table not found error
        if (error.code === '42P01') {
          toast({
            title: "Database Belum Siap",
            description: "Silakan setup database terlebih dahulu menggunakan file database-clean-setup.sql",
            variant: "destructive"
          });
          return;
        }
        
        throw error;
      }

      toast({
        title: "Pendaftaran Berhasil! 🎉",
        description: "Akun creator kamu sudah aktif. Yuk mulai upload video!"
      });

      // Reset form
      setFormData({
        tiktok_username: "",
        email: "",
        phone: "",
        ewallet_type: "",
        ewallet_number: ""
      });

      // Redirect to creator dashboard
      setLocation('/creator-dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal mendaftar. Coba lagi!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="registration-section" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Daftar Sekarang & Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Mulai journey monetize TikTok kamu hari ini!
          </p>
        </div>
        
        <Card className="border-2 border-tiktok-purple/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Form Pendaftaran Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tiktok-name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nama TikTok
                </Label>
                <Input 
                  id="tiktok-name" 
                  value={formData.tiktok_username}
                  onChange={(e) => handleInputChange('tiktok_username', e.target.value)}
                  placeholder="@username_tiktok (contoh: @creativegirl123)" 
                  className="border-2 focus:border-tiktok-pink"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="nama@gmail.com (harus email valid)" 
                  className="border-2 focus:border-tiktok-pink"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor HP
                </Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="081234567890 (nomor Indonesia valid)" 
                  className="border-2 focus:border-tiktok-pink"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ewallet" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Akun eWallet
                </Label>
                <Select value={formData.ewallet_type} onValueChange={(value) => handleInputChange('ewallet_type', value)}>
                  <SelectTrigger className="border-2 focus:border-tiktok-pink">
                    <SelectValue placeholder="Pilih eWallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dana">DANA</SelectItem>
                    <SelectItem value="ovo">OVO</SelectItem>
                    <SelectItem value="gopay">GoPay</SelectItem>
                    <SelectItem value="shopeepay">ShopeePay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ewallet-number">Nomor eWallet</Label>
              <Input 
                id="ewallet-number"
                value={formData.ewallet_number}
                onChange={(e) => handleInputChange('ewallet_number', e.target.value)}
                placeholder="081234567890 (minimal 10 digit angka)" 
                className="border-2 focus:border-tiktok-pink"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Benefit yang kamu dapatkan:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Akses ke semua lagu trending</li>
                <li>✅ Dashboard tracking video & earnings</li>
                <li>✅ Payment otomatis setiap minggu</li>
                <li>✅ Support 24/7 dari tim kami</li>
              </ul>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white" 
              size="lg" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Mendaftar..." : "🔘 Daftar & Mulai Mengupload Video"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationSection;