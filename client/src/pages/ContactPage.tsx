import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactForm } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', data);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon."
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Address',
      details: ['123 Fashion Street', 'New York, NY 10001']
    },
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      details: ['+1 (555) 123-4567']
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      details: ['hello@stylecraft.com']
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4" data-testid="contact-title">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-primary mb-6" data-testid="contact-form-title">
              Send us a message
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-4 font-semibold btn-hover"
                  disabled={isSubmitting}
                  data-testid="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-6" data-testid="contact-info-title">
                Get in touch
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start" data-testid={`contact-info-${index}`}>
                    <div className="bg-secondary text-secondary-foreground w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <i className={`${info.icon} text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-1">{info.title}</h4>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-6" data-testid="business-hours-title">
                Business Hours
              </h3>
              <div className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between" data-testid={`business-hours-${index}`}>
                    <span className="text-muted-foreground">{schedule.day}</span>
                    <span className="font-medium text-primary">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="bg-card rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-6">Need immediate help?</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  For urgent inquiries, you can reach us directly at:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center text-primary">
                    <i className="fas fa-phone mr-2 text-secondary"></i>
                    <span className="font-semibold">+1 (555) 123-4567</span>
                  </p>
                  <p className="flex items-center text-primary">
                    <i className="fas fa-envelope mr-2 text-secondary"></i>
                    <span className="font-semibold">support@stylecraft.com</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Average response time: 2-4 hours during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-primary mb-3">What are your shipping options?</h3>
              <p className="text-muted-foreground">
                We offer free standard shipping on orders over $50. Express shipping is available for an additional fee.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-primary mb-3">What is your return policy?</h3>
              <p className="text-muted-foreground">
                We accept returns within 30 days of purchase. Items must be unworn and in original condition.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-primary mb-3">Do you offer size exchanges?</h3>
              <p className="text-muted-foreground">
                Yes! We offer free size exchanges on your first exchange within 30 days of purchase.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-primary mb-3">How can I track my order?</h3>
              <p className="text-muted-foreground">
                Once your order ships, you'll receive a tracking number via email to monitor your package.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
