import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Book,
  Video,
  FileText,
  Headphones
} from "lucide-react";

const Support = () => {
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    category: "",
    priority: "",
    subject: "",
    description: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const supportChannels = [
    {
      name: "Live Chat",
      description: "Chat langsung dengan tim support",
      availability: "24/7",
      responseTime: "< 5 menit",
      icon: MessageCircle,
      status: "online",
      action: "Mulai Chat"
    },
    {
      name: "WhatsApp Support",
      description: "Support via WhatsApp Business",
      availability: "06:00 - 24:00 WIB",
      responseTime: "< 15 menit",
      icon: Phone,
      status: "online",
      action: "Chat WhatsApp"
    },
    {
      name: "Email Support", 
      description: "Support via email untuk masalah kompleks",
      availability: "24/7",
      responseTime: "1-4 jam",
      icon: Mail,
      status: "online",
      action: "Kirim Email"
    },
    {
      name: "Video Call",
      description: "Konsultasi langsung via video call",
      availability: "Jadwal appointment",
      responseTime: "Sesuai jadwal",
      icon: Video,
      status: "appointment",
      action: "Book Meeting"
    }
  ];

  const faqCategories = [
    {
      category: "Getting Started",
      icon: "🚀",
      questions: [
        {
          q: "Bagaimana cara mendaftar sebagai creator?",
          a: "Klik 'Daftar Creator' di homepage, isi form dengan data valid, dan tunggu approval tim kami dalam 24 jam."
        },
        {
          q: "Apa syarat menjadi creator di platform ini?",
          a: "Minimal follower TikTok 1000, konten original, dan mematuhi community guidelines."
        },
        {
          q: "Berapa lama proses verifikasi akun?",
          a: "Verifikasi biasanya selesai dalam 1-2 hari kerja setelah submit dokumen lengkap."
        }
      ]
    },
    {
      category: "Payments & Earnings",
      icon: "💰",
      questions: [
        {
          q: "Kapan saya mendapat pembayaran pertama?",
          a: "Pembayaran pertama dilakukan setelah mencapai minimum payout Rp 50,000 pada hari Senin."
        },
        {
          q: "Bagaimana cara menghitung earnings per video?",
          a: "Earnings dihitung berdasarkan views, engagement rate, dan tier lagu yang digunakan."
        },
        {
          q: "Apakah ada fee atau potongan pembayaran?",
          a: "Platform mengambil 30% sebagai biaya operasional, creator mendapat 70% dari total revenue."
        }
      ]
    },
    {
      category: "Technical Issues",
      icon: "🔧",
      questions: [
        {
          q: "Video saya tidak muncul di dashboard?",
          a: "Tunggu 24-48 jam untuk sync data. Jika masih belum muncul, hubungi support dengan link video."
        },
        {
          q: "Cara upload video yang benar?",
          a: "Upload di TikTok dengan hashtag dan musik dari library kami, lalu submit link di dashboard."
        },
        {
          q: "Dashboard error atau tidak bisa login?",
          a: "Clear browser cache, coba browser lain, atau reset password. Hubungi support jika masih bermasalah."
        }
      ]
    }
  ];

  const handleTicketSubmit = () => {
    if (!ticketForm.name || !ticketForm.email || !ticketForm.subject || !ticketForm.description) {
      toast({
        title: "Form Belum Lengkap",
        description: "Mohon isi semua field yang required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket Berhasil Dikirim! 🎉",
      description: "Tim support akan merespon dalam 1-4 jam. Cek email untuk update ticket."
    });

    setTicketForm({
      name: "",
      email: "",
      category: "",
      priority: "",
      subject: "",
      description: ""
    });
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="mb-4"
          >
            ← Kembali
          </Button>
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-muted-foreground">
            Bantuan 24/7 untuk semua kebutuhan creator
          </p>
        </div>

        <Tabs defaultValue="channels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="channels">Support Channels</TabsTrigger>
            <TabsTrigger value="faq">FAQ & Help</TabsTrigger>
            <TabsTrigger value="ticket">Create Ticket</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Support Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportChannels.map((channel, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <channel.icon className="w-6 h-6 text-blue-500" />
                        <CardTitle>{channel.name}</CardTitle>
                      </div>
                      <Badge 
                        variant={channel.status === "online" ? "default" : "secondary"}
                        className={channel.status === "online" ? "bg-green-500" : ""}
                      >
                        {channel.status === "online" ? "Online" : "By Appointment"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{channel.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Availability
                        </p>
                        <p className="text-muted-foreground">{channel.availability}</p>
                      </div>
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-muted-foreground">{channel.responseTime}</p>
                      </div>
                    </div>
                    <Button className="w-full">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <p className="text-muted-foreground">Aksi cepat untuk masalah umum</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
                    <FileText className="w-6 h-6" />
                    <span>Download Panduan</span>
                  </Button>
                  <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
                    <Video className="w-6 h-6" />
                    <span>Tutorial Video</span>
                  </Button>
                  <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>System Status</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pertanyaan atau kata kunci..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {(searchQuery ? filteredFAQs : faqCategories).map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border-b last:border-b-0 pb-4 last:pb-0">
                          <h3 className="font-medium mb-2 flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            {faq.q}
                          </h3>
                          <p className="text-muted-foreground ml-6">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Ticket Tab */}
          <TabsContent value="ticket" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
                <p className="text-muted-foreground">
                  Tidak menemukan jawaban di FAQ? Buat ticket untuk bantuan personal
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm(prev => ({...prev, name: e.target.value}))}
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm(prev => ({...prev, email: e.target.value}))}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori masalah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account & Login</SelectItem>
                        <SelectItem value="payment">Payment & Earnings</SelectItem>
                        <SelectItem value="technical">Technical Issues</SelectItem>
                        <SelectItem value="content">Content & Upload</SelectItem>
                        <SelectItem value="legal">Legal & Compliance</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm(prev => ({...prev, priority: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tingkat prioritas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Pertanyaan umum</SelectItem>
                        <SelectItem value="medium">Medium - Perlu bantuan</SelectItem>
                        <SelectItem value="high">High - Masalah urgent</SelectItem>
                        <SelectItem value="critical">Critical - Sistem error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({...prev, subject: e.target.value}))}
                    placeholder="Ringkasan singkat masalah Anda"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Masalah *</Label>
                  <Textarea
                    id="description"
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Jelaskan masalah Anda secara detail..."
                    rows={6}
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Tips:</strong> Sertakan informasi detail seperti username TikTok, 
                    link video, screenshot error, atau browser yang digunakan untuk mempercepat penyelesaian.
                  </p>
                </div>
                
                <Button onClick={handleTicketSubmit} className="w-full" size="lg">
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-500" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Panduan lengkap menggunakan platform
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      📖 Getting Started Guide
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🎵 Music Library Guide
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      💰 Earnings Calculator
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      📊 Analytics Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Tutorial video step-by-step
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🎥 Platform Overview
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🎬 Content Creation Tips
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      📈 Maximize Earnings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🔧 Troubleshooting
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-green-500" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Bergabung dengan komunitas creator
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      💬 Telegram Group
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      📱 WhatsApp Community
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🔔 Announcements
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🏆 Success Stories
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Platform</span>
                    <Badge className="bg-green-500 text-white ml-auto">Operational</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">API</span>
                    <Badge className="bg-green-500 text-white ml-auto">Operational</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Payments</span>
                    <Badge className="bg-green-500 text-white ml-auto">Operational</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Analytics</span>
                    <Badge className="bg-green-500 text-white ml-auto">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;