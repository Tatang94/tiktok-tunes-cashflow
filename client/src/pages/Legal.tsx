import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Users, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

const Legal = () => {
  const documents = [
    {
      title: "Terms of Service",
      description: "Syarat dan ketentuan penggunaan platform",
      lastUpdated: "15 Januari 2025",
      status: "Active",
      type: "Required"
    },
    {
      title: "Privacy Policy",
      description: "Kebijakan privasi dan perlindungan data",
      lastUpdated: "15 Januari 2025", 
      status: "Active",
      type: "Required"
    },
    {
      title: "Creator Agreement",
      description: "Perjanjian khusus untuk content creator",
      lastUpdated: "15 Januari 2025",
      status: "Active", 
      type: "Creator Only"
    },
    {
      title: "Payment Terms",
      description: "Ketentuan pembayaran dan komisi",
      lastUpdated: "15 Januari 2025",
      status: "Active",
      type: "Financial"
    }
  ];

  const faqs = [
    {
      question: "Apakah saya bisa menggunakan musik berlisensi?",
      answer: "Ya, semua musik di platform kami sudah berlisensi resmi. Anda bebas menggunakan untuk konten komersial tanpa khawatir copyright strike."
    },
    {
      question: "Bagaimana cara kerja sistem pembayaran?",
      answer: "Pembayaran dilakukan setiap minggu ke e-wallet yang sudah didaftarkan. Minimum payout adalah Rp 50,000 dengan komisi 70% untuk creator dan 30% untuk platform."
    },
    {
      question: "Apakah boleh menggunakan konten untuk platform lain?",
      answer: "Anda boleh menggunakan musik yang sama untuk platform lain (Instagram, YouTube), namun earning hanya dihitung dari video TikTok yang menggunakan link affiliate kami."
    },
    {
      question: "Bagaimana jika ada masalah copyright?",
      answer: "Tim legal kami akan menangani semua masalah copyright. Anda dilindungi 100% selama menggunakan musik dari library platform kami."
    },
    {
      question: "Apakah ada batasan jenis konten?",
      answer: "Konten harus sesuai dengan community guidelines TikTok. Dilarang konten dewasa, kekerasan, atau yang melanggar hukum Indonesia."
    },
    {
      question: "Bagaimana cara mengakhiri kerjasama?",
      answer: "Anda bisa mengakhiri kerjasama kapan saja dengan notice 7 hari. Earning yang belum dibayar akan tetap diproses sesuai jadwal."
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="mb-4"
          >
            ← Kembali
          </Button>
          <h1 className="text-4xl font-bold mb-4">Legal & Compliance</h1>
          <p className="text-xl text-muted-foreground">
            Informasi legal, kebijakan, dan ketentuan platform
          </p>
        </div>

        {/* Legal Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dokumen Legal
            </CardTitle>
            <p className="text-muted-foreground">
              Dokumen resmi yang mengatur penggunaan platform
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <Badge variant={doc.type === "Required" ? "default" : "secondary"}>
                        {doc.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {doc.lastUpdated}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Button variant="outline" size="sm">
                      Lihat Dokumen
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Creator Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Hak & Kewajiban Creator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Hak Creator
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Menggunakan semua musik dalam library</li>
                  <li>• Mendapat 70% dari revenue sharing</li>
                  <li>• Support teknis dan legal 24/7</li>
                  <li>• Analytics dan insights detail</li>
                  <li>• Pembayaran mingguan terjamin</li>
                  <li>• Proteksi copyright penuh</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Kewajiban Creator
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Menggunakan musik hanya dari platform</li>
                  <li>• Credit music sesuai ketentuan</li>
                  <li>• Konten sesuai community guidelines</li>
                  <li>• Report revenue secara akurat</li>
                  <li>• Tidak melanggar ToS platform</li>
                  <li>• Memberikan data analytics jika diminta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Commission */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Ketentuan Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-green-600">Creator Share</h3>
                  <p className="text-2xl font-bold">70%</p>
                  <p className="text-sm text-muted-foreground">Dari total revenue</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-600">Platform Fee</h3>
                  <p className="text-2xl font-bold">30%</p>
                  <p className="text-sm text-muted-foreground">Operasional & lisensi</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-purple-600">Min Payout</h3>
                  <p className="text-2xl font-bold">Rp 50K</p>
                  <p className="text-sm text-muted-foreground">Pembayaran mingguan</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Jadwal Pembayaran</h4>
                <p className="text-sm text-muted-foreground">
                  Pembayaran dilakukan setiap hari Senin untuk earnings minggu sebelumnya. 
                  Transfer ke e-wallet dilakukan dalam 1-3 hari kerja.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <p className="text-muted-foreground">
              Pertanyaan umum seputar legal dan ketentuan platform
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Kontak Legal Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ada pertanyaan legal atau butuh klarifikasi tentang ketentuan? 
                Tim legal kami siap membantu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">
                  📧 Email Legal Team
                </Button>
                <Button variant="outline" className="flex-1">
                  💬 Chat Legal Support
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground border-t pt-4">
                <p><strong>Email:</strong> legal@tiktok-creator.com</p>
                <p><strong>Response time:</strong> 1-2 hari kerja</p>
                <p><strong>Consultation hours:</strong> Senin-Jumat, 09:00-17:00 WIB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Legal;