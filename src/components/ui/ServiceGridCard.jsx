import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ServiceGridCard = ({ service }) => (
  <Link
    to={`/service${service.id ? `?id=${service.id}` : ''}`}
    className="overflow-hidden rounded-positivus border-2 border-secondary bg-white shadow-positivus transition hover:shadow-xl"
  >
    <div className="aspect-video w-full bg-light">
      <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
    </div>
    <div className="p-4">
      <h3 className="line-clamp-2 text-base font-bold text-secondary">{service.title}</h3>
      <div className="mt-3 flex items-center gap-1 text-sm text-secondary">
        <Star size={14} className="fill-primary text-primary" />
        <span className="font-semibold">{service.rating}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-green-600">{service.price}</p>
      <p className="mt-1 text-sm text-secondary/70">{service.seller}</p>
    </div>
  </Link>
);

export default ServiceGridCard;
