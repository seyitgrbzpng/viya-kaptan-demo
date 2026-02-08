import { Link } from "wouter";

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white font-['Pacifico']">
                {settings?.site_title || "Viya Kaptan"}
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {settings?.footer_text || "Denizcilik ve karavan tutkunları için rehber. Açık denizlerde ve yollarda özgürlüğü keşfedin."}
            </p>
            <div className="flex items-center gap-4">
              {settings?.social_instagram && (
                <a 
                  href={settings.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
                >
                  <i className="ri-instagram-line text-lg"></i>
                </a>
              )}
              {settings?.social_youtube && (
                <a 
                  href={settings.social_youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
                >
                  <i className="ri-youtube-line text-lg"></i>
                </a>
              )}
              {settings?.social_twitter && (
                <a 
                  href={settings.social_twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
                >
                  <i className="ri-twitter-x-line text-lg"></i>
                </a>
              )}
              {settings?.social_facebook && (
                <a 
                  href={settings.social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors"
                >
                  <i className="ri-facebook-fill text-lg"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Denizcilik Rehberi
                </Link>
              </li>
              <li>
                <Link href="/karavan" className="text-gray-400 hover:text-white transition-colors">
                  Karavan Rotaları
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              {settings?.contact_email && (
                <li className="flex items-center gap-2 text-gray-400">
                  <i className="ri-mail-line"></i>
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings?.contact_phone && (
                <li className="flex items-center gap-2 text-gray-400">
                  <i className="ri-phone-line"></i>
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings?.contact_address && (
                <li className="flex items-start gap-2 text-gray-400">
                  <i className="ri-map-pin-line mt-1"></i>
                  <span>{settings.contact_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>
            {settings?.footer_copyright || `© ${currentYear} Viya Kaptan. Tüm hakları saklıdır.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
