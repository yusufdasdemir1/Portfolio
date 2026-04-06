export type Locale = 'en' | 'tr';
export type Theme = 'dark' | 'light';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact'
    },
    controls: {
      language: 'TR',
      languageLabel: 'Switch language',
      theme: 'Light',
      darkTheme: 'Dark',
      themeLabel: 'Switch theme'
    },
    hero: {
      badge: 'Available for internships & collaboration',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      downloadCv: 'Download CV'
    },
    sections: {
      aboutEyebrow: 'About',
      aboutTitle: 'Building robust software with a backend-first mindset',
      skillsEyebrow: 'Skills',
      skillsTitle: 'Technical strengths',
      skillsDescription:
        'I focus on practical engineering capabilities that help build, deploy, and maintain backend software systems effectively.',
      projectsEyebrow: 'Projects',
      projectsTitle: 'Selected software projects',
      projectsDescription:
        'This section uses a structured data source for easy edits. Replace links, titles, and descriptions with your real work anytime.',
      projectsEmpty: 'Projects will appear here once added to the projects data file.',
      experienceEyebrow: 'Experience & Education',
      experienceTitle: 'Professional timeline',
      experienceDescription:
        'A concise view of education and practical experience across internships, freelance work, and backend-focused projects.',
      contactEyebrow: 'Contact',
      contactTitle: 'Let’s build something meaningful',
      contactDescription:
        'If you are looking for a backend-focused developer for internships, project work, or collaborations, feel free to reach out.'
    },
    misc: {
      location: 'Location',
      liveDemo: 'Live Demo ↗',
      liveDemoUnavailable: 'Live Demo unavailable',
      professionalLinks: 'Professional Links',
      directCommunication:
        'Prefer direct communication? Email me with your role, context, and timelines, and I will get back to you promptly.',
      footer: 'Designed with a clean backend-focused portfolio style.',
      backToTop: 'Back to top'
    },
    form: {
      name: 'Name',
      namePlaceholder: 'Your full name',
      email: 'Email',
      subject: 'Subject',
      subjectPlaceholder: 'How can I help you?',
      message: 'Message',
      messagePlaceholder: 'Tell me about your project, role, or collaboration idea...',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully. I will get back to you soon.',
      secureText: 'This form is protected with server-side validation, a honeypot field, and basic rate limiting.',
      validation: {
        name: 'Please enter your full name.',
        email: 'Please enter a valid email address.',
        subject: 'Please provide a subject.',
        message: 'Please write at least 15 characters.',
        company: 'Bot submission rejected.'
      }
    }
  },
  tr: {
    nav: {
      home: 'Anasayfa',
      about: 'Hakkımda',
      skills: 'Yetenekler',
      projects: 'Projeler',
      experience: 'Deneyim',
      contact: 'İletişim'
    },
    controls: {
      language: 'EN',
      languageLabel: 'Dili değiştir',
      theme: 'Açık',
      darkTheme: 'Koyu',
      themeLabel: 'Temayı değiştir'
    },
    hero: {
      badge: 'Staj ve iş birlikleri için uygunum',
      viewProjects: 'Projeleri Gör',
      contactMe: 'İletişime Geç',
      downloadCv: 'CV İndir'
    },
    sections: {
      aboutEyebrow: 'Hakkımda',
      aboutTitle: 'Backend odaklı güçlü yazılımlar geliştiriyorum',
      skillsEyebrow: 'Yetenekler',
      skillsTitle: 'Teknik güçlü yönler',
      skillsDescription:
        'Backend yazılım sistemlerini geliştirme, yayına alma ve sürdürülebilir şekilde yönetme konusunda pratik mühendislik yetkinliklerine odaklanıyorum.',
      projectsEyebrow: 'Projeler',
      projectsTitle: 'Öne çıkan yazılım projeleri',
      projectsDescription:
        'Bu bölüm düzenli bir veri kaynağı ile çalışır. Bağlantıları, başlıkları ve açıklamaları istediğin zaman kolayca güncelleyebilirsin.',
      projectsEmpty: 'Projeler eklendiğinde burada görünecek.',
      experienceEyebrow: 'Deneyim & Eğitim',
      experienceTitle: 'Profesyonel zaman çizelgesi',
      experienceDescription:
        'Stajlar, freelance çalışmalar ve backend odaklı projeler üzerinden eğitim ve pratik deneyimin kısa bir özeti.',
      contactEyebrow: 'İletişim',
      contactTitle: 'Birlikte anlamlı bir şey inşa edelim',
      contactDescription:
        'Staj, proje veya iş birliği için backend odaklı bir geliştirici arıyorsan benimle iletişime geçebilirsin.'
    },
    misc: {
      location: 'Konum',
      liveDemo: 'Canlı Demo ↗',
      liveDemoUnavailable: 'Canlı demo yok',
      professionalLinks: 'Profesyonel Linkler',
      directCommunication:
        'Doğrudan iletişimi tercih edersen rolünü, bağlamı ve zaman planını e-posta ile paylaş; en kısa sürede dönüş yaparım.',
      footer: 'Temiz ve backend odaklı portfolyo tasarımı ile hazırlandı.',
      backToTop: 'Yukarı dön'
    },
    form: {
      name: 'Ad Soyad',
      namePlaceholder: 'Ad soyadınızı yazın',
      email: 'E-posta',
      subject: 'Konu',
      subjectPlaceholder: 'Nasıl yardımcı olabilirim?',
      message: 'Mesaj',
      messagePlaceholder: 'Proje, rol veya iş birliği fikrinden bahsedebilirsin...',
      submit: 'Mesaj Gönder',
      submitting: 'Gönderiliyor...',
      success: 'Mesajın başarıyla gönderildi. En kısa sürede dönüş yapacağım.',
      secureText: 'Bu form sunucu tarafı doğrulama, honeypot alanı ve temel hız sınırlama ile korunur.',
      validation: {
        name: 'Lütfen ad soyad girin.',
        email: 'Lütfen geçerli bir e-posta adresi girin.',
        subject: 'Lütfen konu belirtin.',
        message: 'Lütfen en az 15 karakter yazın.',
        company: 'Bot gönderimi reddedildi.'
      }
    }
  }
} as const;
