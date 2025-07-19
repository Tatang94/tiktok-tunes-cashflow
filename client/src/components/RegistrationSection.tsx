import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Wallet, Users } from "lucide-react";
import { useLocation } from "wouter";

const RegistrationSection = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formData, setFormData] = useState({
    tiktok_username: "",
    email: "",
    phone: "",
    ewallet_type: "",
    ewallet_number: ""
  });
  const [loginData, setLoginData] = useState({
    tiktok_username: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referrerInfo, setReferrerInfo] = useState<any>(null);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferrerInfo(null);
      return;
    }

    setValidatingReferral(true);
    try {
      const response = await fetch(`/api/referrals/validate/${code}`);
      if (response.ok) {
        const data = await response.json();
        setReferrerInfo(data.referrer);
        toast({
          title: "Referral Valid!",
          description: `Direferensikan oleh ${data.referrer.tiktok_username}. Kamu akan mendapat bonus registrasi!`
        });
      } else {
        setReferrerInfo(null);
        toast({
          title: "Kode Referral Invalid",
          description: "Kode referral tidak ditemukan atau sudah expired",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error validating referral:', error);
      setReferrerInfo(null);
    } finally {
      setValidatingReferral(false);
    }
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
      // Prepare data with referral info if available
      const submissionData = {
        ...formData,
        total_earnings: 0,
        video_count: 0,
        ...(referrerInfo && { referred_by: referrerInfo.id })
      };

      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('creators')
        .insert([submissionData]);

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
        description: referrerInfo 
          ? `Akun creator berhasil didaftarkan dengan referral dari ${referrerInfo.tiktok_username}!` 
          : "Akun creator kamu sudah aktif. Yuk mulai upload video!"
      });

      // Store creator info for session
      localStorage.setItem('currentCreator', JSON.stringify({
        ...formData,
        total_earnings: 0,
        video_count: 0,
        id: Date.now().toString(),
        referral_code: `${formData.tiktok_username?.replace('@', '').toUpperCase()}-REF-NEW`
      }));

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

  const handleLogin = async () => {
    // Validasi login
    const tiktokPattern = /^@[a-zA-Z0-9._]{2,23}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!tiktokPattern.test(loginData.tiktok_username)) {
      toast({
        title: "Username Invalid",
        description: "TikTok username harus dimulai dengan @ (contoh: @username123)",
        variant: "destructive"
      });
      return;
    }

    if (!emailPattern.test(loginData.email)) {
      toast({
        title: "Email Invalid",
        description: "Masukkan email yang valid",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const supabase = await getSupabaseClient();
      const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .eq('tiktok_username', loginData.tiktok_username)
        .eq('email', loginData.email)
        .single();

      if (error || !creator) {
        toast({
          title: "Login Gagal",
          description: "Username atau email tidak ditemukan. Silakan daftar terlebih dahulu.",
          variant: "destructive"
        });
        return;
      }

      // Store creator info in localStorage for session
      localStorage.setItem('currentCreator', JSON.stringify(creator));
      
      toast({
        title: "Login Berhasil! 🎉",
        description: `Selamat datang kembali, ${creator.tiktok_username}!`
      });

      // Reset form
      setLoginData({
        tiktok_username: "",
        email: ""
      });

      // Redirect to creator dashboard
      setLocation('/creator-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal login. Coba lagi!",
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
            {isLoginMode ? "Login Creator" : "Daftar Sekarang & Dashboard"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {isLoginMode ? "Sudah punya akun? Masuk sekarang!" : "Mulai journey monetize TikTok kamu hari ini!"}
          </p>
        </div>
        
        <Card className="border-2 border-tiktok-purple/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLoginMode ? "Login Creator" : "Form Pendaftaran Creator"}
            </CardTitle>
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant={!isLoginMode ? "default" : "outline"}
                onClick={() => setIsLoginMode(false)}
                className="px-6"
              >
                Daftar Baru
              </Button>
              <Button
                variant={isLoginMode ? "default" : "outline"}
                onClick={() => setIsLoginMode(true)}
                className="px-6"
              >
                Sudah Punya Akun
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoginMode ? (
              // Login Form
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-tiktok" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username TikTok
                  </Label>
                  <Input 
                    id="login-tiktok" 
                    value={loginData.tiktok_username}
                    onChange={(e) => handleLoginInputChange('tiktok_username', e.target.value)}
                    placeholder="@username_tiktok" 
                    className="border-2 focus:border-tiktok-pink"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input 
                    id="login-email" 
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleLoginInputChange('email', e.target.value)}
                    placeholder="email@example.com" 
                    className="border-2 focus:border-tiktok-pink"
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 Masukkan username TikTok dan email yang sama dengan waktu pendaftaran
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" 
                  size="lg" 
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Masuk..." : "🔐 Masuk ke Dashboard"}
                </Button>
              </div>
            ) : (
              // Registration Form
              <div className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="referral-code" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Kode Referral (Opsional)
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="referral-code"
                      value={referralCode}
                      onChange={(e) => {
                        setReferralCode(e.target.value);
                        if (e.target.value) {
                          validateReferralCode(e.target.value);
                        } else {
                          setReferrerInfo(null);
                        }
                      }}
                      placeholder="CREATOR-REF-123 (dapat bonus Rp 500)" 
                      className="border-2 focus:border-tiktok-pink flex-1"
                    />
                    {validatingReferral && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        Loading...
                      </div>
                    )}
                  </div>
                  {referrerInfo && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ Referral valid! Direferensikan oleh <strong>{referrerInfo.tiktok_username}</strong>
                        <br />
                        🎁 Kamu akan mendapat bonus registrasi!
                      </p>
                    </div>
                  )}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationSection;