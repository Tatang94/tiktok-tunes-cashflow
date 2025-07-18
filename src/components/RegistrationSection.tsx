import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Wallet } from "lucide-react";

const RegistrationSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
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
                  placeholder="@username_tiktok" 
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
                  placeholder="email@example.com" 
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
                  placeholder="08123456789" 
                  className="border-2 focus:border-tiktok-pink"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ewallet" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Akun eWallet
                </Label>
                <Select>
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
                placeholder="08123456789" 
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
            
            <Button className="w-full" size="lg" variant="tiktok">
              🔘 Daftar & Mulai Mengupload Video
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RegistrationSection;