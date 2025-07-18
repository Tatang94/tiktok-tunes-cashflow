import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Aku udah bikin 200 video dan dapet Rp 20.000 cuma dalam seminggu!",
      author: "@fikrifauzan",
      avatar: "FF",
      rating: 5
    },
    {
      text: "Sambil bikin konten biasa, bisa dapet tambahan uang juga 😎",
      author: "@dindamakeup", 
      avatar: "DM",
      rating: 5
    },
    {
      text: "Platform paling legit untuk monetize TikTok, payout cepet banget!",
      author: "@creativejkt",
      avatar: "CJ", 
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Testimoni Kreator
          </h2>
          <p className="text-xl text-muted-foreground">
            Lihat apa kata creator yang udah merasakan manfaatnya
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-lg mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-tiktok-pink to-tiktok-purple flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-tiktok-blue">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Verified Creator
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;