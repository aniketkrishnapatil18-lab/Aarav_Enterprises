import React from 'react';

export default function AdminLogoCard({ admin, delay = 0, opacity = 1 }) {
  const client = admin;
  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';
  let logoUrl = client.logo_url
    ? (client.logo_url.startsWith('http') ? client.logo_url : `${baseUrl}${client.logo_url}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=7C3AED&color=fff&size=128&bold=true`;

  return (
    <div
      className="client-logo-card"
      style={{ '--delay': delay, '--card-opacity': opacity }}
      title={client.name}
    >
      <img
        src={logoUrl}
        alt={client.name}
        className="client-logo-img"
        loading="lazy"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=EFEFEF&color=7C3AED&size=128&bold=true&font-size=0.38`;
        }}
      />
    </div>
  );
}

